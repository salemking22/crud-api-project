// routes/authRoutes.js
import express from 'express';
import passport from '../middleware/auth.js';

const router = express.Router();

// Start OAuth login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure', session: true }),
    (req, res) => {
        res.redirect('/auth/success');
    }
);

// Success route
router.get('/auth/success', (req, res) => {
    res.send(`✅ Login successful! Welcome, ${req.user.displayName}`);
});

// Failure route
router.get('/auth/failure', (req, res) => {
    res.send('❌ Login failed.');
});

// Logout route
router.get('/auth/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

export default router;
