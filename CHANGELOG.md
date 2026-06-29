# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add `generate_release_notes` input to let GitHub automatically generate the release name and body.

## [4.0.1] - 2026-06-29

### Changed

- Update `@actions/core` from 1.11.1 to 3.0.1.
- Update `@actions/github` from 6.0.0 to 9.1.1.

## [4.0.0] - 2026-03-21

### Changed

- Bump runtime from Node.js 20 to Node.js 24.

## [3.0.0] - 2023-12-16

### Changed

- Bump runtime from Node.js 16 to Node.js 20.

## [2.8.1] - 2023-09-19

### Changed

- Update `@actions/core` from 1.10.0 to 1.10.1.

## [2.8.0] - 2022-11-07

### Changed

- Update `@actions/core` from 1.9.1 to 1.10.0.
- Update `@actions/github` from 5.0.3 to 5.11.

## [2.7.0] - 2022-10-03

### Changed

- Update `@actions/core` from 1.8.0 to 1.9.1.

## [2.6.0] - 2022-08-15

### Changed

- Update `@actions/core` from 1.7.0 to 1.8.0.

## [2.5.0] - 2022-08-06

### Changed

- Update `@actions/core` from 1.6.0 to 1.7.0.
- Update `@actions/github` from 5.0.0 to 5.0.3.

## [2.4.0] - 2021-12-06

### Changed

- Update `@actions/core` from 1.5.0 to 1.6.0.

## [2.3.0] - 2021-09-23

### Changed

- Update `@actions/core` from 1.4.0 to 1.5.0.

## [2.2.0] - 2021-07-06

### Changed

- Update `@actions/core` from 1.2.6 to 1.4.0.
- Update `@actions/github` from 4.0.0 to 5.0.0.

## [2.1.1] - 2021-05-09

### Security

- Security update.

## [2.1.0] - 2021-03-18

### Added

- Add `tag_name` to outputs ([#169]).

## [2.0.1] - 2020-12-09

### Changed

- Change some message colors.
- Bump `@actions/core` from 1.2.5 to 1.2.6.

## [2.0.0] - 2020-09-20

### Added

- Add new output `created` indicating whether a release was created.

## [1.1.1] - 2020-09-12

### Fixed

- Fix [#48].

## [1.1.0] - 2020-09-09

### Changed

- Set the `id` output to `-1` when no release was created.

## [1.0.0] - 2020-08-10

### Changed

- Full renewal release.

## [0.0.0] - 2020-08-09

### Added

- First release.

[Unreleased]: https://github.com/ChanTsune/release-with-commit/compare/v4.0.1...HEAD
[4.0.1]: https://github.com/ChanTsune/release-with-commit/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/ChanTsune/release-with-commit/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.8.1...v3.0.0
[2.8.1]: https://github.com/ChanTsune/release-with-commit/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.5.0...v2.6.0
[2.5.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.1.1...v2.2.0
[2.1.1]: https://github.com/ChanTsune/release-with-commit/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/ChanTsune/release-with-commit/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/ChanTsune/release-with-commit/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/ChanTsune/release-with-commit/compare/v1.1.1...v2.0.0
[1.1.1]: https://github.com/ChanTsune/release-with-commit/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/ChanTsune/release-with-commit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ChanTsune/release-with-commit/compare/v0.0.0...v1.0.0
[0.0.0]: https://github.com/ChanTsune/release-with-commit/releases/tag/v0.0.0
[#169]: https://github.com/ChanTsune/release-with-commit/pull/169
[#48]: https://github.com/ChanTsune/release-with-commit/issues/48
