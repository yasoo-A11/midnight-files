"""Sound library: synthesized instruments and one-shot effects (numpy/scipy). Import from a film's audio.py."""
from pathlib import Path
import numpy as np
from scipy import signal as sg

HERE = Path(__file__).resolve().parent
SR = 48000


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


# ---------------------------------------------------------------- more one-shot sounds (first used in the Black Friday film)
def scratch(d, seed=0, f1=1700, f2=6200):
    """A pen or pencil stroke on paper."""
    n = int(d * SR)
    am = 0.35 + 0.65 * np.clip(lp(np.abs(nz(n, seed + 1)), 45) * 3.2, 0, 1)
    return bp(nz(n, seed), f1, f2) * am * ar(n, 0.015, 0.05)


def horn(d, f=415.0):
    """Two-note car horn."""
    n = int(d * SR)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * np.arange(n) / SR)
    return lp(saw(f * vib, n) + 0.9 * saw(f * 1.26 * vib, n), 2300) * ar(n, 0.012, 0.05) * 0.5


def whistle(d, f=2850.0, seed=0):
    t = tt(d)
    tr = np.sin(2 * np.pi * 36 * t)
    x = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.025 * tr)) / SR) * (0.72 + 0.28 * tr)
    return (x + hp(nz(len(t), seed), 5000) * 0.12) * ar(len(t), 0.02, 0.07)


def bell(f, d=1.2, k=5.0):
    t = tt(d)
    x = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.01 * t) + 0.25 * np.sin(2 * np.pi * f * 3.02 * t)
    return x * np.exp(-t * k) * ar(len(t), 0.003, 0.08)


def thud(f=58.0, d=0.24, k=20.0):
    t = tt(d)
    return np.sin(2 * np.pi * f * t) * np.exp(-t * k)


def hat(seed=0, k=95.0):
    t = tt(0.07)
    return hp(nz(len(t), seed), 7000) * np.exp(-t * k)


def powerdown(d=0.75, f0=294.0, octs=2.8):
    n = int(d * SR)
    f = f0 * 2 ** (-np.linspace(0, 1, n) * octs)
    return lp(saw(f, n), 1100) * ar(n, 0.02, 0.25) * np.linspace(1, 0.35, n)


def fall(d=0.9, f0=880.0, octs=3.6):
    n = int(d * SR)
    f = f0 * 2 ** (-np.linspace(0, 1, n) ** 0.8 * octs)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * ar(n, 0.01, 0.3) * (0.75 + 0.25 * np.sin(2 * np.pi * 9 * np.arange(n) / SR))


def sine(f, d, a, r):
    return np.sin(2 * np.pi * f * tt(d)) * ar(int(d * SR), a, r)
