// index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './middleware/auth.js';
import contactRoutes from './routes/contacts.js';
import serviceRoutes from './routes/services.js';
import authRoutes from './routes/authRoutes.js'; // ✅ Add this line

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/contacts', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/', authRoutes); // ✅ Add this too

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('❌ Failed to connect to MongoDB:', err.message);
    });
