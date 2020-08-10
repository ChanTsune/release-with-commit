import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Config } from "./config";

export async function main(github: ReturnType<typeof getOctokit>) {
  try {
    const { owner, repo } = context.repo;
    const commits = context.payload.commits;
    if (commits.length === 0) {
      core.info("No commits detected!");
      return;
    }
    const headCommit = commits[0];
    console.log(JSON.stringify(headCommit));
    console.log(headCommit.message);

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const config = Config.parse({
      regexp: core.getInput("regexp", { required: true }),
      regexp_options: core.getInput("regexp_options", { required: false }),
      release_name: core.getInput("release_name", { required: false }),
      tag_name: core.getInput("tag_name", { required: false }),
      body: core.getInput("body", { required: false }),
      body_path: core.getInput("body_path", { required: false }),
      draft: core.getInput("draft", { required: false }),
      prerelease: core.getInput("prerelease", { required: false }),
      commitish: core.getInput("commitish", { required: false }),
      repo: repo,
      owner: owner,
    });
    if (!config) {
      core.info("Parse Failed.");
      return;
    }
    const releaseInfo = config.exec(headCommit.message);
    if (!releaseInfo) {
      core.info("Commit message does not matched.");
      return;
    }

    const commitish = context.sha;
    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    const createReleaseResponse = await github.repos.createRelease({
      owner,
      repo,
      tag_name: releaseInfo.tag_name,
      name: releaseInfo.name,
      body: releaseInfo.body,
      draft: releaseInfo.draft,
      prerelease: releaseInfo.prerelease,
      target_commitish: commitish,
    });
    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl },
    } = createReleaseResponse;

    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput("id", releaseId);
    core.setOutput("html_url", htmlUrl);
    core.setOutput("upload_url", uploadUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function run(): Promise<void> {
  const env = process.env as any;
  // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
  const github = getOctokit(env.GITHUB_TOKEN);
  await main(github);
}

run();
