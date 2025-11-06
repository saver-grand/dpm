import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// Proxy MPD request
app.get("/:id/manifest.mpd", async (req, res) => {
  const { id } = req.params;

  // Map your new Render route ID to the original URL
  const sourceUrl = `http://143.44.136.67:6060/001/2/ch0000009099000000${id}/manifest.mpd?AuthInfo=DvftfiQOMAT%2Fl3VKz%2F6TxrBYt0tiYrnNALuVtfVicLxYxw0MdBePEXRMFugy%2F7SueCmaIII5rdrbbPKvAVYUlQ%3D%3D&JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1`;

  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`Failed with status ${response.status}`);

    // Forward headers
    res.set("Content-Type", response.headers.get("content-type") || "application/dash+xml");

    // Send manifest content to client
    const body = await response.text();
    res.send(body);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching MPD manifest");
  }
});

app.listen(PORT, () => console.log(`✅ MPD proxy running on port ${PORT}`));
