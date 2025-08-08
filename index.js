import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './passport.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
