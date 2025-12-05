const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Helper: Generate proper Base64 AuthInfo and URL-encode
function generateAuthInfo(length = 48) {
  // Generate random bytes
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  // Convert to Base64
  const base64 = Buffer.from(bytes).toString("base64");
  // URL-encode
  return encodeURIComponent(base64);
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

  const authInfo = generateAuthInfo();                 // URL-encoded Base64
  const userSessionId = generateUserSessionId();       // numeric 9-digit
  const IASHttpSessionId = generateIASHttpSessionId(); // numeric 12-digit

  const goToURL = `http://143.44.136.67:6060/001/2/ch0000009099000000${channelId}/manifest.mpd?JITPDRMType=Widevine&JITPMediaType=DASH&virtualDomain=001.live_hls.zte.com&ztecid=ch00000090990000001093&m4s_min=1&stbMac=02:00:00:00:00:00&stbIp=192.168.1.102&stbId=02:00:00:00:00:00&TerminalFlag=1&usersessionid=${userSessionId}&IASHttpSessionId=RR${IASHttpSessionId}&AuthInfo=${authInfo}`;

  // Redirect client to Go-to URL
  res.redirect(goToURL);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
