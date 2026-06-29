export class ReleaseInfo {
  constructor(
    public name: string | undefined,
    public tag_name: string,
    public body: string | undefined,
    public draft: boolean,
    public prerelease: boolean,
    public generate_release_notes: boolean,
  ) {}
}
