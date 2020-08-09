# auto-release

## Configuration

```yml
name: "Auto Release"

on:
  push:
    branches:
      - 'master'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: ChanTsune/auto-release@master
        with:
          commit_message_regexp: "Release ((\\d+[.]?){1,2}\\d)\n\n((\\s|\\S)+)"
          release_title_template: "version {1}"
          release_tag_template: "v{1}"
          release_body_template: "{3}"
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: '${{secrets.GITHUB_TOKEN}}'
```

## Setup

```sh
# Install dependencies
npm install

# Build and package
npm run build && npm run package
```

## Tests

```sh
npm run test
```

## Contributing

If you have suggestions for how auto-release could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2020 ChanTsune
