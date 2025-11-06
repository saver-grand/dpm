#!/bin/bash

# Your input DASH stream (must be non-DRM!)
INPUT_URL="http://143.44.136.67:6060/001/2/ch00000090990000001093/manifest.mpd?AuthInfo=DvftfiQOMAT%2Fl3VKz%2F6TxrBYt0tiYrnNALuVtfVicLxYxw0MdBePEXRMFugy%2F7SueCmaIII5rdrbbPKvAVYUlQ%3D%3D&JITPDRMType=Widevine&virtualDomain=001.live_hls.zte.com&m4s_min=1"

# Output path
OUTPUT_PATH="/app/public/stream"

# Start restreaming in the background
ffmpeg -re -i "$INPUT_URL" \
  -c copy \
  -f dash \
  -seg_duration 4 \
  -use_template 1 \
  -use_timeline 1 \
  "$OUTPUT_PATH/output.mpd" &

# Start nginx to serve it
nginx -g "daemon off;"
