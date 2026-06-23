# PIDron

<p align="center">
  <strong>Local desktop workstation for drone setup simulation, PID tuning, presets, log analysis, and flight-controller workflows.</strong>
</p>

<p align="center">
  <a href="https://oleksii1221.github.io/PIDron/">Website</a>
  ·
  <a href="https://github.com/Oleksii1221/PIDron/releases/tag/v1.2.1">Latest release</a>
  ·
  <a href="https://github.com/Oleksii1221/PIDron/issues">Issues</a>
</p>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.2.1-55c0a6">
  <img alt="Platform" src="https://img.shields.io/badge/platform-Windows%20%7C%20Ubuntu%20%7C%20Fedora-151d1b">
  <img alt="Electron" src="https://img.shields.io/badge/Electron-42-55c0a6">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-151d1b">
</p>

PIDron is a Ukrainian-first Electron desktop app for experimenting with multicopter setups and rate-loop PID behavior before touching a real flight controller. It runs locally from packaged app files: no web server, localhost page, or cloud backend is required.

## Download

| Platform | Recommended package |
| --- | --- |
| Windows | [PIDron-Setup-1.2.1-x64.exe](https://github.com/Oleksii1221/PIDron/releases/download/v1.2.1/PIDron-Setup-1.2.1-x64.exe) |
| Windows portable | [PIDron-1.2.1-win-x64.zip](https://github.com/Oleksii1221/PIDron/releases/download/v1.2.1/PIDron-1.2.1-win-x64.zip) |
| Ubuntu / Debian | [PIDron-1.2.1-linux-amd64.deb](https://github.com/Oleksii1221/PIDron/releases/download/v1.2.1/PIDron-1.2.1-linux-amd64.deb) |
| Fedora / RPM | [PIDron-1.2.1-linux-x86_64.rpm](https://github.com/Oleksii1221/PIDron/releases/download/v1.2.1/PIDron-1.2.1-linux-x86_64.rpm) |
| Linux portable | [PIDron-1.2.1-linux-x64.zip](https://github.com/Oleksii1221/PIDron/releases/download/v1.2.1/PIDron-1.2.1-linux-x64.zip) |

The Windows installer uses NSIS with a PIDron icon, install directory selection, desktop shortcut, Start Menu shortcut, and uninstall entry.

## Highlights

- Setup editor for 5", 7", 10", and custom builds.
- Quad, hex, octo, and coax layouts with per-motor standard/pusher mixing.
- Free mixing of frames, motors, props, batteries, payload, filtering, wind, and noise assumptions.
- Transparent physics model: thrust estimate, inertia, motor lag, battery sag, prop loading, noise, wind, and saturation.
- Roll/pitch/yaw rate PID simulation with response graphs.
- Automatic P/I/D/feedforward suggestions with overshoot, settling time, oscillation risk, and saturation metrics.
- Named presets saved locally.
- Three.js drone preview with PID-response motion.
- Flight-controller lab for Betaflight/INAV CLI and ArduPilot parameter drafts.
- Serial workflow MVP for reading PID text output and guarded write.
- CSV/TXT log analysis MVP with honest detection for binary `.bbl` files.
- Persisted themes, language, and compact mode.

## App Structure

| Area | Purpose |
| --- | --- |
| Simulator | Drone geometry, propulsion, battery, environment, filters, and PID step-response. |
| Presets | Saved user setups with names and quick restore. |
| Analysis | Flight log import, signal checks, and PID correction hints. |
| Flight Controller | Betaflight, INAV, and ArduPilot-oriented PID text workflows. |
| Settings | Language, theme, compact mode, and app preferences. |

## Run From Source

```powershell
npm install
npm start
```

Windows quick start:

```powershell
.\run-pidron.bat
```

## Build

```powershell
npm run build:installer
npm run build:ubuntu
npm run build:fedora
npm run build:linux:packages
npm run build:win
npm run build:linux
npm run build:all
```

Outputs:

- Windows installer: `dist-installer/PIDron-Setup-1.2.1-x64.exe`
- Windows portable: `dist/PIDron-win32-x64/PIDron.exe`
- Ubuntu/Debian package: `dist-installer/PIDron-1.2.1-linux-amd64.deb`
- Fedora/RPM package: `dist-installer/PIDron-1.2.1-linux-x86_64.rpm`
- Ubuntu/Linux: `dist/PIDron-linux-x64/PIDron`

## Roadmap

- Native MSP/CLI reader for real Betaflight and INAV boards.
- Direct `.bbl` Blackbox import without CSV conversion.
- Richer 3D animation of thrust, tilt, saturation, and PID response.
- Safer guided write flow with board profile detection and backup.
- More validated motor, prop, and battery presets.

## Safety

PIDron recommendations are starting points, not guaranteed flight-safe final values.

- Remove props during bench testing.
- Start with conservative values.
- Check motor temperature and oscillation after every tuning change.
- Validate failsafe and arming behavior before flight.
- Use real Blackbox logs whenever possible.

## Project

- Website: <https://oleksii1221.github.io/PIDron/>
- Releases: <https://github.com/Oleksii1221/PIDron/releases>
- Maintainer: Oleksii "Kico" (@Oleksii1221)
- License: MIT
