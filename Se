// Helper: Generate random token for AuthInfo or IDs
function generateRandomToken(length = 48) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Proxy route: /:channelId/manifest.mpd
app.get("/:channelId/manifest.mpd", (req, res) => {
  const { channelId } = req.params;

  const authInfo = generateAuthInfo(); // your existing AuthInfo generator
  const userSessionId = generateRandomToken(9); // numeric-ish 9 chars
  const IASHttpSessionId = generateRandomToken(38); // alphanumeric 40 chars

  const goToURL = `http://136.239.158.18:6610/001/2/ch0000009099000000${channelId}/manifest.mpd?JITPDRMType=Widevine&JITPMediaType=DASH&virtualDomain=001.live_hls.zte.com&ztecid=ch00000090990000001093&m4s_min=1&usersessionid=${userSessionId}&IASHttpSessionId=RR${IASHttpSessionId}&ispcode=55&NeedJITP=1&AuthInfo=${authInfo}`;

  res.redirect(goToURL);
});
