# Contributing to KingKiosk

Thanks for your interest in helping improve KingKiosk!

KingKiosk is a closed-source product, but this repository serves as our **public issue tracker and documentation hub**. We welcome bug reports, feature requests, and questions from all users.

## How to Contribute

### Reporting Bugs

1. **Search first** — check [existing issues](https://github.com/ajarsm/kingkiosk/issues) to avoid duplicates
2. **Use the Bug Report template** — it helps us investigate faster
3. **Include details** — platform, version, steps to reproduce, and logs make a huge difference
4. **One bug per issue** — makes tracking and resolution easier

### Requesting Features

1. **Search first** — your idea may already be requested (add a thumbs-up to show support!)
2. **Use the Feature Request template**
3. **Describe the use case** — tell us *what you're trying to accomplish*, not just what button you want

### Asking Questions

1. **Check the [docs](https://github.com/ajarsm/kingkiosk/tree/main/docs)** first
2. **Use the Question template** for setup, configuration, or usage help
3. **Include your platform and configuration** (redact any passwords or tokens)

## What to Include in Bug Reports

Good bug reports help us fix issues faster. Please include:

- **Platform & device** (e.g., Android on Samsung Tab A8, Linux on Raspberry Pi 4)
- **KingKiosk version** (found in Settings > About)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **MQTT details** if command-related (broker type, topic, payload)
- **Screenshots or screen recordings** when relevant
- **Logs** from the debug console if available

## MQTT Command Issues

If your issue involves MQTT commands, please include:

- Your MQTT broker type and version (Mosquitto, EMQX, etc.)
- The exact topic you're publishing to
- The full JSON payload (redact any sensitive data)
- Whether HMAC signing is enabled

## Security Issues

If you discover a security vulnerability, **do not open a public issue**. Instead, please contact us directly so we can address it before public disclosure.

## Code of Conduct

- Be respectful and constructive
- Stay on topic
- Help others when you can
- Remember that maintainers are people too
