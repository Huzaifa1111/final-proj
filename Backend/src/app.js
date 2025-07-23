import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { sessionConfig } from "./middlewares/middleware.js";
import router from "./routes/routes.js";

// Configure dotenv
dotenv.config({
  path: "./.env",
});

const app = express();

// Apply CORS middleware
app.use(
  cors({
    origin: ["https://<your-frontend-url>.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'Uploads')));

// Apply middlewares
app.use(express.json());
app.use(cookieParser());
app.use(sessionConfig);

// Apply routes
app.use("/api", router);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

export default app;