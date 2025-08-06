import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import contactsRouter from './routes/contacts.js';
import servicesRouter from './routes/services.js';
import swaggerUi from 'swagger-ui-express';
import './middleware/auth.js'; // ✅ Passport config

dotenv.config();

const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('./swagger.json'), 'utf8')
);

const app = express();
const port = process.env.PORT || 3000;

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🔐 Express session middleware (with .env secret)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// 🔐 Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// 📦 API Routes
app.use('/api/contacts', contactsRouter);
app.use('/api/services', servicesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 👥 Google OAuth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failure',
        session: true,
    }),
    (req, res) => {
        console.log('✅ Google authentication successful');
        res.redirect('/auth/protected');
    }
);

app.get('/auth/failure', (req, res) => {
    res.send('Authentication failed. Please try again.');
});

app.get('/auth/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}, you're authenticated ✅`);
});

app.get('/auth/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// 🛡️ Middleware to protect routes
function isLoggedIn(req, res, next) {
    if (req.user) {
        return next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

// 🏠 Root route
app.get('/', (req, res) => {
    res.send('Contacts API is running 🎉');
});

// 🌍 Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB ✅');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
