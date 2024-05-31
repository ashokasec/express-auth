// Package Imports
import express from "express";
import bodyParser from 'body-parser';
import helmet from "helmet";
import hpp from "hpp"
import compression from "compression"

// Congif & Utilities Imports
import { connect_to_db } from "@/utilities/connect.db";
import { NODE_ENV } from "@/config";

// Routes Imports
import AUTH_ROUTE from "@/routes/auth.route"

// Declarations and Initializations
const app = express();
const PORT = Bun.env.PORT;

// Security Practices
app.use(helmet())
app.use(hpp())

// Optimization Middleware Setup
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression({
  threshold: 0
}))

// Applications Routes
app.use("/auth", AUTH_ROUTE)

// Starting the App
app.listen(PORT, async () => {
  try {
    await connect_to_db()
    console.log(`Server is running on ${NODE_ENV === "development" ? "🌿 Development" : "⚡ Production"} Mode at port ${PORT}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    console.log(`🥲 Failed to start the server for ${NODE_ENV === "development" ? "🌿 Development" : "⚡ Production"} Mode at port ${PORT}`);
  }
});