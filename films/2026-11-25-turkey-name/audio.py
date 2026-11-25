"""Soundtrack for the turkey-name film (53.5 s). Run from the repository root: python3 films/2026-11-25-turkey-name/audio.py"""
import sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "kit"))
from sound import (SR, place, pad, choir, reverb, hit, whoosh, riser, clunk, pluck, scratch, bell, thud, hat, sine)
from mix import mix

DUR = 53.5
D1, D2, G2, A2, Bb2 = 36.71, 73.42, 98.0, 110.0, 116.54
D3, E3, F3, G3, A3, Bb3, C4, D4, F4, A4 = 146.83, 164.81, 174.61, 196.0, 220.0, 233.08, 261.63, 293.66, 349.23, 440.0


def build(N):
    music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
    # A cover
    place(music, sine(D1, 6.0, 0.4, 0.6), 0.0, 0.2)
    place(music, pad([D3, A3], 6.0, 700, 0.8, 0.4, seed=1), 0.0, 0.12)
    for k, f in enumerate([D3, F3, A3, D4, C4, A3]):
        place(music, pluck(f * 2, 0.3, 1600), 0.3 + k * 0.55, 0.11, pan=(0.3 if k % 2 else -0.3))
    place(sfx, hit(0.9, 4, 0.6), 5.5, 0.6); place(sfx, clunk(5, 80), 5.52, 0.3)
    # B
    place(sfx, scratch(0.5, 6), 6.6, 0.12)
    place(sfx, hit(0.6, 7, 0.4), 7.1, 0.4)
    place(music, pad([D2, A2, F3], 4.4, 600, 0.6, 0.6, seed=8), 7.3, 0.16)
    # C 1500s
    place(sfx, hit(0.8, 9, 0.6), 11.5, 0.55)
    for k, f in enumerate([D3, F3, A3, G3, F3, E3, D3, A2, D3, F3]):
        place(music, pluck(f * 2, 0.35, 1500), 12.2 + k * 0.7, 0.09, pan=(0.25 if k % 2 else -0.25))
    place(music, pad([D2, A2, D3], 7.0, 600, 0.8, 0.8, seed=10), 12.3, 0.13)
    place(sfx, whoosh(1.0, 300, 1800, 11, 0.5), 16.2, 0.14)
    place(sfx, hit(0.8, 12, 0.6), 18.8, 0.55); place(sfx, clunk(13, 80), 18.82, 0.3)
    # D ships
    place(music, pad([F3, A3, C4], 8.5, 800, 0.8, 1.0, seed=14), 20.0, 0.13)
    place(sfx, whoosh(0.9, 2000, 400, 15, 0.5), 21.6, 0.15)
    place(sfx, bell(1760, 0.8, 6), 26.2, 0.05)
    place(sfx, hit(0.8, 16, 0.6), 27.85, 0.6); place(sfx, clunk(17, 80), 27.87, 0.3)
    # E names
    beat = 0.5
    for k in range(int(14.0 / beat)):
        tb = 29.5 + k * beat
        place(music, thud(66, 0.16, 22), tb, 0.24 if k % 2 == 0 else 0.14)
        place(music, hat(100 + k), tb + beat / 2, 0.03, 0.3)
    for k, ts in enumerate([32.35, 35.95, 39.45, 41.25]):
        place(sfx, scratch(0.35, 18 + k), ts - 0.5, 0.08)
        place(sfx, bell([A4, F4, D4, A3 * 2][k], 0.6, 6), ts, 0.04)
    # F four
    place(music, pad([D2, A2, D3], 6.0, 600, 0.6, 1.0, seed=23), 44.0, 0.16)
    place(sfx, riser(0.8, 24), 46.1, 0.22); place(sfx, hit(1.0, 25, 0.7), 46.95, 0.6)
    for k in range(4):
        place(sfx, scratch(0.25, 30 + k, 1400, 5200), 48.4 + k * 0.15, 0.06)
    # G
    for tb in (50.25, 50.65):
        place(sfx, thud(62, 0.22, 18), tb, 0.25)
    place(music, riser(0.9, 28), 52.4, 0.18)
    return reverb(music, 2.4, 0.32, seed=3), reverb(sfx, 1.3, 0.16, seed=9)


if __name__ == "__main__":
    mix(HERE, build, DUR, vo_offset=0.25)
