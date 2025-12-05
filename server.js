const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Helper: Generate AuthInfo token (Base64-like) and URL-encode
function generateAuthInfo(length = 48) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; // Base64-like
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return encodeURIComponent(token);
}

// Helper: Generate numeric usersessionid
function generateUserSessionId() {
  // 9-digit numeric string
  return Math.floor(100000000 + Math.random() * 900000000);
}

// Home page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AuthInfo Proxy</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
        <h1>WELCOME</h1>
        <p>😀</p>
        <p>ENJOY YOUR LIFE</p>
      </body>
    </html>
  `);
});

// Proxy route: /:channelId/manifest.mpd
app.get("/:channelId/manifest.mpd", (req, res) => {
  const { channelId } = req.params;

  const authInfo = generateAuthInfo();               // URL-encoded AuthInfo
  const userSessionId = generateUserSessionId(9);     // numeric 9-digit
  const IASHttpSessionId = generateAuthInfo(38);     // 40-char URL-encoded token

  const goToURL = `http://136.239.158.18:6610/001/2/ch0000009099000000${channelId}/manifest.mpd?JITPDRMType=Widevine&JITPMediaType=DASH&virtualDomain=001.live_hls.zte.com&ztecid=ch00000090990000001093&m4s_min=1&usersessionid=${userSessionId}&IASHttpSessionId=RR${IASHttpSessionId}&ispcode=55&NeedJITP=1&AuthInfo=${authInfo}`;

  // Redirect client to Go-to URL
  res.redirect(goToURL);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

