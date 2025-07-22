import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from './app.js';
import cors from 'cors';

// Configure dotenv
dotenv.config({
    path: './.env'
});

// Apply CORS middleware to allow requests from Vercel frontend
app.use(cors({
    origin: ['https://tailor-backend-6vd9.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log(`⚙️ Server is running at port: ${port}`);
        });

        // Handle Vercel serverless function response
        app.get('/api/health', (req, res) => {
            res.status(200).json({ status: 'OK', message: 'Server is running' });
        });
    })
    .catch((err) => {
        console.error("MONGO db connection failed !!! ", err);
        process.exit(1); // Exit process on failure
    });

// Export the app for Vercel's serverless functions
export default app;