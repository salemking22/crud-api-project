// middleware/auth.js
export function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized – Please log in' });
    }
}
