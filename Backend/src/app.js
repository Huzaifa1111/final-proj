import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

// Middlewares
import { corsOptions, sessionConfig } from "./middlewares/middleware.js";

// Routes
import router from "./routes/routes.js";

const app = express();

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Apply middlewares
app.use(corsOptions); // Enable CORS with configured options
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(sessionConfig); // Configure session management

// Apply routes
app.use("/api", router); // Combined routes for authentication, dashboard, and settings

export default app;