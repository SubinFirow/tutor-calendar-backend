// routes/auth.js
const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "openid",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://tutor-calendar-frontend.vercel.app//login",
  }),
  async (req, res) => {
    res.redirect(
      `https://tutor-calendar-frontend.vercel.app?access_token=${req.user.accessToken}&name=${req?.user?.profile.displayName}`
    );
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
