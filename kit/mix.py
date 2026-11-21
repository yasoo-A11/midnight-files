"""Mixes a film's soundtrack: the narration (vo.wav) plus the music and effects stems that the film's audio.py builds.

    mix(film_dir, build, dur, vo_offset=0.25)

`build(N)` returns two float arrays of shape (N, 2): music and effects, already reverberated.
Writes soundtrack.wav (-14 LUFS), the two stems, and prints a level table plus a masking check:
every second in which the narrator speaks should stay at least ~7 dB above everything else in the speech band.
"""
import wave, subprocess
from pathlib import Path
import numpy as np
from sound import SR, lp, bp


def db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)


def mix(film_dir, build, dur, vo_offset=0.25, vo_file="vo.wav", music_gain=0.30, sfx_gain=0.80):
    film_dir = Path(film_dir)
    N = int(SR * dur)
    music, sfx = build(N)
    vo_path = film_dir / "vo_proc.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(film_dir / vo_file), "-af",
                    "highpass=f=75,acompressor=threshold=-21dB:ratio=3:attack=8:release=120:makeup=3,loudnorm=I=-17:TP=-2:LRA=7",
                    "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(vo_path)], check=True)
    with wave.open(str(vo_path)) as w:
        vo = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    vo = np.concatenate([np.zeros(int(vo_offset * SR)), vo])
    print(f"narration ends at {len(vo) / SR:.2f}s of {dur}s")
    if len(vo) > N:
        raise SystemExit("the narration is longer than the film")
    vo = np.pad(vo, (0, N - len(vo)))
    envl = lp(np.abs(vo), 6)
    duck = lp(1 - 0.5 * np.clip(envl / (np.percentile(envl, 90) + 1e-9), 0, 1), 4)

    print(f"rms dBFS  vo {db(vo[vo != 0]):.1f}  music {db(music * music_gain):.1f}  sfx {db(sfx * sfx_gain):.1f}  "
          f"peaks vo {np.abs(vo).max():.2f} music {np.abs(music).max() * music_gain:.2f} sfx {np.abs(sfx).max() * sfx_gain:.2f}")
    bed = music * duck[:, None] * music_gain + sfx * (0.75 + 0.25 * duck[:, None]) * sfx_gain
    vb, bb = bp(vo, 300, 3400), bp(bed.mean(axis=1), 300, 3400)
    low = []
    for i in range(0, N - SR + 1, SR):
        a, b = db(vb[i:i + SR]), db(bb[i:i + SR])
        if a > -35 and a - b < 7:
            low.append((i // SR, round(a - b, 1)))
    print("masking check (seconds where the narration is under 7 dB above the bed):", low or "none")
    mixed = np.stack([vo, vo], axis=1) + bed
    mixed = np.tanh(mixed * 1.1) / 1.1                                            # soft clip the loudest hits
    mixed[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]
    mixed[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))[:, None]
    print(f"mix peak {np.abs(mixed).max():.2f} rms {db(mixed):.1f}")
    for name, arr in (("mix_raw.wav", mixed), ("stem_music.wav", music), ("stem_sfx.wav", sfx)):
        with wave.open(str(film_dir / name), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(arr, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(film_dir / "mix_raw.wav"), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-ar", str(SR), "-c:a", "pcm_s16le", str(film_dir / "soundtrack.wav")], check=True)
    print("wrote", film_dir / "soundtrack.wav")
    return low
