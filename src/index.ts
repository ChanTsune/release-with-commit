import * as core from "@actions/core";
import { getInput } from "@actions/core";
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

    const config = Config.parse({
      commitMessageRegExp: getInput("commit_message_regexp"),
      releaseTitleTemplate: getInput("release_title_template"),
      releaseTagTemplate: getInput("release_tag_template"),
      releaseBodyTemplate: getInput("release_body_template"),
      draft: getInput("draft"),
      prerelease: getInput("prerelease"),
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
    await github.repos.createRelease({
      owner,
      repo,
      tag_name: releaseInfo.tag_name,
      name: releaseInfo.name,
      body: releaseInfo.body,
      draft: releaseInfo.draft,
      prerelease: releaseInfo.prerelease,
      target_commitish: commitish,
    });

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function run(): Promise<void> {
  const env = process.env as any;
  const github = getOctokit(env.GITHUB_TOKEN);
  await main(github);
}

run();
