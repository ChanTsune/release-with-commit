# auto-merge-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

## Configuration

```yml
version: 0
pushHooks:
  - commitMessageRegExp: "Release ((\\d+[.]?){1,2}\\d)\n\n((\\s|\\S)+)"
    releaseTitleTemplate: "Release version {1}"
    releaseTagTemplate: "v{1}"
    releaseBodyTemplate: "{3}"
```

## Setup

```sh
# Install dependencies
npm install

# Run with hot reload
npm run build:watch

# Compile and run
npm run build
npm run start
```

## Contributing

If you have suggestions for how auto-merge-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2020 ChanTsune <yshegou@gmail.com>
