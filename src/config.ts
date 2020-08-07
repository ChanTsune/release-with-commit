import { ReleaseInfo } from "./releaseInfo";

const arrayLast = (array: string[]) => array[array.length - 1];

const renderTemplate = (r: RegExpExecArray, text: string) =>
  arrayLast(
    r.map((v, i) => {
      text = text.replace(`{${i}}`, v);
      return text;
    })
  );

export class Config {
  constructor(
    public commitMessageRegExp: RegExp,
    public releaseTitleTemplate: string,
    public releaseTagTemplate: string,
    public releaseBodyTemplate: string,
    public draft: boolean,
    public prerelease:boolean,
  ) {}
  exec(commitMessage: string): ReleaseInfo | null {
    const r = this.commitMessageRegExp.exec(commitMessage);
    if (r) {
      return new ReleaseInfo(
          renderTemplate(r, this.releaseTitleTemplate),
          renderTemplate(r, this.releaseTagTemplate),
          renderTemplate(r, this.releaseBodyTemplate),
          this.draft,
          this.prerelease);
    }
    return null;
  }
  static parse(hook: any): Config {
    return new Config(
      new RegExp(hook.commitMessageRegExp, "us"),
      hook.releaseTitleTemplate,
      hook.releaseTagTemplate,
      hook.releaseBodyTemplate,
      hook.draft === 'true',
      hook.prerelease === 'true',
    );
  }
}
