# Midnight Files

Short vertical "strange history" films made entirely with code: one a day, in English, 50 to 60 seconds, 1080x1920 at 30 fps.
The picture is drawn frame by frame in headless Chrome (WebGL sky + Canvas 2D), the music and effects are synthesized
with numpy, and the narration is text-to-speech. No stock footage, no generated images, no video editor.

Read this file before you make a film. `films/2026-11-20-black-friday/` is the worked example of every step.

## Rules that are not up for negotiation

- Every fact on screen or in the narration is checked against at least two independent sources, and the sources go in
  the film's `sources.md`. A number on screen names where it comes from. If sources disagree on a date, use the wording
  the stronger source supports ("the 1950s", not one invented year).
- Nothing invented is presented as real: no made-up quotations in quotation marks, no fake headlines attributed to a
  real paper, no real logos, no known characters, no photos or likenesses of real people. Props such as a ledger or a
  news clipping are generic and plainly illustrative.
- No how-to for weapons, drugs, break-ins or anything else that could hurt someone; no medical or money advice; no
  elections or party politics; nothing about a tragedy that is still in the news. Keep it suitable for a general audience.
- One film per run. Never delete or overwrite an earlier film's folder, a published video, a post or a log entry.
- Account names, IDs and the posting schedule are not in this repository (it is public). They come with the task that
  starts the run.

## What a good film looks like

- A question people are asking this week (a holiday, an anniversary, a season, an event) with an answer that surprises:
  the origin of a name, the story everyone was told that is not true, the day something odd really happened.
  It should still be worth watching after the date has passed. Check `TOPICS.md` so nothing repeats.
- 130 to 150 words of narration. Short sentences. The first sentence states the belief; the second breaks it.
  Three to five beats, each one idea and one picture. One beat with a big number. It ends on a question to the
  viewer, and "Tell us in the comments." appears on screen only.
- The first frame is the cover: title, the claim, and the first caption already visible.
- Each beat has one moment of impact (a stamp, a crash, a reveal) that lands on the spoken word it belongs to:
  a flash, a camera shake and a hit in the soundtrack share the same timestamp.

## Layout of a frame (1080x1920)

- Header zone, y < 320: the brand line "Midnight Files" and two lines for date and place (`HEAD` rows). Keep it clear.
- Content zone, y 340 to 1240: everything the viewer has to read.
- Caption tape at y 1284 to 1396: cream paper strip, one chunk of 2 to 5 words, the spoken word in crimson.
- Below the tape the platforms draw their own buttons and text. Use it for ambience only (the city, the sun).
- Palette (`C` in `kit/engine.js`): paper #EFE6D2, ink #120E0B, crimson #FF2B45, deep #C4122F, amber #FFB64D,
  hot #FFF3DC, blue #7FB8FF, green #63FFC2, night #05070D, black #030406. Crimson is for the turn in the story.
- Type (`F`): `F.num` and `F.rom`/`F.ital`/`F.romB` are Latin Modern (titles, handwriting, ledger text),
  `F.slab(px, weight)` is Bitter (numbers, stamps, signs, captions). Both fonts are installed in the cloud image.

## Making a film, step by step

Work from the repository root. `S=films/<yyyy-mm-dd>-<slug>`.

1. **Topic and facts.** Search the web, pick the topic, verify the hook and every beat. Write `$S/sources.md`.
2. **Narration.** Write `$S/narration.txt` (numbers spelled out as they should be spoken).
3. **Voice.** Speko text-to-speech: voice `Charon`, language `en-US`, provider `google-tts:gemini-3.8-flash-lite-tts`,
   instructions along the lines of "Documentary narrator, low and calm, a little conspiratorial. Speak FAST, about 170
   words per minute." Aim for 52 to 56 s; if it is longer, cut words rather than speeding up further.
   Save the audio as `$S/vo.wav`. Transcribe it with word timestamps and save `[[word, start_s, end_s], ...]` as
   `$S/words.json`.
