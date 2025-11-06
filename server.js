import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// Base source (template for manifest and segment fetching)
const SOURCE_BASE = "http://143.44.136.67:6060";

// Route to serve MPD manifest
app.get("/:id/manifest.mpd", async (req, res) => {
  const { id } = req.params;

  // Original manifest URL (replace with your real mapping logic)
  const sourceUrl = `${SOURCE_BASE}/001/2/ch0000009099000000${id}/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1`;

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Failed with status ${response.status}`);

    let body = await response.text();

    // Rewrite segment URLs to route through our proxy
    // Example: replace "http://143.44.136.67:6060" → "https://your-render-app/fetch?u=http://143.44.136.67:6060"
    body = body.replaceAll(
      /http:\/\/143\.44\.136\.67:6060/g,
      `${req.protocol}://${req.get("host")}/fetch?u=http://143.44.136.67:6060`
    );

    res.set("Content-Type", response.headers.get("content-type") || "application/dash+xml");
    res.set("Access-Control-Allow-Origin", "*");
    res.send(body);
  } catch (err) {
    console.error("Manifest error:", err);
    res.status(500).send("Error fetching MPD manifest");
  }
});

// Route to proxy media segments (.m4s, .mp4, etc.)
app.get("/fetch", async (req, res) => {
  const targetUrl = req.query.u;
  if (!targetUrl) return res.status(400).send("Missing 'u' parameter");

  try {
    const response = await fetch(targetUrl, {
      headers: { Range: req.headers.range || "" },
    });

    if (!response.ok && response.status !== 206)
      throw new Error(`Segment fetch failed: ${response.status}`);

    res.set("Access-Control-Allow-Origin", "*");
    res.set("Content-Type", response.headers.get("content-type") || "video/mp4");

    // Stream the content
    response.body.pipe(res);
  } catch (err) {
    console.error("Segment error:", err);
    res.status(500).send("Error fetching segment");
  }
});

// Simple health check
app.get("/", (req, res) => {
  res.send("MPD proxy active");
});

app.listen(PORT, () => console.log(`✅ MPD proxy running on port ${PORT}`));
