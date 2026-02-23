# Repository Guidelines

## Project Structure & Module Organization
This repository is a host wrapper around the Flutter app in `flutter_io_page/` (git submodule).  
Root-level web files (`index.html`, `assets/`, `flutter.js`, `main.dart.*`, etc.) are symlinks to `flutter_io_page/build/web/` for GitHub Pages serving.

- `flutter_io_page/lib/`: app source (entry: `main.dart`, UI in `home_components/`, shared code in `utilities/` and `theme/`)
- `flutter_io_page/test/`: widget tests
- `flutter_io_page/assets/`: bundled images/fonts/text JSON
- `.github/workflows/`: CI and submodule sync automation
- `.gitmodules`: submodule source and branch tracking

## Build, Test, and Development Commands
Run app commands inside the submodule unless noted.

- `git submodule sync -- flutter_io_page && git submodule update --init --remote flutter_io_page`: refresh submodule to latest tracked commit.
- `cd flutter_io_page && flutter pub get`: install dependencies.
- `cd flutter_io_page && flutter run -d chrome`: local development with hot reload.
- `cd flutter_io_page && flutter analyze`: static analysis with `flutter_lints`.
- `cd flutter_io_page && flutter test -r expanded`: run tests.
- `cd flutter_io_page && ./build.sh`: release web build (`--wasm`, source maps, tree shaking).

## Coding Style & Naming Conventions
- Dart style follows Flutter defaults: 2-space indentation, `PascalCase` types/widgets, `lowerCamelCase` members, `snake_case.dart` filenames.
- Format before commit: `cd flutter_io_page && dart format lib test tool`.
- Do not hand-edit generated outputs under `flutter_io_page/build/`.

## Testing Guidelines
- Framework: `flutter_test`.
- Place tests in `flutter_io_page/test/` using `*_test.dart` names.
- For UI changes, add/adjust widget tests and run both `flutter analyze` and `flutter test` before opening a PR.

## Commit & Pull Request Guidelines
- Current history is mostly short updates (for example, `Update flutter_io_page`, `minor updates`).
- Prefer explicit imperative messages, e.g. `chore: sync flutter_io_page to <sha>` or `ci: update sync workflow`.
- PRs should include: purpose, key changes, validation commands run, linked issue (if any), and screenshots/GIFs for UI changes in `flutter_io_page/`.
- If submodule pointer changes, call out the new `flutter_io_page` commit SHA in the PR description.
