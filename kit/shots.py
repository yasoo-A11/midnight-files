"""Draw single frames of a film at given times and build a contact sheet, to check the look before a full render.

usage: python3 kit/shots.py films/<slug> <tag> "t1,t2,..." [full]
"""
import asyncio, sys, io, time
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

ARGS = ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist", "--allow-file-access-from-files"]


async def main(HERE, times, tag, cols=4, full=False):
    out = HERE / "shots"
    out.mkdir(exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", headless=True, args=ARGS)
        pg = await b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=1)
        errs = []
        pg.on("console", lambda m: errs.append(f"console.{m.type}: {m.text}") if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        await pg.goto((HERE / "film.html").as_uri())
        try:
            await pg.wait_for_function("window.READY===true", timeout=20000)
        except Exception as e:
            print("NOT READY", e)
        for e in errs:
            print(e)
        if errs and not await pg.evaluate("window.READY===true"):
            await b.close()
            return
        ims = []
        t0 = time.time()
        for t in times:
            try:
                await pg.evaluate(f"renderFrame({t})")
            except Exception as e:
                print(f"t={t}: {str(e)[:600]}")
                continue
            buf = await pg.screenshot(type="jpeg", quality=92)
            im = Image.open(io.BytesIO(buf)).convert("RGB")
            if full:
                im.save(out / f"{tag}_{t:06.2f}.jpg", quality=92)
            ims.append((t, im))
        print(f"{len(ims)} frames, {(time.time()-t0)/max(1,len(ims))*1000:.0f} ms/frame")
        for e in errs:
            print(e)
        await b.close()
    tw, th = 480, 853
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (tw * cols, th * rows), (20, 20, 20))
    for i, (t, im) in enumerate(ims):
        sheet.paste(im.resize((tw, th), Image.LANCZOS), ((i % cols) * tw, (i // cols) * th))
    sheet.save(out / f"sheet_{tag}.jpg", quality=88)
    print("sheet", out / f"sheet_{tag}.jpg", sheet.size)


if __name__ == "__main__":
    film = Path(sys.argv[1]).resolve()
    tag = sys.argv[2]
    times = [float(x) for x in sys.argv[3].split(",")]
    full = len(sys.argv) > 4 and sys.argv[4] == "full"
    asyncio.run(main(film, times, tag, full=full))