4. **Captions.** Write `$S/captions.txt`: the transcript's words in order, one caption chunk per line, broken where a
   reader would pause. Then `python3 kit/make_timeline.py $S <film seconds>` (film length = narration + about 2.5 s).
   The narration starts 0.25 s into the film; every time in `timeline.js` is in film seconds.
5. **Landmarks.** List the film time of each key word (from `timeline.js`). Scenes, flashes and sounds are keyed to it.
6. **Picture.** Copy `film.html` from the example and write `$S/scenes.js`: `HEAD`, `FLASH`, `SHAKE` rows, `glParams(t)`
   for the sky, one function per scene, the scene list `SC`, and `renderFrame(t)`. Read the example's `scenes.js` first;
   lift its pieces (wipe, card, stamp, counter, glowing chart, street grid, list rows, marquee, dot grid, the persistent
   city, the slow push-in in the master loop) rather than starting from nothing. Scenes overlap by 0.2 to 0.3 s and
   fade with `env()`. Everything is a pure function of `t`: no timers, no `Math.random()` (use `rnd(n)`).
7. **Look at it.** `python3 kit/shots.py $S <tag> "t1,t2,..."` draws those frames and a contact sheet in `$S/shots/`.
   Check every scene at its busiest moment and at every cross-fade before rendering. Add `full` to keep full-size frames.
8. **Sound.** Write `$S/audio.py` with `build(N)` returning the music and effects stems (see the example), then run it.
   It mixes with the narration, prints a level table and a masking check, and writes `soundtrack.wav` at -14 LUFS.
   The masking check should say `none`; if it lists a second, turn that sound down.
9. **Render.** Write `$S/cuts.json` (scene files cut at scene changes; the last end frame is film seconds x 30) and run
   two workers: `python3 kit/render.py $S 0 2 & python3 kit/render.py $S 1 2 & wait`.
   A finished scene file is skipped, so to change one scene delete its file in `$S/parts/` and run again.
10. **Finish.** `kit/finish.sh $S midnight-files-<slug>` joins, adds sound and writes the master and the upload copy.
11. **Check the finished file,** not the working frames: pull 20 or so frames from the upload copy with ffmpeg and look
    at them; confirm duration, frame count, that it decodes, and the loudness line.
12. **Log.** Add the film to `TOPICS.md`, write `$S/post.md` (title, caption, hashtags), commit the folder.

## Engine notes (`kit/engine.js`, `kit/art.js`)

- Helpers: `clamp, lerp, prog(t,a,b), E.{io,o,o5,i,i2,back}, rnd(n), vn(x), env(t,a,b,fadeIn,fadeOut), kf(t,[[t,v],...])`.
- Drawing: `A(v)` sets alpha (scaled by the scene's `BA`), `txt(s,x,y,{font,align,base,ls,glow,blur,fill})`,
  `ink(width,colour)`, `seg`, `mkPath`/`drawOn`/`strokeSet` for line art that draws itself, `glowLine`,
  `strokeRange(points,u0,u1)` and `ptAt` for charts, `sparks`, `buildCity()`.
- `drawGL(t, {aur, red, base, span, star, glow, sun:[x,y,r,alpha], flare, spots, boil})` paints the sky; `sun` doubles
  as any large glowing disc.
- `drawHeader`, `drawCaptions`, `drawFlashes`, `drawFx` are called by the film's `renderFrame` after the scenes.
- The film must end its `scenes.js` with `buildTextures(); window.READY=true;`.

## Things learned the hard way

- Look at frames, never assume. A scene that reads well in code can be empty for two seconds or sit under the tape.
- A persistent element drawn inside zoomed scenes jumps at every cut. Draw it once in the master loop, outside the zoom.
- Glowing strokes (`glowLine`) are slow to render: a scene full of them takes about 0.6 s a frame. Plan the cuts so
  such a scene is its own file.
- Keep text for one idea on screen at least 1.2 s. Big type for the thing being said, small italics for the footnote.
- In the mix, choirs and long hits under a sentence are the usual cause of masking. Short sounds between words are safe.
- The upload copy is what gets published. It is visually the same as the master at half the size.
