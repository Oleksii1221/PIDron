# Security Policy

PIDron is a local desktop tool. It should not require a cloud backend or local web server for normal use.

## Supported Version

| Version | Supported |
| --- | --- |
| 1.2.x | Yes |

## Reporting

Please report security issues privately to the maintainer before opening a public issue. Include:

- PIDron version.
- Operating system.
- Reproduction steps.
- Any file, serial, or flight-controller workflow involved.

## Safety Scope

PIDron can generate PID and flight-controller text suggestions. Treat all generated values as experimental. Remove props before bench testing and validate every change on real hardware with conservative settings.
