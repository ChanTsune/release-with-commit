export class ReleaseInfo {
  constructor(
    public name: string,
    public tag_name: string,
    public body: string,
    public draft: boolean,
    public prerelease: boolean
  ) {}
}
