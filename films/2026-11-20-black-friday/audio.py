"""Soundtrack for the Black Friday film: a synthesized score and sound effects keyed to the picture (57 s).

Run from the repository root:  python3 films/2026-11-20-black-friday/audio.py
"""
import sys
from pathlib import Path
import numpy as np
from scipy import signal as sg

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "kit"))
from sound import (SR, tt, nz, lp, hp, bp, ar, place, saw, pad, choir, reverb, hit, whoosh, riser, click, clunk, pluck,
                   scratch, horn, whistle, bell, thud, hat, powerdown, fall, sine)
from mix import mix

DUR = 57.0
VO_OFFSET = 0.25                      # the narration starts a quarter of a second into the film

D1, D2, F2, G2, Gs2, A2, Bb2, B2, C3, Cs3 = 36.71, 73.42, 87.31, 98.0, 103.83, 110.0, 116.54, 123.47, 130.81, 138.59
D3, E3, F3, Fs3, G3, Gs3, A3, Bb3, C4, D4 = 146.83, 164.81, 174.61, 185.0, 196.0, 207.65, 220.0, 233.08, 261.63, 293.66
E4, F4, Fs4, G4, A4, Bb4, C5, D5 = 329.63, 349.23, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33


def build(N):
    music = np.zeros((N, 2))
    sfx = np.zeros((N, 2))
    rg = np.random.default_rng(1869)

    # ================= A  0 - 5.5   the cover story: a ledger being written =================
    t = tt(5.6)
    place(music, (np.sin(2 * np.pi * D1 * t) * 0.9 + np.sin(2 * np.pi * D2 * t) * 0.5) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.13 * t)) * ar(len(t), 0.3, 0.5), 0.0, 0.20)
    place(music, pad([D3, A3], 4.3, 700, 0.8, 0.3, seed=1), 0.0, 0.13)
    for k, f in enumerate([D3, F3, E3, Cs3, D3, F3, A3, Gs3]):                    # a sly little figure
        place(music, pluck(f * 2, 0.3, 1500), 0.25 + k * 0.5, 0.13, pan=(0.3 if k % 2 else -0.3))
        place(music, pluck(f, 0.3, 900), 0.25 + k * 0.5, 0.10)
    place(sfx, hit(0.5, 2, 0.5), 0.0, 0.42)
    for j, tb in enumerate([0.04, 0.53, 1.03, 1.52, 2.01]):                       # one line of the ledger at a time
        place(sfx, scratch(0.30, 10 + j), tb, 0.17, -0.15)
    place(sfx, scratch(0.62, 20), 2.75, 0.19, 0.1)                                # the black total
    place(sfx, scratch(0.45, 21, 2200, 7000), 3.47, 0.15, 0.3)                    # "in the black"
    place(sfx, hit(1.0, 3, 0.6), 4.46, 0.66)                                      # COVER STORY
    place(sfx, clunk(4, 80), 4.46, 0.38)
    place(music, pad([D2, A2], 1.1, 500, 0.02, 0.5, seed=2), 4.5, 0.22)
    place(sfx, whoosh(0.6, 250, 3200, 5), 5.3, 0.30)

    # ================= B  5.5 - 14.4   1869: the gold corner =================
    place(music, pad([D2, A2, D3, F3], 3.9, 900, 0.8, 0.4, seed=6), 5.6, 0.22)
    place(sfx, whoosh(0.5, 600, 4500, 7), 5.85, 0.12)
    place(sfx, hit(0.9, 8, 0.5), 7.85, 0.56)                                      # "1869"
    place(music, choir([D3, F3, A3, D4], 1.7, 0.05, 0.6, seed=9), 7.85, 0.32)
    place(sfx, scratch(0.34, 30), 9.5, 0.10, -0.4)                                # two top hats
    place(sfx, scratch(0.34, 31), 9.9, 0.10, 0.0)
    n = int(2.9 * SR)                                                             # the price climbs
    tr = pad([D3, F3, A3], 2.9, 1500, 0.3, 0.1, seed=11) * (0.55 + 0.45 * np.sin(2 * np.pi * 9 * np.arange(n) / SR))[:, None] * np.linspace(0.3, 1.0, n)[:, None]
    place(music, tr, 9.4, 0.20)
    for k, f in enumerate([D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5]):
        u = k / 13
        place(music, pluck(f * 2, 0.26, 1500 + 1300 * u), 9.4 + k * 0.2, 0.10 + 0.10 * u, pan=(0.35 if k % 2 else -0.35))
        if k % 2 == 0:
            place(music, pluck(D2 * 2, 0.3, 600), 9.4 + k * 0.2, 0.20)
            place(music, thud(60, 0.2, 22), 9.4 + k * 0.2, 0.30)
    n = int(1.0 * SR)                                                             # ...and hangs at the top
    hold = pad([A3, D4, F4, A4], 1.0, 2200, 0.05, 0.04, seed=12) * (0.5 + 0.5 * np.sin(2 * np.pi * 13 * np.arange(n) / SR))[:, None]
    place(music, hold, 12.2, 0.22)
    place(sfx, bell(1568.0, 1.0, 5), 12.2, 0.08, 0.4)                             # $162
    place(sfx, riser(0.95, 13), 12.22, 0.40)
    place(sfx, hit(1.25, 14, 1.0), 13.19, 0.68)                                   # the crash
    place(sfx, fall(0.9, 880.0, 3.6), 13.16, 0.09)
    t = tt(0.6)
    place(sfx, bp(nz(len(t), 15), 3000, 9000) * np.exp(-t * 6), 13.2, 0.08, 0.3)
    place(music, sine(D1, 1.3, 0.02, 0.7), 13.25, 0.22)

    # ================= C  14.4 - 24.4   Philadelphia, the day after Thanksgiving =================
    place(music, pad([D3, A3], 2.3, 800, 1.0, 0.3, seed=16), 14.5, 0.17)
    for k in range(1, 41):                                                        # 1869 -> the 1950s, ticking by
        p = 2 * k / 81
        x = (p / 4) ** (1 / 3) if p < 0.5 else 1 - (2 * (1 - p)) ** (1 / 3) / 2
        place(sfx, click(0.55, 100 + k, 1300 + 8 * k), 14.65 + 1.7 * x, 0.09, -0.2 + 0.4 * x)
    place(sfx, whoosh(1.0, 150, 2200, 17, 0.6), 16.5, 0.30)                       # the city rises
    place(music, choir([F2, C3, F3, A3], 1.6, 0.25, 0.5, seed=18), 16.85, 0.32)
    beat = 0.4                                                                    # a walking bass for the fifties
    line = [D2, F2, G2, Gs2, A2, C3, A2, G2, F2, A2, Bb2, B2, C3]
    for k, f in enumerate(line):
        tb = 18.3 + k * beat
        u = k / (len(line) - 1)
        place(music, pluck(f, 0.38, 520), tb, 0.32)
        place(music, pluck(f * 2, 0.3, 900), tb, 0.13)
        place(music, hat(200 + k), tb, 0.035 + (0.03 if k % 2 else 0.0), 0.3)
        place(music, hat(300 + k, 130), tb + beat * 2 / 3, 0.028, 0.3)
        if k >= 5 and k % 2 == 1:
            place(music, pad([F3, A3, C4, E4], 0.2, 1900, 0.008, 0.1, seed=40 + k), tb, 0.07 + 0.08 * u)
    n = int(4.0 * SR)                                                             # traffic builds
    ti = np.arange(n) / SR
    bed = lp(nz(n, 19), 240, 3) * 3.0 + lp(saw(46, n) + 0.6 * saw(69.5, n), 320) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * ti))
    place(sfx, bed * np.linspace(0.1, 1.0, n) ** 1.5 * ar(n, 0.3, 0.03), 19.4, 0.09)
    for tb, d, f, pn, g in ((20.9, 0.16, 415, -0.5, 0.05), (21.45, 0.28, 370, 0.5, 0.06), (22.0, 0.18, 440, -0.3, 0.06), (22.4, 0.35, 415, 0.4, 0.07),
                            (22.75, 0.22, 392, -0.6, 0.07), (23.0, 0.38, 466, 0.2, 0.08), (23.12, 0.27, 370, -0.2, 0.08)):
        place(sfx, horn(d, f), tb, g, pn)
    place(sfx, hit(1.05, 21, 0.7), 23.39, 0.70)                                   # GRIDLOCK
    place(sfx, clunk(22, 80), 23.39, 0.34)

    # ================= D  24.4 - 32.9   the police give the day a name =================
    place(sfx, whistle(0.32), 24.42, 0.035, -0.3)
    place(music, pad([D2, A2], 4.3, 520, 0.5, 0.4, seed=23), 24.6, 0.21)
    for i, tb in enumerate(np.arange(24.7, 28.75, 0.5)):                          # a tired heartbeat
        place(music, thud(58, 0.22, 20), tb, 0.45)
        place(music, thud(58, 0.22, 26), tb + 0.17, 0.28)
    place(sfx, clunk(24, 85), 25.44, 0.34, 0.3)                                   # NO LEAVE
    place(sfx, hit(0.5, 25, 0.3), 25.44, 0.32)
    for j, tb in enumerate([25.95, 26.95, 27.75]):                                # long shifts, traffic, shoplifters
        place(sfx, clunk(26 + j, 95), tb, 0.30, -0.3)
        place(sfx, click(1.0, 29 + j, 420), tb, 0.20, -0.3)
    place(sfx, whoosh(0.8, 200, 2600, 32, 0.8), 29.58, 0.22)                      # breath before the name
    place(sfx, hit(1.0, 33, 0.6), 30.39, 0.66)                                    # Black Friday
    place(music, choir([D3, F3, A3, D4], 2.5, 0.04, 0.7, seed=34), 30.38, 0.34)
    place(music, sine(D1, 2.2, 0.02, 0.6), 30.4, 0.20)
    place(sfx, scratch(0.38, 35, 1400, 5200), 31.1, 0.22)                         # underlined
    place(sfx, thud(52, 0.35, 12), 31.6, 0.50)                                    # not a compliment

    # ================= E  32.9 - 38.6   "Big Friday" =================
    place(sfx, scratch(0.24, 36, 1400, 5200), 33.25, 0.21, -0.2)                  # crossed out
    place(sfx, scratch(0.24, 37, 1400, 5200), 33.5, 0.21, 0.2)
    place(sfx, hit(0.5, 38, 0.2), 34.25, 0.36)                                    # 1961
    place(music, pad([D3, A3], 1.0, 800, 0.2, 0.3, seed=39), 34.25, 0.14)
    for k, f in enumerate([587.33, 659.25, 739.99, 880.0, 987.77, 1174.66, 1318.5, 1479.98, 1760.0, 1975.5, 2349.3, 2637.0]):
        place(sfx, bell(f, 0.35, 12), 35.15 + k * 0.08, 0.05, -0.6 + 1.2 * k / 11)   # bulbs light up round the sign
    place(music, pluck(A4, 0.2, 3000), 36.1, 0.14)                                # ta-da
    place(music, pluck(D5, 0.25, 3000), 36.27, 0.17)
    place(music, pad([D3, Fs3, A3, D4, Fs4, A4], 1.15, 2600, 0.015, 0.3, seed=41), 36.28, 0.34)
    place(sfx, hit(0.7, 42, 0.8), 36.29, 0.50)
    place(sfx, bell(1174.66, 1.0, 4), 36.29, 0.08)
    for k, tb in enumerate(np.arange(36.45, 37.45, 1 / 9)):                       # the chase lights
        place(sfx, click(0.35, 430 + k, 2000), tb, 0.035, -0.4 if k % 2 else 0.4)
    place(sfx, powerdown(), 37.5, 0.20)                                           # nobody listens
    for k in range(10):
        place(sfx, click(0.8, 450 + k, 3000), 37.5 + rg.random() * 0.55, 0.08, rg.uniform(-0.7, 0.7))
    place(sfx, clunk(46, 70), 37.56, 0.30)

    # ================= F  38.6 - 45.9   the story is rewritten =================
    place(sfx, whoosh(0.4, 800, 5000, 47, 0.4), 38.58, 0.18)                      # a clipping lands
    pat = [D3, A3, F3, A3, D3, Bb3, G3, Bb3]
    steps = np.arange(38.8, 44.62, 0.25)
    for k, tb in enumerate(steps):
        u = k / (len(steps) - 1)
        place(music, pluck(pat[k % 8] * 2, 0.24, 1200 + 1000 * u), tb, 0.10 + 0.10 * u, pan=(0.3 if k % 2 else -0.3))
        if k % 4 == 0:
            place(music, pluck(D2 if (k // 4) % 2 == 0 else G2, 0.4, 520), tb, 0.26)
            place(music, thud(60, 0.2, 22), tb, 0.24)
    place(music, pad([D3, A3], 5.6, 750, 1.5, 0.2, seed=48), 38.9, 0.13)
    place(sfx, clunk(49, 75), 40.29, 0.36)                                        # the headline
    place(sfx, click(1.0, 50, 380), 40.29, 0.22)
    place(sfx, scratch(0.33, 51, 1400, 5200), 41.45, 0.28)                        # struck through
    tk, k = 41.76, 0
    while tk < 42.72:                                                             # a new line is typed over it
        place(sfx, click(0.9, 520 + k, 1500), tk, 0.13, 0.15)
        place(sfx, thud(140, 0.05, 60), tk, 0.10, 0.15)
        tk += 0.055 + 0.04 * rg.random()
        k += 1
    place(sfx, bell(2093.0, 0.8, 7), 42.78, 0.09, 0.3)
    place(sfx, whoosh(0.45, 400, 3500, 53, 0.5), 42.8, 0.22)                      # the ledger again
    place(sfx, clunk(54, 90), 43.22, 0.18)
    for j in range(6):                                                            # red ink becomes black ink
        place(sfx, scratch(0.17, 60 + j), 43.2 + j * 0.217, 0.20, 0.25 if j % 2 else -0.05)
    place(sfx, hit(1.0, 55, 0.6), 44.98, 0.66)                                    # PROFIT
    place(sfx, clunk(56, 110), 45.0, 0.30)
    place(sfx, bell(2637.0, 1.4, 3.2), 45.03, 0.11)                               # ka-ching
    place(sfx, bell(3520.0, 1.2, 3.8), 45.03, 0.07)
    for k in range(4):
        place(sfx, click(0.7, 570 + k, 900), 45.09 + k * 0.035, 0.09, 0.2)
    place(music, pad([Bb2, D3, F3, Bb3, D4], 0.9, 2000, 0.01, 0.5, seed=58), 45.0, 0.26)

    # ================= G  45.9 - 52.1   200 million shoppers =================
    place(music, choir([Bb2, F3, Bb3, D4], 2.7, 1.0, 0.4, seed=59), 46.0, 0.36)
    for k, tb in enumerate(np.arange(46.9, 48.4, 0.05)):                          # the count
        place(sfx, click(0.5, 600 + k, 1500 + 12 * k), tb, 0.07, -0.5 + k / 30)
    place(sfx, hit(0.6, 63, 0.4), 48.42, 0.42)
    place(sfx, bell(880.0, 1.0, 4), 48.42, 0.07)
    place(music, choir([G2, D3, G3, Bb3], 1.7, 0.3, 0.4, seed=64), 48.6, 0.34)
    place(sfx, whoosh(0.9, 300, 2500, 65, 0.5), 50.1, 0.25)                       # the dots turn red
    place(sfx, hit(0.9, 66, 0.3), 50.26, 0.58)
    place(sfx, fall(0.8, 440.0, 2.5), 50.26, 0.08)
    place(music, pad([D2, A2, D3], 1.9, 600, 0.05, 0.5, seed=67), 50.26, 0.26)

    # ================= H  52.1 - 57   the question =================
    place(music, choir([D3, F3, A3, D4], 2.2, 0.6, 0.4, seed=70), 52.2, 0.38)
    place(music, choir([Bb2, D3, F3, Bb3], 1.8, 0.3, 0.3, seed=71), 54.1, 0.36)
    place(music, pad([D3, A3, D4], 1.4, 700, 0.4, 0.05, seed=72), 55.6, 0.28)
    place(music, riser(0.9, 73), 56.1, 0.22)
    for j, tb in enumerate([52.25, 52.6, 53.4, 54.0]):                            # each line lands
        place(sfx, thud(62, 0.22, 18), tb, 0.32)
    place(sfx, bell(587.33, 1.2, 3), 54.0, 0.07)
    n = int(4.6 * SR)                                                             # a neon sign, buzzing
    gate = 0.35 + 0.65 * (lp((np.random.default_rng(74).random(n) > 0.14) * 1.0, 30) > 0.5)
    place(sfx, hp(saw(60, n) * (sg.square(2 * np.pi * 120 * np.arange(n) / SR) > 0), 300) * gate * ar(n, 0.4, 0.3), 52.3, 0.022, 0.5)
    place(sfx, bp(nz(n, 75), 250, 1100) * (0.6 + 0.4 * lp(np.abs(nz(n, 76)), 1.5) * 3) * ar(n, 0.8, 0.3), 52.3, 0.035)
    place(sfx, whoosh(0.45, 500, 4000, 77), 55.68, 0.20)                          # the caption tape leaves

    return reverb(music, 2.4, 0.32, seed=3), reverb(sfx, 1.3, 0.16, seed=9)


if __name__ == "__main__":
    mix(HERE, build, DUR, vo_offset=VO_OFFSET)
