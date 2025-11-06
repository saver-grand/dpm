// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// Allow CORS (Kodi and web players need this)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// ✅ Fetch & rewrite the MPD manifest
app.get("/:id/manifest.mpd", async (req, res) => {
  const { id } = req.params;

  // Map your channel ID to the actual source
  const sourceUrl = `http://143.44.136.67:6060/001/2/ch00000090990000001093/manifest.mpd?JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1`;

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Source error: ${response.status}`);

    let body = await response.text();

    // Rewrite all internal URLs to go through /fetch proxy
    body = body.replace(
      /(https?:\/\/143\.44\.136\.67:6060[^\s"'<>\]]*)/g,
      (match) =>
        `${req.protocol}://${req.get("host")}/fetch?u=${encodeURIComponent(match)}`
    );

    res.set("Content-Type", response.headers.get("content-type") || "application/dash+xml");
    res.send(body);
  } catch (err) {
    console.error("Manifest proxy error:", err);
    res.status(500).send("Error fetching MPD manifest");
  }
});

// ✅ Fetch & stream .m4s or init segments with Range support
app.get("/fetch", async (req, res) => {
  const target = req.query.u;
  if (!target) return res.status(400).send("Missing ?u parameter");

  try {
    const r = await fetch(target, {
      headers: {
        Range: req.headers.range || "",
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        Referer: "https://render-proxy.local",
      },
    });

    res.status(r.status);
    r.headers.forEach((v, k) => res.setHeader(k, v));
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }

    if (r.body) r.body.pipe(res);
    else res.end();
  } catch (err) {
    console.error("Segment proxy error:", err);
    res.status(502).send("Error fetching segment");
  }
});

// ✅ Health check for Render
app.get("/", (req, res) => res.send("MPD Proxy is running ✅"));

// Start server
app.listen(PORT, () => console.log(`✅ MPD proxy running on port ${PORT}`));
