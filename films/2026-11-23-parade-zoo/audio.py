"""Soundtrack for the parade film (57.6 s). Run from the repository root: python3 films/2026-11-23-parade-zoo/audio.py"""
import sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "kit"))
from sound import (SR, tt, nz, lp, bp, ar, place, pad, choir, reverb, hit, whoosh, riser, click, clunk, pluck, scratch, bell, thud, hat, fall, sine)
from mix import mix

DUR = 57.6
D1, D2, G2, A2, Bb2, C3 = 36.71, 73.42, 98.0, 110.0, 116.54, 130.81
D3, E3, F3, G3, A3, Bb3, C4, D4, F4, A4 = 146.83, 164.81, 174.61, 196.0, 220.0, 233.08, 261.63, 293.66, 349.23, 440.0


def roar(d=1.2, seed=0):
    n = int(d * SR)
    t = np.arange(n) / SR
    body = bp(nz(n, seed), 90, 700) * (1 + 0.6 * np.sin(2 * np.pi * 23 * t))
    return lp(body, 900) * ar(n, 0.08, 0.5) * 3


def build(N):
    music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
    # A cover
    place(music, sine(D1, 6.2, 0.4, 0.6), 0.0, 0.2)
    place(music, pad([D3, A3], 6.0, 700, 0.8, 0.4, seed=1), 0.0, 0.12)
    for k, f in enumerate([D3, F3, A3, D4, C4, A3]):
        place(music, pluck(f * 2, 0.3, 1600), 0.3 + k * 0.55, 0.11, pan=(0.3 if k % 2 else -0.3))
    place(sfx, whoosh(0.6, 2000, 300, 3, 0.4), 3.6, 0.18)
    place(sfx, thud(48, 0.5, 8), 5.0, 0.5)
    place(sfx, hit(0.9, 4, 0.6), 5.23, 0.6)
    # B 1924
    place(sfx, hit(0.7, 5, 0.5), 7.03, 0.5); place(music, choir([D3, F3, A3], 2.2, 0.3, 0.8, seed=6), 7.05, 0.24)
    place(sfx, hit(0.7, 7, 0.5), 10.38, 0.5); place(sfx, clunk(8, 80), 10.4, 0.3)
    place(sfx, scratch(0.8, 9), 11.8, 0.14)
    # C parade march: drum + brass-ish plucks
    beat = 0.5
    for k in range(int(11.2 / beat)):
        tb = 14.4 + k * beat
        place(music, thud(70, 0.18, 22), tb, 0.38 if k % 2 == 0 else 0.22)
        place(music, hat(100 + k), tb + beat / 2, 0.04, 0.3)
        if k % 2 == 0:
            place(music, pluck([D3, F3, A3, F3][(k // 2) % 4] * 2, 0.35, 1400), tb, 0.12)
    for tb in (18.65, 19.25, 19.85, 20.85):
        place(sfx, bell(880, 0.4, 10), tb, 0.05)
    place(sfx, roar(1.4, 11), 21.85, 0.14); place(sfx, roar(1.0, 12), 22.85, 0.16)
    place(sfx, hit(0.9, 13, 0.4), 22.93, 0.55)
    place(music, pad([D2, A2], 2.0, 500, 0.2, 0.6, seed=14), 24.6, 0.22)
    # D 1927 balloons
    place(sfx, hit(0.7, 15, 0.5), 26.33, 0.5)
    place(sfx, clunk(16, 80), 28.1, 0.3); place(sfx, whoosh(0.7, 300, 1500, 17, 0.5), 28.2, 0.2)
    place(sfx, riser(0.8, 18), 30.1, 0.3); place(sfx, hit(0.8, 19, 0.7), 30.93, 0.55)
    place(music, choir([F3, A3, C4, F4], 3.8, 0.4, 0.9, seed=20), 31.0, 0.3)
    for k, f in enumerate([F4, A4, F4 * 2]):
        place(sfx, bell(f, 0.8, 5), 33.5 + k * 0.4, 0.05)
    # E let them go
    place(music, pad([D2, A2, D3], 4.5, 600, 0.6, 0.6, seed=21), 35.8, 0.2)
    place(sfx, whoosh(1.5, 300, 4000, 22, 0.6), 40.3, 0.3); place(sfx, hit(0.6, 23, 0.6), 40.43, 0.4)
    place(music, choir([D3, A3, D4, F4], 5.0, 0.8, 1.0, seed=24), 40.5, 0.26)
    place(sfx, scratch(0.6, 25), 44.4, 0.12)
    place(sfx, hit(1.0, 26, 0.7), 46.83, 0.62); place(sfx, bell(2637, 1.2, 3.5), 46.9, 0.08)
    # F/G
    place(sfx, scratch(0.55, 27, 1400, 5200), 48.7, 0.18)
    place(music, choir([Bb2, D3, F3, Bb3], 2.6, 0.5, 0.6, seed=28), 49.0, 0.26)
    place(music, choir([D3, F3, A3, D4], 2.8, 0.4, 0.6, seed=29), 52.0, 0.32)
    for tb in (52.05, 52.95, 54.15):
        place(sfx, thud(62, 0.22, 18), tb, 0.3)
    place(music, riser(0.9, 30), 56.4, 0.2)
    return reverb(music, 2.4, 0.32, seed=3), reverb(sfx, 1.3, 0.16, seed=9)


if __name__ == "__main__":
    mix(HERE, build, DUR, vo_offset=0.25)
