import { ReleaseInfo } from "./releaseInfo";

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
    public commitMessageRegExp: RegExp,
    public releaseTitleTemplate: string,
    public releaseTagTemplate: string,
    public releaseBodyTemplate: string,
    public draft: boolean,
    public prerelease: boolean
  ) {}
  private render(m: string, t: string): string {
    return m.replace(this.commitMessageRegExp, t);
  }
  exec(commitMessage: string): ReleaseInfo | null {
    if (this.commitMessageRegExp.test(commitMessage)) {
      return new ReleaseInfo(
        this.render(commitMessage, this.releaseTitleTemplate),
        this.render(commitMessage, this.releaseTagTemplate),
        this.render(commitMessage, this.releaseBodyTemplate),
        this.draft,
        this.prerelease
      );
    }
    return null;
  }
  static parse(params: ConfigParams): Config {
    return new Config(
      new RegExp(params.regexp, params.regexp_options),
      params.release_name,
      params.tag_name,
      params.body,
      params.draft === "true",
      params.prerelease === "true"
    );
  }
}
