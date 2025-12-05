const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Helper: Generate AuthInfo token (Base64-like) and URL-encode
function generateAuthInfo(length = 48) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return encodeURIComponent(token);
}

// Helper: Generate numeric usersessionid (9-digit)
function generateUserSessionId() {
  return Math.floor(100000000 + Math.random() * 900000000);
}

// Helper: Generate numeric IASHttpSessionId (12-digit)
function generateIASHttpSessionId(length = 26) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
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

  const authInfo = generateAuthInfo();                 // URL-encoded AuthInfo
  const userSessionId = generateUserSessionId();       // numeric 9-digit
  const IASHttpSessionId = generateIASHttpSessionId(); // numeric 12-digit

  const goToURL = `http://143.44.136.67:6060/001/2/ch0000009099000000${channelId}/manifest.mpd?JITPDRMType=Widevine&JITPMediaType=DASH&virtualDomain=001.live_hls.zte.com&m4s_min=1&usersessionid=${userSessionId}&IASHttpSessionId=RR${IASHttpSessionId}&AuthInfo=${authInfo}`;

  // Redirect client to Go-to URL
  res.redirect(goToURL);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
