import User from '../models/User.js';

import cors from "cors";

import session from "express-session";



const corsOptions = cors({

    origin: process.env.CORS_ORIGIN || "http://localhost:5173",

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"]

});



const sessionConfig = session({

    secret: process.env.SESSION_SECRET || "113fd322mf32ndwsd2r432tr32rdwdsa",

    resave: false,

    saveUninitialized: false,

    cookie: {

        secure: false, // true if using HTTPS

        httpOnly: true,

        maxAge: 24 * 60 * 60 * 1000, // 1 day

    }

});



const isAuthenticated = async (req, res, next) => {

  console.log('isAuthenticated - Session ID:', req.sessionID);

  console.log('isAuthenticated - Session data:', req.session);

  if (req.session.userId) {

    try {

      const user = await User.findById(req.session.userId);

      if (user) {

        console.log('isAuthenticated - Found user:', user.username, 'ID:', user._id);

        req.user = user;

        return next();

      } else {

        console.log('isAuthenticated - User not found for ID:', req.session.userId);

        return res.status(401).json({ message: 'Unauthorized: User not found' });

      }

    } catch (error) {

      console.error('isAuthenticated - Database error:', error.message, error.stack);

      return res.status(500).json({ message: 'Server error in authentication', error: error.message });

    }

  } else {

    console.log('isAuthenticated - No userId in session');

    return res.status(401).json({ message: 'Unauthorized: No session' });

  }

};



export { corsOptions, sessionConfig, isAuthenticated };