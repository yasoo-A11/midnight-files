"""Builds the soundtrack: narration + a synthesized score and sound effects keyed to the picture."""
import json, wave, subprocess, sys
from pathlib import Path
import numpy as np
from scipy import signal as sg

HERE = Path(__file__).resolve().parent
SR, DUR = 48000, 58.0
N = int(SR * DUR)
EV = json.loads((HERE / "events.json").read_text())


def tt(d):
    return np.arange(int(d * SR)) / SR


def nz(n, seed):
    return np.random.default_rng(seed).standard_normal(n)


def filt(x, kind, fc, order=2):
    return sg.sosfilt(sg.butter(order, fc, btype=kind, fs=SR, output="sos"), x, axis=0)


def lp(x, fc, o=2): return filt(x, "lowpass", fc, o)
def hp(x, fc, o=2): return filt(x, "highpass", fc, o)
def bp(x, f1, f2, o=2): return filt(x, "bandpass", [f1, f2], o)


def ar(n, a, r, curve=1.6):
    e = np.ones(n)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na > 1: e[:na] = np.linspace(0, 1, na) ** curve
    if nr > 1: e[-nr:] *= np.linspace(1, 0, nr) ** curve
    return e


def place(buf, sig, t0, gain=1.0, pan=0.0):
    """Add mono or stereo `sig` into stereo `buf` at time t0 (seconds)."""
    i0 = int(round(t0 * SR))
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.stack([sig * np.cos(a), sig * np.sin(a)], axis=1) * 1.414
    if i0 < 0:
        sig, i0 = sig[-i0:], 0
    n = min(len(sig), len(buf) - i0)
    if n > 0:
        buf[i0:i0 + n] += sig[:n] * gain


def saw(f, n, ph=0.0):
    t = np.arange(n) / SR
    phase = (np.cumsum(f) / SR if np.ndim(f) else f * t) + ph
    return 2 * (phase % 1.0) - 1


def pad(freqs, dur, cut, a, r, det=0.006, voices=4, seed=0):
    """Detuned saw pad, stereo."""
    n = int(dur * SR)
    rg = np.random.default_rng(seed)
    out = np.zeros((n, 2))
    for f in freqs:
        for v in range(voices):
            d = 1 + det * (v - (voices - 1) / 2) / max(1, (voices - 1) / 2)
            s = saw(f * d, n, rg.random())
            out[:, v % 2] += s
            out[:, 1 - v % 2] += s * 0.35
    out = lp(out, cut, 2) / (len(freqs) * voices) * 3.0
    return out * ar(n, a, r)[:, None]


def choir(freqs, dur, a, r, seed=0, bright=1.0):
    p = pad(freqs, dur, 3200, a, r, det=0.009, voices=6, seed=seed)
    return (bp(p, 520, 700) * 1.0 + bp(p, 950, 1150) * 0.5 + bp(p, 2100, 2500) * 0.3 * bright + lp(p, 300) * 0.5) * 2.2


def reverb(x, decay=2.0, mix=0.3, seed=1):
    n = int(decay * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for c in range(2):
        ir = nz(n, seed + c) * np.exp(-t * 6.9 / decay)
        ir = lp(ir, 5000)
        ir[: int(0.012 * SR)] = 0
        ir /= np.sqrt(np.sum(ir ** 2))
        out[:, c] = sg.fftconvolve(x[:, c], ir)[: len(x)]
    return x * (1 - mix) + out * mix


# ---------------------------------------------------------------- one-shot sounds
def hit(size=1.0, seed=0, bright=0.5):
    d = 2.2
    t = tt(d)
    f = 34 + 70 * np.exp(-t * 9)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.4)
    thump = lp(nz(len(t), seed), 220, 3) * np.exp(-t * 7) * 1.6
    crash = bp(nz(len(t), seed + 1), 900, 7000) * np.exp(-t * 4.5) * bright
    fb = 110 + 130 * np.exp(-t * 16)
    sub = sub + np.sin(2 * np.pi * np.cumsum(fb) / SR) * np.exp(-t * 13) * 0.9 + bp(nz(len(t), seed + 2), 180, 900) * np.exp(-t * 16) * 0.9
    return (sub * 1.1 + thump + crash * 0.5) * size * 0.30


