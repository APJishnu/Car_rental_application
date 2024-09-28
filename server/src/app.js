import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { typeDefs, resolvers } from './graphql/schema.js';
import sequelize from './config/database.js';
import { graphqlUploadExpress } from 'graphql-upload';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token }; // Make sure to handle this token in your resolvers
  },
});

// Middleware setup
app.use(cors());

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
