# PIDron

PIDron is planned as a local drone emulator and PID tuning assistant.

The app should let the user configure many multicopter builds, simulate their rate response, and recommend practical PID values for the selected frame, motors, props, battery, payload, and flight style.

## Target Features

- Drone types: 5-inch, 7-inch, 10-inch, custom frames, quadcopters, hexacopters, octocopters, coaxial variants, pusher and non-pusher layouts.
- Free component mixing: for example, 7-inch props on a 10-inch frame if the user wants to test that combination.
- Inputs: frame size, arm length, frame mass, payload, motor KV, stator size, prop diameter/pitch/blades, battery cell count/capacity/sag, motor layout, filtering assumptions, wind/noise level.
- Simulation: roll/pitch/yaw rate loop, motor lag, thrust curve, torque authority, moment of inertia, gyro noise, battery voltage sag, prop loading, and stability metrics.
- PID optimizer: search for stable P/I/D/feedforward values and report overshoot, settling time, oscillation risk, motor saturation, and tuning confidence.
- UI: Ukrainian-first interface, presets for common builds, sliders/inputs for all advanced parameters, graphs, warnings, and exportable results.

## Proposed Implementation

Use a self-contained frontend first:

- `index.html`: app shell.
- `styles.css`: responsive interface.
- `app.js`: state, presets, simulation, optimizer, graphs.

No backend is required for the first version. The app can run directly from the browser or through a tiny local static server.

## Desktop Build

PIDron can also run as a local Windows desktop app without opening a browser or starting a local web server.

- Development run: `npm start`
- Windows desktop executable: `npm run build:win`
- Build output: `dist/PIDron-win32-x64/PIDron.exe`

Current desktop modules:

- Main PID simulator and drone visualizer.
- Separate settings window with saved theme/language preferences.
- Flight controller lab for generating Betaflight/INAV CLI or ArduPilot parameter drafts.
- Blackbox/CSV analysis MVP for tracking error, noise, saturation, and PID adjustment hints.
- Three.js 3D drone preview.

## Simulation Notes

The first model should be transparent and editable rather than pretending to be a CFD-grade simulator.

- Estimate thrust from prop diameter, pitch, blade count, motor KV, voltage, and loading.
- Estimate inertia from frame size, mass distribution, battery, and payload.
- Use a discrete rate PID loop for roll, pitch, and yaw.
- Add motor response delay and clamp output to available motor authority.
- Score candidate PID sets by rise time, overshoot, settling time, steady-state error, oscillation, and saturation.
- Present all recommendations as realistic starting points, not guaranteed flight-safe final values.

## Build Plan

1. Create static app files.
2. Add drone/component presets and custom parameter editing.
3. Implement physics estimation and rate-loop simulation.
4. Implement PID search/optimizer.
5. Add graphs and recommendation cards.
6. Add validation warnings for risky builds.
7. Verify locally in browser.

## Safety

PIDron should always warn that real drone PID values must be tested carefully:

- Remove props during bench testing.
- Start with conservative values.
- Check motor temperature and oscillation.
- Validate failsafe and arming behavior.
- Use real blackbox logs when possible.
