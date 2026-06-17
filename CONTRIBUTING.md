# Contributing

Thanks for improving PIDron. Keep changes focused, practical, and safe for users who may copy PID values into real flight controllers.

## Development

```powershell
npm install
npm start
```

## Checks

Run these before opening a pull request:

```powershell
node --check app.js
node --check drone3d.js
npm audit --audit-level=high
```

For release builds:

```powershell
npm run build:installer
npm run build:win
npm run build:linux
```

## Pull Request Standard

- Explain the user-facing change.
- Include screenshots or short notes for UI changes.
- Keep tuning/safety claims honest and conservative.
- Avoid unrelated refactors in feature PRs.
- Update README or CHANGELOG when release behavior changes.
