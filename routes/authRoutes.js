// routes/authRoutes.js
import express from 'express';
import passport from '../middleware/auth.js';

const router = express.Router();

// Moved to /google instead of /auth/google (since we will mount it on /auth)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure', session: true }),
    (req, res) => {
        res.redirect('/auth/success');
    }
);

router.get('/success', (req, res) => {
    res.send(`✅ Login successful! Welcome, ${req.user.displayName}`);
});

router.get('/failure', (req, res) => {
    res.send('❌ Login failed.');
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

export default router;
