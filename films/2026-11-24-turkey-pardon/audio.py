"""Soundtrack for the turkey-pardon film (56.3 s). Run from the repository root: python3 films/2026-11-24-turkey-pardon/audio.py"""
import sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "kit"))
from sound import (SR, place, pad, choir, reverb, hit, whoosh, riser, clunk, pluck, scratch, bell, thud, hat, sine)
from mix import mix

DUR = 56.3
D1, D2, G2, A2, Bb2 = 36.71, 73.42, 98.0, 110.0, 116.54
D3, E3, F3, G3, A3, Bb3, C4, D4, F4, A4 = 146.83, 164.81, 174.61, 196.0, 220.0, 233.08, 261.63, 293.66, 349.23, 440.0


def build(N):
    music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
    # A cover
    place(music, sine(D1, 6.2, 0.4, 0.6), 0.0, 0.2)
    place(music, pad([D3, A3], 6.0, 700, 0.8, 0.4, seed=1), 0.0, 0.12)
    for k, f in enumerate([D3, F3, A3, D4, C4, A3]):
        place(music, pluck(f * 2, 0.3, 1600), 0.3 + k * 0.55, 0.11, pan=(0.3 if k % 2 else -0.3))
    place(sfx, whoosh(0.6, 2000, 300, 3, 0.4), 4.7, 0.16)
    place(sfx, hit(0.9, 4, 0.6), 6.05, 0.6); place(sfx, clunk(5, 80), 6.07, 0.3)
    # B Christmas bird
    place(music, pad([D2, A2, F3], 4.6, 600, 0.6, 0.6, seed=6), 6.6, 0.16)
    for k, f in enumerate([A4, F4, D4]):
        place(sfx, bell(f, 0.9, 5), 7.0 + k * 0.5, 0.04)
    place(sfx, hit(0.7, 7, 0.5), 10.45, 0.45); place(sfx, bell(1760, 1.2, 4), 10.5, 0.06)
    # C 1947
    place(sfx, hit(0.8, 8, 0.6), 11.95, 0.55)
    beat = 0.5
    for k in range(int(5.0 / beat)):
        tb = 12.6 + k * beat
        place(music, thud(66, 0.16, 22), tb, 0.3 if k % 2 == 0 else 0.18)
        place(music, hat(100 + k), tb + beat / 2, 0.04, 0.3)
    place(sfx, clunk(9, 80), 13.3, 0.25)
    place(sfx, hit(0.6, 10, 0.5), 17.65, 0.5)
    # D Truman
    place(music, pad([Bb2, D3, F3], 5.0, 650, 0.6, 0.6, seed=11), 18.6, 0.16)
    place(sfx, whoosh(0.5, 400, 1600, 12, 0.4), 21.3, 0.15)
    place(sfx, hit(0.8, 13, 0.6), 23.55, 0.6); place(sfx, clunk(14, 80), 23.57, 0.3)
    # E 1963
    place(sfx, hit(0.9, 15, 0.6), 25.45, 0.55); place(music, choir([D3, A3, D4], 2.0, 0.3, 0.8, seed=16), 25.5, 0.18)
    place(music, pad([D2, A2, D3], 8.0, 600, 0.8, 1.0, seed=17), 26.5, 0.14)
    for k, f in enumerate([D3, F3, A3, D4, A3, F3, D3, A2]):
        place(music, pluck(f * 2, 0.35, 1500), 27.0 + k * 0.75, 0.08, pan=(0.25 if k % 2 else -0.25))
    place(sfx, scratch(0.5, 18), 28.1, 0.1)
    place(sfx, bell(2637, 1.2, 3.5), 33.85, 0.07)
    place(sfx, whoosh(0.6, 2000, 400, 19, 0.4), 34.9, 0.14)
    place(sfx, hit(0.8, 20, 0.6), 37.45, 0.6); place(sfx, clunk(21, 80), 37.47, 0.3)
    # F 1989
    place(sfx, riser(0.8, 22), 38.5, 0.25); place(sfx, hit(0.9, 23, 0.7), 39.35, 0.6)
    place(music, pad([F3, A3, C4], 7.5, 800, 0.8, 1.0, seed=24), 39.6, 0.14)
    for k in range(16):
        place(sfx, bell(880 * (1 + (k % 4) * 0.25), 0.25, 14), 45.9 + k * 0.1, 0.025)
    # G question
    place(sfx, scratch(0.55, 25, 1400, 5200), 48.0, 0.14)
    place(sfx, hit(1.0, 26, 0.7), 50.55, 0.6)
    place(music, pad([D2, A2, D3], 5.5, 600, 0.6, 1.2, seed=27), 51.2, 0.18)
    for tb in (52.25, 52.65, 53.15):
        place(sfx, thud(62, 0.22, 18), tb, 0.25)
    place(music, riser(0.9, 28), 55.2, 0.18)
    return reverb(music, 2.4, 0.32, seed=3), reverb(sfx, 1.3, 0.16, seed=9)


if __name__ == "__main__":
    mix(HERE, build, DUR, vo_offset=0.25)
