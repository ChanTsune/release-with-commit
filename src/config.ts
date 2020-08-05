import { ReleaseInfo } from './releaseInfo'

const arrayLast = (array:Array<string>) => array[array.length - 1]

const renderTemplate = (r:RegExpExecArray, text:string) => 
arrayLast(
  r.map((v, i) => {
    text = text.replace(`{${i}}`, v)
    return text
  })
)

export class PushHook {
  private matchResult: RegExpExecArray|null = null
  constructor(
      public commitMessageRegExp: RegExp,
      public releaseTitleTemplate: string,
      public releaseTagTemplate: string,
      public releaseBodyTemplate: string,
  ) {}
  exec(commitMessage: string):
      boolean{this.matchResult = this.commitMessageRegExp.exec(commitMessage)
    return !!this.matchResult
  }
  get releaseInfo(): ReleaseInfo|null{
    const r = this.matchResult
    if (r) {
      return new ReleaseInfo(
        renderTemplate(r, this.releaseTitleTemplate),
        renderTemplate(r, this.releaseTagTemplate),
        renderTemplate(r, this.releaseBodyTemplate),
        false,
        false,
      )
    }
    return null
  }
  static parse(hook: any): PushHook {
    return new PushHook(
      new RegExp(hook.commitMessageRegExp, "us"),
      hook.releaseTitleTemplate,
      hook.releaseTagTemplate,
      hook.releaseBodyTemplate,
    )
  }
}

export class Config {
  constructor(
    public pushHook: PushHook
  ) {}
  exec(commitMessage:string):ReleaseInfo|null {
    let result = this.pushHook.exec(commitMessage)
    if (result) {
      return this.pushHook.releaseInfo
    }
    return null
  }
  static parse(config: any): Config {
      switch (config.version) {
          default:
            return Config.parseVersion0(config)
      }
  }

  private static parseVersion0(config: any): Config {
    const pushHook = PushHook.parse(config)
    return new Config(pushHook)
  }

}