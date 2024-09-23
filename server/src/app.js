// app.js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { typeDefs, resolvers } from './schema/index.js';
import sequelize from './config/database.js';
import { createUploadLink } from 'apollo-upload-client';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;


const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    return { token };
  },
});

// Middleware for parsing multipart/form-data
app.use(upload.single('primaryImage'));
app.use(upload.array('otherImages'));

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Starting the server
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  // Start the Express server
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);

    try {
      // Sync the database
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully.');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  });
};

startServer();
