const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Helper: Generate random AuthInfo token
function generateAuthInfo(length = 48) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return encodeURIComponent(token);
}

// Proxy route: /:channelId/manifest.mpd
app.get("/:channelId/manifest.mpd", (req, res) => {
  const { channelId } = req.params;

  // Construct Go-to URL
  const goToURL = `http://136.239.159.20:6610/001/2/ch0000009099000000${channelId}/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1&IASHttpSessionId=RR20447520251203160116428304&ispcode=55&AuthInfo=${generateAuthInfo()}`;

  // Redirect client to Go-to URL
  res.redirect(goToURL);
});

// Health check
app.get("/", (req, res) => {
  res.send("AuthInfo Proxy is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
