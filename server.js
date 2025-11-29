require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 8080;

// Load MPD sources from .env
const mpdSources = {};

Object.keys(process.env).forEach((key) => {
  if (key.startsWith("MPD_") && key.endsWith("_NAME")) {
    const base = key.replace("_NAME", "");
    const name = process.env[key];
    const url = process.env[base + "_URL"];
    if (name && url) {
      mpdSources[name] = url;
    }
  }
});

console.log("Loaded MPDs:", mpdSources);

// ===========================
// Serve MPD manifest
// ===========================
app.get("/:name/manifest.mpd", async (req, res) => {
  const name = req.params.name;

  if (!mpdSources[name]) {
    return res.status(404).send("MPD not found in .env");
  }

  try {
    const response = await fetch(mpdSources[name]);
    let mpd = await response.text();

    // Rewrite BaseURL
    mpd = mpd.replace(
      /<BaseURL>.*<\/BaseURL>/g,
      `<BaseURL>/${name}/segments/</BaseURL>`
    );

    res.set("Content-Type", "application/dash+xml");
    res.send(mpd);
  } catch (err) {
    res.status(500).send("Error fetching MPD");
  }
});

// ===========================
// Serve segments
// ===========================
app.get("/:name/segments/:file", async (req, res) => {
  const name = req.params.name;
  const file = req.params.file;

  if (!mpdSources[name]) {
    return res.status(404).send("Unknown MPD");
  }

  const baseUrl = mpdSources[name].replace("manifest.mpd", "");
  const segmentUrl = baseUrl + file;

  try {
    const response = await fetch(segmentUrl);
    res.set("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Segment fetch error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