def whoosh(d, f0=300, f1=4000, seed=0, peak=0.5):
    n = int(d * SR)
    x = nz(n, seed)
    t = np.arange(n) / n
    env = np.exp(-((t - peak) / 0.22) ** 2)
    # time-varying bandpass by mixing a few fixed bands
    bands = np.geomspace(f0, f1, 6)
    out = np.zeros(n)
    for i, fc in enumerate(bands):
        w = np.exp(-((t - (0.15 + 0.7 * i / 5)) / 0.2) ** 2)
        out += bp(x, fc * 0.75, fc * 1.3) * w
    return out * env


def riser(d, seed=0):
    n = int(d * SR)
    t = np.arange(n) / n
    f = 180 * 2 ** (t * 2.6)
    tone = (saw(f, n) + saw(f * 1.007, n)) * 0.5
    air = hp(nz(n, seed), 2500) * t ** 2
    return (lp(tone, 2600) * 0.5 + air * 0.6) * t ** 2.2


def click(strength=1.0, seed=0, f=640):
    t = tt(0.035)
    x = bp(nz(len(t), seed), 1800, 5200) * np.exp(-t * 900)
    body = np.sin(2 * np.pi * f * t) * np.exp(-t * 230) * 0.7
    return (x * 1.3 + body) * strength


def zap(d=0.2, seed=0, size=1.0):
    t = tt(d)
    rg = np.random.default_rng(seed)
    am = (sg.square(2 * np.pi * (90 + 50 * rg.random()) * t) > 0) * 1.0
    x = hp(nz(len(t), seed) * (0.35 + 0.65 * am), 1100) * np.exp(-t * (5.0 / d))
    snap = bp(nz(len(t), seed + 5), 2500, 9000) * np.exp(-t * 60) * 1.5
    low = np.sin(2 * np.pi * 110 * t) * am * np.exp(-t * (7.0 / d)) * 0.5
    return (x + snap + low) * size


def beep(d, f):
    t = tt(d)
    return np.sin(2 * np.pi * f * t) * ar(len(t), 0.006, 0.012) * (1 + 0.15 * np.sin(2 * np.pi * f * 2 * t))


def chirp(f0, f1, d):
    t = tt(d)
    f = f0 + (f1 - f0) * (t / d) ** 0.7
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) ** 1.4


def clunk(seed=0, f=70):
    t = tt(0.3)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * 22) + bp(nz(len(t), seed), 300, 2400) * np.exp(-t * 70) * 0.8


def pluck(f, d=0.26, cut=1400):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = saw(f, n) + saw(f * 1.004, n) * 0.7
    e = np.exp(-t * 14)
    y = lp(x, cut) * e + lp(x, 350) * np.exp(-t * 7) * 0.8
    return y * ar(n, 0.003, 0.03)


