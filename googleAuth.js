const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

module.exports = {
  getAuthUrl: () =>
    oAuth2Client.generateAuthUrl({ access_type: "offline", scope: SCOPES }),
  setCredentials: (tokens) => oAuth2Client.setCredentials(tokens),
  oAuth2Client,
};
