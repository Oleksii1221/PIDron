# PIDron

PIDron is a local desktop workstation for drone setup experiments, rate PID simulation, preset management, and flight-controller PID workflows.

The interface is Ukrainian-first and runs locally through Electron. It does not need an external backend.

## Current Features

- Multicopter setup editor for 5", 7", 10", and custom builds.
- Quad, hex, octo, coax layouts with per-motor standard/pusher mixing.
- Free mixing of frames, motors, props, batteries, payload, filtering, wind, and noise assumptions.
- Transparent physics model: thrust estimate, inertia, motor lag, battery sag, prop loading, noise, wind, saturation.
- Roll/pitch/yaw rate PID simulation with response graph.
- Automatic P/I/D/feedforward suggestions with overshoot, settling, oscillation risk, and saturation metrics.
- Custom preset saving with a dedicated Presets page.
- Three.js drone preview with PID-response motion.
- Flight-controller lab for Betaflight/INAV CLI and ArduPilot parameter drafts.
- Serial workflow MVP for connecting, reading PID text output, and guarded write.
- CSV/TXT log analysis MVP plus honest detection for binary `.bbl` files.
- Theme and compact-mode settings persisted locally.

## Run Locally

```powershell
npm install
npm start
```

Windows quick start:

```powershell
.\run-pidron.bat
```

## Desktop Builds

```powershell
npm run build:win
npm run build:linux
npm run build:all
```

Outputs:

- Windows: `dist/PIDron-win32-x64/PIDron.exe`
- Ubuntu/Linux: `dist/PIDron-linux-x64/PIDron`

## Project Site

GitHub Pages source is in `docs/`. Enable Pages for the repository from the `master` branch and `/docs` folder.

Expected URL after Pages is enabled:

`https://oleksii1221.github.io/PIDron/`

## Safety

PIDron recommendations are starting points, not guaranteed flight-safe final values.

- Remove props during bench testing.
- Start with conservative values.
- Check motor temperature and oscillation.
- Validate failsafe and arming behavior.
- Use real Blackbox logs whenever possible.
