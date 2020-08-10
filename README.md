# GitHub Action - Release-with-commit

This GitHub Action (written in TypeScript) wraps the [GitHub Release API](https://developer.github.com/v3/repos/releases/), specifically the [Create a Release](https://developer.github.com/v3/repos/releases/#create-a-release) endpoint, to allow you to leverage GitHub Actions to create releases.

## Usage

### Pre-requisites

Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---release-with-commit) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs

For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#input)

- `regexp`: The pattern of commit message. Create a release if commit message match this.
- `regexp_options`: The option of `regexp`. for more details, see [Advanced Searching With Flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_Searching_With_Flags)
- `tag_name`: The name of the tag for this release.
- `release_name`: The name of the release.
- `body`: Text describing the contents of the release. Optional, and not needed if using `body_path`.
- `body_path`: A file with contents describing the release. Optional, and not needed if using `body`.
- `draft`: `true` to create a draft (unpublished) release, `false` to create a published one. Default: `false`
- `prerelease`: `true` to identify the release as a prerelease. `false` to identify the release as a full release. Default `false`

### Outputs

For more information on these outputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#response-4) for an example of what these outputs look like

- `id`: The release ID
- `html_url`: The URL users can navigate to in order to view the release. i.e. `https://github.com/octocat/Hello-World/releases/v1.0.0`
- `upload_url`: The URL for uploading assets to the release, which could be used by GitHub Actions for additional uses, for example the [`@actions/upload-release-asset`](https://www.github.com/actions/upload-release-asset) GitHub Action

### Example workflow - release with commit

On every `push` to a commit message matching the `regex`, [create a release](https://developer.github.com/v3/repos/releases/#create-a-release):

```yaml
name: Release with commit

on:
  push:
    branches:
      - master
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: ChanTsune/release-with-commit@v1.0.0
        with:
          regexp: "Release ((\\d+[.]?){1,2}\\d)\n\n((\\s|\\S)+)"
          regexp_options: "us"
          title: "version $1"
          tag: "v$1"
          body: "$3"
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: '${{secrets.GITHUB_TOKEN}}' # This token is provided by Actions, you do not need to create your own token
```

This will create a [Release](https://help.github.com/en/articles/creating-releases), as well as a [`release` event](https://developer.github.com/v3/activity/events/types/#releaseevent), which could be handled by a third party service, or by GitHub Actions for additional uses, for example the [`@actions/upload-release-asset`](https://www.github.com/actions/upload-release-asset) GitHub Action. This uses the `GITHUB_TOKEN` provided by the [virtual environment](https://help.github.com/en/github/automating-your-workflow-with-github-actions/virtual-environments-for-github-actions#github_token-secret), so no new token is needed.

## Contributing

We would love you to contribute to `@actions/create-release`, pull requests are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
