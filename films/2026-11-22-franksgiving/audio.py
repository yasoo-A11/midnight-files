"""Soundtrack for the Franksgiving film (55.5 s). Run from the repository root: python3 films/2026-11-22-franksgiving/audio.py"""
import sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "kit"))
from sound import (SR, tt, place, pad, choir, reverb, hit, whoosh, riser, click, clunk, pluck, scratch, bell, thud, fall, sine)
from mix import mix

DUR = 55.5
D1, D2, G2, A2, Bb2, C3 = 36.71, 73.42, 98.0, 110.0, 116.54, 130.81
D3, E3, F3, G3, A3, Bb3, C4, D4, F4, A4 = 146.83, 164.81, 174.61, 196.0, 220.0, 233.08, 261.63, 293.66, 349.23, 440.0


def build(N):
    music = np.zeros((N, 2)); sfx = np.zeros((N, 2)); rg = np.random.default_rng(1939)
    # A cover: low drone, a few plucks, calendar highlights, stamp
    place(music, sine(D1, 6.2, 0.4, 0.6), 0.0, 0.22)
    place(music, pad([D3, A3], 6.0, 700, 0.8, 0.4, seed=1), 0.0, 0.12)
    for k, f in enumerate([D3, F3, A3, G3, F3, E3]):
        place(music, pluck(f * 2, 0.3, 1500), 0.3 + k * 0.55, 0.12, pan=(0.3 if k % 2 else -0.3))
    for r in range(4):
        place(sfx, click(0.6, 10 + r, 1800), 1.0 + r * 0.18, 0.12)
    place(sfx, scratch(0.5, 12), 2.0, 0.16)
    place(sfx, hit(0.9, 13, 0.6), 5.38, 0.6); place(sfx, clunk(14, 80), 5.38, 0.32)
    place(sfx, whoosh(0.5, 300, 3000, 15), 6.1, 0.22)
    # B 1863 and seventy quiet years
    place(sfx, hit(0.6, 16, 0.4), 6.95, 0.42)
    place(music, choir([D3, F3, A3], 2.2, 0.3, 0.8, seed=17), 6.95, 0.26)
    place(sfx, scratch(0.8, 18), 8.9, 0.15)
    for k in range(30):
        x = k / 29
        place(sfx, click(0.5, 100 + k, 1300 + 10 * k), 10.4 + 1.3 * x ** 1.2, 0.07)
    # C 1939
    place(sfx, riser(0.8, 19), 12.05, 0.32)
    place(sfx, hit(1.1, 20, 0.8), 12.85, 0.72)
    place(music, sine(D1, 1.6, 0.02, 0.8), 12.9, 0.24)
    for r in range(5):
        place(sfx, bell(880 * (1.12 ** r), 0.6, 8), 15.0 + r * 0.22, 0.06, -0.4 + 0.2 * r)
    place(sfx, scratch(0.55, 21, 1400, 5200), 17.3, 0.2)
    place(music, pad([D2, A2, D3], 4.6, 500, 1.0, 0.6, seed=22), 18.3, 0.24)
    place(sfx, thud(55, 0.4, 10), 21.0, 0.45)
    # D moved a week earlier
    for k, f in enumerate([D3, E3, F3, G3, A3, Bb3, C4, D4]):
        place(music, pluck(f * 2, 0.24, 1800), 23.4 + k * 0.25, 0.12, pan=(0.3 if k % 2 else -0.3))
    place(sfx, scratch(0.3, 23, 1400, 5200), 25.4, 0.22)
    place(sfx, whoosh(0.9, 200, 2500, 24, 0.6), 25.6, 0.22)
    place(sfx, hit(1.0, 25, 0.7), 26.83, 0.66); place(sfx, clunk(26, 85), 26.85, 0.3)
    for k in range(7):
        place(sfx, click(0.6, 200 + k, 2200), 26.6 + k * 0.1, 0.08)
    # E the country splits
    place(sfx, whoosh(1.0, 150, 3500, 27, 0.5), 28.2, 0.3); place(sfx, hit(0.8, 28, 0.5), 28.35, 0.5)
    place(music, pad([G2, D3, G3, Bb3], 4.0, 900, 0.6, 0.6, seed=29), 28.6, 0.22)
    for k in range(10):
        place(sfx, click(0.5, 300 + k, 1200), 28.4 + k * 0.11, 0.06, rg.uniform(-0.6, 0.6))
    place(sfx, hit(0.9, 30, 0.6), 33.42, 0.6); place(sfx, clunk(31, 80), 33.45, 0.3)
    for k in range(3):
        place(sfx, bell([587.3, 740, 880][k], 0.7, 6), 34.6 + k * 0.6, 0.07)
    place(sfx, bell(1174.7, 1.0, 4), 38.2, 0.07); place(sfx, bell(1760, 1.0, 4), 38.32, 0.05)
    # F the numbers
    place(music, pad([D2, A2], 4.0, 500, 0.4, 0.6, seed=32), 39.0, 0.2)
    place(sfx, scratch(0.9, 33), 40.9, 0.14)
    place(sfx, hit(1.0, 34, 0.6), 42.22, 0.64); place(sfx, fall(0.8, 440.0, 2.0), 42.25, 0.07)
    # G 1941 and this year
    place(sfx, hit(0.7, 35, 0.5), 44.3, 0.5)
    place(music, choir([Bb2, F3, Bb3, D4], 3.6, 0.5, 0.8, seed=36), 44.3, 0.3)
    place(sfx, clunk(37, 120), 45.93, 0.5); place(sfx, click(1.0, 38, 600), 45.95, 0.3)
    place(sfx, whoosh(0.5, 400, 3000, 39), 48.6, 0.2)
    place(sfx, scratch(0.55, 40, 1400, 5200), 49.9, 0.2); place(sfx, bell(880, 1.0, 4), 50.05, 0.07)
    # H the question
    place(music, choir([D3, F3, A3, D4], 2.3, 0.5, 0.5, seed=41), 51.2, 0.34)
    place(music, choir([Bb2, D3, F3, Bb3], 2.0, 0.3, 0.6, seed=42), 53.0, 0.34)
    for tb in (51.35, 51.95, 52.55):
        place(sfx, thud(62, 0.22, 18), tb, 0.3)
    place(music, riser(0.9, 43), 54.4, 0.2)
    return reverb(music, 2.4, 0.32, seed=3), reverb(sfx, 1.3, 0.16, seed=9)


if __name__ == "__main__":
    mix(HERE, build, DUR, vo_offset=0.25)
