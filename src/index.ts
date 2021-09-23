import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Config } from "./config";
import { ReleaseInfo } from "./releaseInfo";

export async function main(
  github: ReturnType<typeof getOctokit>,
  config: Config,
  callback: (
    releaseId: number,
    htmlUrl: string,
    uploadUrl: string,
    created: boolean,
    releaseInfo: ReleaseInfo | null
  ) => void,
  failure: (error: any) => void
) {
  try {
    const commits = context.payload.commits;
    if (commits.length === 0) {
      core.info("No commits detected!");
      callback(-1, "", "", false, null);
      return;
    }
    const headCommit = commits[0];
    core.info(JSON.stringify(headCommit));
    core.info(headCommit.message);

    const releaseInfo = config.exec(headCommit.message);
    if (!releaseInfo) {
      core.info("Commit message does not matched.");
      callback(-1, "", "", false, null);
      return;
    }

    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    const createReleaseResponse = await github.rest.repos.createRelease({
      owner: config.owner,
      repo: config.repo,
      tag_name: releaseInfo.tag_name,
      name: releaseInfo.name,
      body: releaseInfo.body,
      draft: releaseInfo.draft,
      prerelease: releaseInfo.prerelease,
      target_commitish: config.commitish,
    });
    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl },
    } = createReleaseResponse;

    callback(releaseId, htmlUrl, uploadUrl, true, releaseInfo);
  } catch (error: any) {
    core.error(error);
    failure(error);
  }
}

async function run(): Promise<void> {
  const env = process.env as any;
  // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
  const github = getOctokit(env.GITHUB_TOKEN);

  const { owner, repo } = context.repo;

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
    commitish: core.getInput("commitish", { required: false }) || context.sha,
    repo: repo,
    owner: owner,
  });

  await main(
    github,
    config,
    (releaseId, htmlUrl, uploadUrl, created, releaseInfo) => {
      // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
      core.setOutput("id", releaseId);
      core.setOutput("html_url", htmlUrl);
      core.setOutput("upload_url", uploadUrl);
      core.setOutput("created", created);
      core.setOutput("tag_name", releaseInfo?.tag_name);
    },
    (error) => {
      core.setFailed(error);
    }
  );
}

run();
