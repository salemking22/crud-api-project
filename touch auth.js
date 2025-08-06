// auth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, done) {
            // You can save the user info in your DB here if needed
            console.log('Google Profile:', profile);
            return done(null, profile);
        }
    )
);

// Serialize user info into session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user info from session
passport.deserializeUser((user, done) => {
    done(null, user);
});
