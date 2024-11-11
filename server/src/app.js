import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import { typeDefs, resolvers } from "./graphql/schema.js";
import sequelize from "./config/database.js";
import { graphqlUploadExpress } from "graphql-upload";
import dotenv from "dotenv";
import session from "express-session";
import "./modules/admin/models/assosiations.js";
import "./modules/user/models/booking-model.js";
import BookingStatusService from "./config/cron.js";
import seedAdmin from "./seed.js";
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.BASE_PORT || 5000;
const hostname = "0.0.0.0";

BookingStatusService.startStatusUpdateJob();

// Session middleware configuration
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 },
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    if (err) {
      console.log(err);
      return {
        message: err.message,
      };
    }
  },
  context: ({ req, res }) => {
    const token = req.headers.authorization || "";
    return { token, req, res, session: req.session };
  },
});

// Middleware setup
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

// Starting the server
const startServer = async () => {
  await server.start();

  server.applyMiddleware({ app });

  app.listen(PORT, hostname, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    try {
      await sequelize.sync({ alter: true });
      console.log("Database synced successfully.");
      await seedAdmin();
    } catch (error) {
      console.error("Error syncing database:", error);
    }
  });
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
startServer();
