// config/passport.js
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        "profile",
        "email",
        "openid",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      // Save or find the user in the database here
      return done(null, { profile, accessToken, refreshToken });
    }
  )
);

// Serialize user to save in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user to retrieve from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