def main():
    music = np.zeros((N, 2))
    sfx = np.zeros((N, 2))
    D1, D2, A1 = 36.71, 73.42, 55.0
    D3, F3, A3, D4, F4, A4, E5 = 146.83, 174.61, 220.0, 293.66, 349.23, 440.0, 659.25

    # ---------------- score ----------------
    # sub drone under the first act
    t = tt(17.2)
    drone = (np.sin(2 * np.pi * D1 * t) * 0.9 + np.sin(2 * np.pi * D2 * t) * 0.5) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.13 * t)) * ar(len(t), 1.0, 0.4)
    place(music, drone, 0.0, 0.20)
    # the sky wakes up (hook)
    place(music, choir([D4, F4, A4, E5], 4.4, 2.6, 0.5, seed=3), 3.8, 0.30)
    # Carrington at the telescope: quiet pad + heartbeat
    place(music, pad([D3, A3, D4], 6.2, 900, 1.2, 0.3, seed=4), 8.0, 0.22)
    for i, tb in enumerate(np.arange(8.3, 13.5, 0.6)):
        th = lambda k: np.sin(2 * np.pi * 58 * tt(0.22)) * np.exp(-tt(0.22) * k)
        place(music, th(20), tb, 0.50 + 0.03 * i)
        place(music, th(26), tb + 0.17, 0.30 + 0.02 * i)
    # the storm crosses: tremolo cluster
    n = int(3.1 * SR)
    tr = pad([D3, F3, 207.65], 3.1, 1500, 0.3, 0.1, seed=5) * (0.55 + 0.45 * np.sin(2 * np.pi * 11 * np.arange(n) / SR))[:, None] * np.linspace(0.4, 1.0, n)[:, None]
    place(music, tr, 14.1, 0.26)
    # blood-red sky: Dm - Bb - F - C, choir + arpeggio
    chords = [[D3, F3, A3, D4], [116.54, D3, F3, 233.08], [87.31, 110.0, 130.81, F3], [130.81, 164.81, 196.0, 261.63]]
    for i, ch in enumerate(chords):
        place(music, choir(ch, 2.5, 0.5, 0.6, seed=10 + i), 17.45 + i * 2.0, 0.34)
        place(music, np.sin(2 * np.pi * ch[0] / 2 * tt(2.2)) * ar(int(2.2 * SR), 0.2, 0.5), 17.5 + i * 2.0, 0.22)
        for k in range(8):
            note = ch[[0, 1, 2, 3, 2, 1, 2, 3][k]] * 2
            place(music, pluck(note, 0.3, 2200), 17.5 + i * 2.0 + k * 0.25, 0.085, pan=(-0.5 if k % 2 else 0.5))
    # chaos in the telegraph office
    n = int(6.0 * SR)
    grit = pad([D2, 77.78, 110.0], 6.0, 1100, 0.3, 0.3, det=0.012, seed=20)
    grit *= (0.6 + 0.4 * (sg.square(2 * np.pi * 8 * np.arange(n) / SR) > 0))[:, None] * np.linspace(0.6, 1.0, n)[:, None]
    place(music, grit, 25.5, 0.46)
    # Boston: wonder
    place(music, choir([116.54, D3, F3, 233.08], 3.3, 0.6, 0.6, seed=30), 31.5, 0.42)
    place(music, choir([98.0, 116.54, D3, 196.0], 2.2, 0.4, 0.5, seed=31), 34.5, 0.42)
    place(music, choir([110.0, 164.81, A3, 277.18], 1.9, 0.4, 0.25, seed=32), 36.3, 0.42)
    # title
    place(music, pad([D2, 110.0, D3, F3, A3, D4], 4.5, 1900, 0.04, 0.5, seed=40), 38.1, 0.30)
    place(music, np.sin(2 * np.pi * D1 * tt(4.4)) * ar(int(4.4 * SR), 0.02, 0.6), 38.1, 0.22)
    # 2012: ostinato
    step = 60 / 132 / 2
    pat = [D2, D2, 87.31, D2, 110.0, D2, 98.0, 87.31]
    for k, tb in enumerate(np.arange(42.7, 48.05, step)):
        if 46.55 < tb < 47.95:
            continue
        g = 0.15 + 0.11 * min(1, (tb - 42.7) / 3.5)
        place(music, pluck(pat[k % 8] * 2, 0.24, 1100 + 900 * min(1, (tb - 42.7) / 4)), tb, g, pan=(0.25 if k % 2 else -0.25))
        if k % 4 == 0:
            place(music, np.sin(2 * np.pi * D1 * 2 * tt(0.3)) * np.exp(-tt(0.3) * 12), tb, 0.20)
    place(music, pad([D3, A3], 3.9, 800, 1.2, 0.2, seed=41), 42.7, 0.18)
    # damage: low held note
    place(music, np.sin(2 * np.pi * D1 * tt(3.0)) * ar(int(3.0 * SR), 0.3, 0.4), 49.0, 0.16)
    place(music, pad([D2, 110.0], 3.0, 500, 0.6, 0.4, seed=42), 49.0, 0.16)
    # the question
    place(music, choir([D3, F3, A3, D4], 2.4, 0.7, 0.4, seed=50), 52.2, 0.46)
    place(music, choir([116.54, D3, F3, 233.08], 1.75, 0.3, 0.12, seed=51), 54.2, 0.48)
    place(music, pad([D3, A3, D4], 2.1, 700, 0.5, 0.05, seed=52), 55.95, 0.30)
    rs = riser(0.9, 60)
    place(music, rs, 57.08, 0.22)
    music = reverb(music, 2.4, 0.32, seed=3)

    # ---------------- effects ----------------
    place(sfx, hit(0.6, 2, 0.6), 0.0, 0.50)                                       # cold open
    place(sfx, whoosh(0.9, 500, 5000, 1, 0.35), 0.0, 0.10)                       # pencil-on-paper draw-on
    for j, (a, b) in enumerate(EV["S1"]):                                         # key works on the battery
        place(sfx, click(1.0, j), a, 0.17, -0.1)
        place(sfx, click(0.55, j + 50, 520), b, 0.17, -0.1)
    place(sfx, zap(0.16, 3, 0.8), 2.76, 0.18, -0.2)                               # unplugged
    place(sfx, clunk(4, 90), 2.78, 0.30, -0.2)
    for j, (a, b) in enumerate(EV["S2"]):                                         # ...and it keeps working
        if a > 5.6: break
        place(sfx, click(1.0, 100 + j), a, 0.18, 0.1)
        place(sfx, click(0.55, 150 + j, 520), b, 0.18, 0.1)
        place(sfx, beep(max(0.03, b - a), 880), a, 0.05, 0.3)
    n = int(4.0 * SR)                                                             # current hum from the sky
    hum = lp(saw(55, n) + saw(110.3, n) * 0.6 + saw(165.4, n) * 0.3, 700) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * np.arange(n) / SR)) * ar(n, 2.0, 0.4)
    place(sfx, hum, 3.9, 0.10)
    place(sfx, whoosh(0.7, 200, 3000, 5), 5.4, 0.42)                              # whip pan
    place(sfx, hit(0.6, 6, 0.2), 8.05, 0.40)                                      # the Sun
    n = int(6.0 * SR)
    place(sfx, lp(nz(n, 7), 160, 3) * ar(n, 0.8, 0.3) * 3.0, 8.1, 0.14)           # solar rumble
    for tb, f in ((11.15, 1568.0), (11.55, 2093.0)):                              # two white-light kernels
        t = tt(1.2)
        place(sfx, (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t * 4) * ar(len(t), 0.004, 0.1), tb, 0.10, 0.3)
        place(sfx, whoosh(0.5, 1500, 8000, int(tb * 10)), tb - 0.1, 0.10, 0.3)
    place(sfx, riser(1.45, 8), 12.55, 0.42)
    place(sfx, hit(1.0, 9, 1.0), 13.98, 0.62)                                     # whiteout
    tk = 14.45                                                                    # the clock runs
    while tk < 17.0:
        place(sfx, click(0.6, int(tk * 100), 1200), tk, 0.10, -0.4)
        tk += 0.16 - 0.10 * (tk - 14.45) / 2.6
    place(sfx, whoosh(2.7, 150, 2500, 10, 0.85), 14.4, 0.50)                      # the cloud crosses space
    place(sfx, hit(1.25, 11, 0.9), 17.08, 0.78)                                   # slams into Earth
    n = int(2.9 * SR)                                                             # the sky itself
    air = bp(nz(n, 18), 2200, 6500) * (0.5 + 0.5 * lp(np.abs(nz(n, 19)), 2.5) * 2.5) + bp(nz(n, 17), 220, 700) * 1.2
    place(sfx, air * ar(n, 0.5, 0.9), 17.4, 0.05)
    n = int(2.2 * SR)                                                             # the band slides south
    f = 880 * 2 ** (-np.linspace(0, 1, n) ** 0.8)
    place(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * ar(n, 0.3, 0.3) * (0.7 + 0.3 * np.sin(2 * np.pi * 6 * np.arange(n) / SR)), 20.15, 0.045, 0.2)
    t = tt(0.9)
    place(sfx, np.sin(2 * np.pi * 987.77 * t) * np.exp(-t * 5) * ar(len(t), 0.003, 0.1), 21.8, 0.14)   # Cuba
    rg = np.random.default_rng(22)                                                # birds
    for b in range(5):
        base = 2600 + 420 * b
        times = list(22.95 + b * 0.13 + np.array([0.0, 0.45])) + list(np.arange(24.02 + b * 0.06, 25.35, 0.21 + 0.03 * b))
        for tb in times:
            for k in range(int(2 + rg.integers(0, 3))):
                up = rg.random() > 0.4
                c = chirp(base * (1.0 if up else 1.5), base * (1.6 if up else 1.0), 0.05 + 0.03 * rg.random())
                place(sfx, c, tb + k * 0.075, 0.12, pan=-0.7 + 0.35 * b)
    n = int(5.9 * SR)                                                             # haywire
    buzz = hp(saw(60, n) * (sg.square(2 * np.pi * 120 * np.arange(n) / SR) > 0), 300) * (0.5 + 0.5 * lp(np.abs(nz(n, 25)), 6) * 3) * ar(n, 0.3, 0.4)
    place(sfx, buzz, 25.6, 0.045)
    rg = np.random.default_rng(26)
    tk = 25.75
    while tk < 31.2:                                                              # needle rattling on its stops
        place(sfx, click(0.5, int(tk * 100), 900), tk, 0.07, -0.3)
        tk += 0.05 + 0.16 * rg.random()
    for tb, sz in ((27.56, 0.8), (27.86, 0.75), (28.16, 1.0)):
        place(sfx, zap(0.22, int(tb * 10), sz), tb, 0.24, -0.2 if tb != 27.86 else 0.4)
    place(sfx, zap(0.42, 290, 1.3), 28.62, 0.28)                                  # the shock
    place(sfx, hit(0.7, 291, 0.4), 28.63, 0.36)
    n = int(1.75 * SR)                                                            # paper burns
    crack = bp((np.random.default_rng(30).random(n) < 0.004) * np.random.default_rng(31).standard_normal(n) * 9, 900, 6500)
    roar = lp(nz(n, 32), 420, 2) * (0.6 + 0.4 * lp(np.abs(nz(n, 33)), 5) * 2) * 2.2
    place(sfx, (crack * 0.5 + roar) * ar(n, 0.25, 0.3), 29.85, 0.16, 0.5)
    place(sfx, whoosh(0.6, 300, 3000, 34), 31.25, 0.25)
    for tb, pn in ((32.7, -0.4), (33.05, 0.3)):                                   # batteries off
        place(sfx, clunk(int(tb * 10), 85), tb, 0.36, pn)
        place(sfx, click(1.0, int(tb * 10) + 1, 400), tb, 0.25, pn)
    n = int(4.0 * SR)
    place(sfx, lp(saw(55, n) + saw(110.3, n) * 0.6, 600) * (0.7 + 0.3 * np.sin(2 * np.pi * 5 * np.arange(n) / SR)) * ar(n, 0.6, 0.4), 33.7, 0.07)
    for k in range(9):                                                            # messages on auroral current
        ln = 0.13 if k % 3 == 0 else 0.055
        place(sfx, beep(ln, 620), 34.98 + k * 0.118, 0.075, -0.4)
        place(sfx, beep(ln, 740), 36.22 + k * 0.118, 0.075, 0.4)
    place(sfx, hit(1.15, 38, 0.8), 38.1, 0.72)                                    # title
    n = int(0.8 * SR)
    place(sfx, bp(nz(n, 39), 3000, 9000) * np.linspace(0, 1, n) ** 2, 41.72, 0.05)
    place(sfx, whoosh(1.6, 150, 3000, 43, 0.3), 43.45, 0.42)                      # 2012 eruption
    place(sfx, hit(0.7, 44, 0.3), 43.6, 0.40)
    t = tt(0.8)
    place(sfx, np.sin(2 * np.pi * 1318.5 * t) * np.exp(-t * 6) * ar(len(t), 0.003, 0.1), 44.35, 0.10, 0.5)   # the probe
    n = int(1.3 * SR)                                                             # rewind one week
    f = 300 * 2 ** (np.linspace(0, 1, n) * 1.6)
    rw = lp(saw(f, n), 3000) * (0.5 + 0.5 * (sg.square(2 * np.pi * 26 * np.arange(n) / SR) > 0)) * ar(n, 0.05, 0.08)
    place(sfx, rw, 46.72, 0.11)
    place(sfx, hit(1.1, 48, 0.9), 48.14, 0.74)                                    # it would have hit us
    tk = 49.45
    while tk < 50.5:                                                              # digits rolling
        place(sfx, click(0.6, int(tk * 100), 1500), tk, 0.10, 0.2)
        tk += 0.062
    place(sfx, hit(0.85, 50, 0.5), 50.44, 0.58)
    place(sfx, hit(0.6, 51, 0.3), 50.88, 0.42)
    n = int(0.75 * SR)                                                            # the number goes dark
    f = 240 * 2 ** (-np.linspace(0, 1, n) * 3)
    place(sfx, lp(saw(f, n), 900) * ar(n, 0.02, 0.3) * np.linspace(1, 0.3, n), 51.42, 0.16)
    n = int(0.65 * SR)                                                            # the grid flickers
    gate = (lp((np.random.default_rng(53).random(n) > 0.5) * 1.0, 40) > 0.5) * 1.0
    place(sfx, hp(saw(60, n) * (sg.square(2 * np.pi * 120 * np.arange(n) / SR) > 0), 300) * gate * ar(n, 0.02, 0.05), 53.3, 0.07)
    for k, tb in enumerate(np.arange(54.25, 55.85, 0.115)):                       # the city goes dark, block by block
        place(sfx, clunk(540 + k, 95 - 3.5 * k), tb, 0.26, pan=-0.8 + 1.6 * k / 13)
    n = int(2.3 * SR)                                                             # wind over a dark city
    place(sfx, bp(nz(n, 56), 250, 1100) * (0.6 + 0.4 * lp(np.abs(nz(n, 57)), 1.5) * 3) * ar(n, 0.5, 0.25), 55.7, 0.05)
    place(sfx, hit(0.5, 58, 0.1), 56.0, 0.36)
    sfx = reverb(sfx, 1.3, 0.16, seed=9)

    # ---------------- narration ----------------
    vo_path = HERE / "vo_proc.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(HERE / "vo2.wav"), "-af",
                    "highpass=f=75,acompressor=threshold=-21dB:ratio=3:attack=8:release=120:makeup=3,loudnorm=I=-17:TP=-2:LRA=7",
                    "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(vo_path)], check=True)
    with wave.open(str(vo_path)) as w:
        vo = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
    vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
    envl = lp(np.abs(vo), 6)
    duck = 1 - 0.5 * np.clip(envl / (np.percentile(envl, 90) + 1e-9), 0, 1)
    duck = lp(duck, 4)

    def db(x):
        return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)

    print(f"rms dBFS  vo {db(vo[vo != 0]):.1f}  music {db(music):.1f}  sfx {db(sfx):.1f}  peaks vo {np.abs(vo).max():.2f} music {np.abs(music).max():.2f} sfx {np.abs(sfx).max():.2f}")
    MUSIC_GAIN, SFX_GAIN = 0.30, 0.80
    w = 2 * SR
    print("  t   vo   music  sfx   (dBFS rms per 2 s, after stem gains, before ducking)")
    for i in range(0, N, w):
        print(f"{i / SR:4.0f} {db(vo[i:i + w]):6.1f} {db(music[i:i + w] * MUSIC_GAIN):6.1f} {db(sfx[i:i + w] * SFX_GAIN):6.1f}  pk {np.abs(sfx[i:i + w]).max() * SFX_GAIN:.2f}")
    mix = np.stack([vo, vo], axis=1) * 1.0 + music * duck[:, None] * MUSIC_GAIN + sfx * (0.75 + 0.25 * duck[:, None]) * SFX_GAIN
    mix = np.tanh(mix * 1.1) / 1.1                                                # soft clip the loudest hits
    mix[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]
    mix[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))[:, None]
    print(f"mix peak {np.abs(mix).max():.2f} rms {db(mix):.1f}")
    for name, arr in (("mix_raw.wav", mix), ("stem_music.wav", music), ("stem_sfx.wav", sfx)):
        with wave.open(str(HERE / name), "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((np.clip(arr, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(HERE / "mix_raw.wav"), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-ar", str(SR), "-c:a", "pcm_s16le", str(HERE / "soundtrack.wav")], check=True)
    print("wrote soundtrack.wav")


if __name__ == "__main__":
    main()
