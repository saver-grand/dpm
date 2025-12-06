const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Generate random PH IP (Globe/Smart range)
function randomPhilippinesIP() {
  const octet1 = 49;       // Fixed PH Range start
  const octet2 = 144 + Math.floor(Math.random() * 4); // 144–147
  const octet3 = Math.floor(Math.random() * 256);
  const octet4 = Math.floor(Math.random() * 256);
  return `${octet1}.${octet2}.${octet3}.${octet4}`;
}

// Generate Base64 AuthInfo (URL encoded)
function generateAuthInfo(length = 48) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
    bytes.push(Math.floor(Math.random() * 256));
  }
  return encodeURIComponent(Buffer.from(bytes).toString("base64"));
}

// Generate numeric usersessionid
function generateUserSessionId() {
  return Math.floor(100000000 + Math.random() * 900000000);
}

// Generate numeric IASHttpSessionId
function generateIASHttpSessionId(length = 26) {
  let id = "";
  for (let i = 0; i < length; i++) id += Math.floor(Math.random() * 10);
  return id;
}

// Home page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>AuthInfo Proxy</title></head>
      <body style="font-family: Arial; text-align:center; margin-top:50px;">
        <h1>WELCOME</h1>
        <p>😀</p>
        <p>ENJOY YOUR LIFE</p>
      </body>
    </html>
  `);
});

// Proxy route
app.get("/:channelId/manifest.mpd", (req, res) => {
  const { channelId } = req.params;

  const authInfo = generateAuthInfo();
  const userSessionId = generateUserSessionId();
  const IASHttpSessionId = generateIASHttpSessionId();
  const randomIP = randomPhilippinesIP();   // ← NEW (Random PH IP)

  const goToURL = `http://143.44.136.67:6060/001/2/ch0000009099000000${channelId}/manifest.mpd?JITPDRMType=Widevine&JITPMediaType=DASH&virtualDomain=001.live_hls.zte.com&ztecid=ch00000090990000001093&m4s_min=1&stbMac=02:00:00:00:00:00&stbIp=${randomIP}&stbId=02:00:00:00:00:00&TerminalFlag=1&usersessionid=${userSessionId}&IASHttpSessionId=RR${IASHttpSessionId}&AuthInfo=${authInfo}`;

  res.redirect(goToURL);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
