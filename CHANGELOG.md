# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Wallpaper Language Selector**: Independent language control for wallpaper text (剩余 X 天, 进度 X%, etc.), with smart sync to site language until user manually overrides.
- **Worker i18n Module**: New `worker/src/i18n.js` for centralized wallpaper text translations across all three generators.
- **Multi-language Support (i18n)**: Full internationalization for English, Simplified Chinese, Traditional Chinese, and Japanese.
- **IP-based Geolocation**: Automatic language detection based on Cloudflare's `CF-IPCountry` header.
- **Language Selector**: Premium UI toggle for manual language switching with persistence.
- **Architecture Mirror (`CLAUDE.md`)**: New internal documentation focusing on system design and refinement plans.
- **Implementation Guide (`MULTILINGUAL.md`)**: Developer guide for adding and managing translations.
- **Google Fonts Integration**: Dynamic loading of CJK fonts (Noto Sans SC/TC/JP) for optimal typography.

### Fixed
- **Uniform Typography**: Standardized font size and weight for progress stats across preview canvas and worker generators.
- **Goal Preview Visibility**: Fixed goal countdown text color in Light Mode to ensure visibility against the dark preview background.
- **Device Notch Color**: Fixed Dynamic Island/Notch to always be black (hardware color), regardless of theme.
- **Preview Fill**: Changed Canvas `object-fit` from `contain` to `cover` to eliminate white gaps in device preview.

### Refactored
- **State Management**: Unified state updates via `setState()` and centralized `render()` loop to eliminate dual-trigger bugs.
- **DOM Selector Consolidation**: All DOM references are now cached in a single `elements` object.
- **Grid Rendering Abstraction**: Extracted `drawStats()` and unified logic across different preview types, reducing ~50 lines of duplicate code.
- **Simplified Events**: Standardized event listeners to use the new state machine approach.

### Changed
- **Git Ignore**: Updated to exclude AI documentation, project-specific workflows (`.agent/`), and local commit templates (`.gitmessage`).
- **Bilingual README**: Updated project documentation to be bilingual (EN/ZH).
- **Directory Structure**: Organized static assets and logic into `data/` and specialized loader scripts.
