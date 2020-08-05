import { ReleaseInfo } from './releaseInfo';
export declare class PushHook {
    commitMessageRegExp: RegExp;
    releaseTitleTemplate: string;
    releaseTagTemplate: string;
    releaseBodyTemplate: string;
    private matchResult;
    constructor(commitMessageRegExp: RegExp, releaseTitleTemplate: string, releaseTagTemplate: string, releaseBodyTemplate: string);
    exec(commitMessage: string): boolean;
    get releaseInfo(): ReleaseInfo | null;
    static parse(hook: any): PushHook;
}
export declare class Config {
    pushHook: PushHook;
    constructor(pushHook: PushHook);
    exec(commitMessage: string): ReleaseInfo | null;
    static parse(config: any): Config;
    private static parseVersion0;
}
