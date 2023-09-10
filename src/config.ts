import { ReleaseInfo } from "./releaseInfo";
import * as fs from "fs";

interface UserConfigParam {
  regexp: string;
  regexp_options: string;
  tag_name: string;
  release_name: string;
  body: string;
  body_path: string;
  draft: boolean;
  prerelease: boolean;
  commitish: string;
}
interface ConfigExParam {
  repo: string;
  owner: string;
}

export type ConfigParam = UserConfigParam & ConfigExParam;

export class Config {
  constructor(
    public regexp: RegExp,
    public release_name: string,
    public tag_name: string,
    public body: string,
    public body_path: string,
    public draft: boolean,
    public prerelease: boolean,
    public commitish: string,
    public repo: string,
    public owner: string,
  ) {}
  private render(m: string, t: string): string {
    return m.replace(this.regexp, t);
  }
  exec(commitMessage: string): ReleaseInfo | null {
    if (this.regexp.test(commitMessage)) {
      let fileContent: string | undefined;
      const path = this.render(commitMessage, this.body_path);
      if (path !== "" && !!path) {
        fileContent = fs.readFileSync(this.body_path, { encoding: "utf8" });
      }
      return new ReleaseInfo(
        this.render(commitMessage, this.release_name) || commitMessage,
        this.render(commitMessage, this.tag_name) || commitMessage,
        fileContent || this.render(commitMessage, this.body) || commitMessage,
        this.draft,
        this.prerelease,
      );
    }
    return null;
  }
  static parse(param: ConfigParam): Config {
    return new Config(
      new RegExp(param.regexp, param.regexp_options),
      param.release_name,
      param.tag_name,
      param.body,
      param.body_path,
      param.draft,
      param.prerelease,
      param.commitish,
      param.repo,
      param.owner,
    );
  }
}
