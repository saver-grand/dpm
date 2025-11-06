import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

// Map short IDs to long URLs
const links = {
  "1093": "http://143.44.136.67:6060/001/2/ch00000090990000001093/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1"
};

// Redirect route
app.get("/:id", (req, res) => {
  const target = links[req.params.id];
  if (!target) {
    return res.status(404).send("Not found");
  }

  // 302 redirect to the full URL
  res.redirect(target);
});

// Root page for quick check
app.get("/", (req, res) => res.send("✅ MPD shortlink server running"));

app.listen(PORT, () => console.log(`✅ Shortlink server running on port ${PORT}`));
