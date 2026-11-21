"""Films film.html frame by frame in headless Chrome and encodes one H.264 file per scene.

usage: render.py <worker_index> <worker_count> [crf]
Scenes are split between workers; a scene that already has a finished file is skipped.
"""
import asyncio, subprocess, sys, time
from pathlib import Path
from playwright.async_api import async_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "parts"
FPS = 30
# [name, first frame, end frame (exclusive)] - cut at scene changes
SCENES = [("01_desk", 0, 165), ("02_sky", 165, 240), ("03_sun", 240, 423), ("04_storm", 423, 526), ("05_red_sky", 526, 600),
          ("06_globe", 600, 681), ("07_birds", 681, 765), ("08_haywire", 765, 945), ("09_boston", 945, 1137), ("10_title", 1137, 1275),
          ("11_2012", 1275, 1467), ("12_damage", 1467, 1563), ("13_question", 1563, 1740)]
ARGS = ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"]


def encoder(path, crf):
    cmd = ["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
           "-vf", "scale=in_color_matrix=bt601:in_range=full:out_color_matrix=bt709:out_range=tv,format=yuv420p",
           "-c:v", "libx264", "-preset", "veryfast", "-crf", str(crf), "-pix_fmt", "yuv420p", "-r", str(FPS), "-g", "60",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", str(path)]
    return subprocess.Popen(cmd, stdin=subprocess.PIPE)


def split(wn):
    """Share scenes between workers so each gets about the same number of frames (longest first, to the lightest worker)."""
    loads, out = [0] * wn, [[] for _ in range(wn)]
    for s in sorted(SCENES, key=lambda s: s[1] - s[2]):
        i = loads.index(min(loads))
        out[i].append(s)
        loads[i] += s[2] - s[1]
    return out


async def main(wi, wn, crf):
    OUT.mkdir(exist_ok=True)
    mine = split(wn)[wi]
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", headless=True, args=ARGS)
        pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto((HERE / "film.html").as_uri())
        await pg.wait_for_function("window.READY===true", timeout=30000)
        for name, f0, f1 in mine:
            final, tmp = OUT / f"{name}.mp4", OUT / f"{name}.tmp.mp4"
            if final.exists():
                print(f"[{wi}] {name}: already done", flush=True)
                continue
            t0 = time.time()
            enc = encoder(tmp, crf)
            try:
                for f in range(f0, f1):
                    await pg.evaluate(f"renderFrame({f / FPS:.6f})")
                    enc.stdin.write(await pg.screenshot(type="jpeg", quality=92))
                enc.stdin.close()
                rc = enc.wait()
            except Exception:
                enc.kill()
                raise
            if errs:
                raise RuntimeError(f"page errors in {name}: {errs[:3]}")
            if rc != 0:
                raise RuntimeError(f"ffmpeg failed on {name} (exit {rc})")
            tmp.rename(final)
            print(f"[{wi}] {name}: {f1 - f0} frames in {time.time() - t0:.0f}s", flush=True)
        await b.close()


if __name__ == "__main__":
    asyncio.run(main(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]) if len(sys.argv) > 3 else 20))
