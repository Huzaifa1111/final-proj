import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import cors from "cors";

// Configure dotenv
dotenv.config({
  path: "./.env",
});

// Apply CORS middleware to allow requests from Vercel frontend
app.use(
  cors({
    origin: ["https://tailor-backend-6vd9.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Health check endpoint for Vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1); // Exit process on failure
});

// Export the app for Vercel's serverless functions
export default app;