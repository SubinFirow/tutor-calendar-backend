const express = require("express");
const router = express.Router();
const { getAuthUrl, setCredentials, oAuth2Client } = require("../googleAuth");

router.get("/google", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oAuth2Client.getToken(code);
  setCredentials(tokens);
  res.send("Google Calendar connected");
});

module.exports = router;
