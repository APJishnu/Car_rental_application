import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { typeDefs, resolvers } from './graphql/schema.js';
import sequelize from './config/database.js';
import { graphqlUploadExpress } from 'graphql-upload';
import dotenv from 'dotenv';
import './modules/admin/models/assosiations.js'; // Import associations after models
import session from 'express-session';
import cron from 'node-cron';
import CleanupHelper from './utils/clean-up-otp.js';
import './modules/user/models/booking-model.js'


dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;


// Schedule a task to run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  await CleanupHelper.deleteExpiredOTPs();
});


// Session middleware configuration
app.use(session({
  secret: 'your-secret-key', // Change this to a random secret
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
}));


// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,


  formatError:(err)=>{
      console.log("error in formatError");

      if(err){
        console.log(err)
        return {
          
          message: err.message,
        }
      }
  },


  context: ({ req ,res }) => {
    const token = req.headers.authorization || '';
    return { token,req, res ,session: req.session }; // Make sure to handle this token in your resolvers
  },
});

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000', // Allow your front-end's origin
  credentials: true, // Allow cookies or credentials (optional based on your session usage)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

app.use('/uploads', express.static('uploads'));


// Starting the server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  

  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);

    try {
      await sequelize.sync({ alter: true }); // Be cautious with 'alter: true' in production
      console.log('Database synced successfully.');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  });
};


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!'); // Generic error response
});

// Start the server
startServer();
