import { Config } from "./config";
import { getInput } from "@actions/core";
import { context, GitHub } from "@actions/github";

export = async () => {
  const env = process.env as any;
  const github = new GitHub(env.GITHUB_TOKEN);
  const { owner, repo } = context.repo;
  const commits = context.payload.commits;
  if (commits.length === 0) {
    console.log("No commits detected!");
    return;
  }
  const headCommit = commits[0];

  const parsedConfig = Config.parse({
    pushHook: {
      commitMessageRegExp: getInput("commit_message_regexp"),
      releaseTitleTemplate: getInput("release_title_template"),
      releaseTagTemplate: getInput("release_tag_template"),
      releaseBodyTemplate: getInput("release_body_template"),
    },
  });
  if (!parsedConfig) {
    console.log('Parse Failed.');
    return;
  }
  const releaseInfo = parsedConfig.exec(headCommit.message);
  if (!releaseInfo) {
    console.log("Commit message does not matched.");
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

  console.log(context);
};
