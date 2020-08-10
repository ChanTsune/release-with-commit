import { ReleaseInfo } from "./releaseInfo";
import * as fs from "fs";

interface UserConfigParams {
  regexp: string;
  regexp_options: string;
  tag_name: string;
  release_name: string;
  body: string;
  body_path: string;
  draft: string;
  prerelease: string;
  commitish: string;
}
interface ConfigExParams {
  repo: string;
  owner: string;
}

export type ConfigParams = UserConfigParams & ConfigExParams;

export class Config {
  constructor(
    public regexp: RegExp,
    public release_name: string,
    public tag_name: string,
    public body: string,
    public draft: boolean,
    public prerelease: boolean,
    public commitish: string,
    public repo: string,
    public owner: string
  ) {}
  private render(m: string, t: string): string {
    return m.replace(this.regexp, t);
  }
  exec(commitMessage: string): ReleaseInfo | null {
    if (this.regexp.test(commitMessage)) {
      return new ReleaseInfo(
        this.render(commitMessage, this.release_name) || commitMessage,
        this.render(commitMessage, this.tag_name) || commitMessage,
        this.render(commitMessage, this.body) || commitMessage,
        this.draft,
        this.prerelease
      );
    }
    return null;
  }
  static parse(params: ConfigParams): Config {
    let fileContent: string | undefined;
    if (params.body_path !== "" && !!params.body_path) {
      fileContent = fs.readFileSync(params.body_path, { encoding: "utf8" });
    }

    return new Config(
      new RegExp(params.regexp, params.regexp_options),
      params.release_name,
      params.tag_name,
      fileContent || params.body,
      params.draft === "true",
      params.prerelease === "true",
      params.commitish,
      params.repo,
      params.owner
    );
  }
}
