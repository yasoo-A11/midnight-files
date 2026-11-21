#!/usr/bin/env bash
# Joins the rendered scene files of a film, adds the soundtrack and writes two files into the film folder:
#   <name>-master.mp4  the picture exactly as rendered (crf 18), roughly 35 MB a minute
#   <name>.mp4         the upload copy: two-pass H.264 at about 2.5 Mbit/s (under 20 MB a minute), visually the same
# usage: kit/finish.sh films/<slug> <name>
set -euo pipefail
F="$(cd "$1" && pwd)"; NAME="$2"
cd "$F"
ls parts/*.mp4 | sort | sed "s|^|file '$F/|;s|$|'|" > concat.txt
ffmpeg -y -v error -f concat -safe 0 -i concat.txt -c copy video_only.mp4
ffmpeg -y -v error -i video_only.mp4 -i soundtrack.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart "$NAME-master.mp4"
X="aq-mode=3:keyint=60"
COL="-pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709"
ffmpeg -y -v error -i video_only.mp4 -an -c:v libx264 -preset slower -b:v 2460k -pass 1 -passlogfile /tmp/mf2pass -x264-params "$X" $COL -f mp4 /dev/null
ffmpeg -y -v error -i video_only.mp4 -i soundtrack.wav -map 0:v -map 1:a -c:v libx264 -preset slower -b:v 2460k -pass 2 -passlogfile /tmp/mf2pass -x264-params "$X" $COL -c:a aac -b:a 192k -movflags +faststart "$NAME.mp4"
for f in "$NAME-master.mp4" "$NAME.mp4"; do
  echo "== $f"
  ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,nb_frames -of default=nw=1 "$f"
  ffmpeg -v error -i "$f" -f null - && echo "decodes cleanly"
done
echo "== loudness of the upload copy (target about -14 LUFS, peak under -1.5 dBFS)"
ffmpeg -hide_banner -nostats -i "$NAME.mp4" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +I:|Peak:" | tail -2
