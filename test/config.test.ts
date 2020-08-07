import { Config } from "../src/config";

describe('Config', () => {
  let cnf: any = {
    commitMessageRegExp: 'Release ((\\d+[.]?){1,2}\\d)\n\n((\\s|\\S)+)',
    releaseTitleTemplate: 'version {1}',
    releaseTagTemplate: 'v{1}',
    releaseBodyTemplate: '{3}',
  }

  test('Config.exec', async (done) => {
    const config = Config.parse(cnf);
    const releaseInfo = config.exec('Release 1.1.1\n\n- Add\n - function');
    if (!releaseInfo) done();
    if (releaseInfo) {
      expect(releaseInfo.name).toBe("version 1.1.1");
      expect(releaseInfo.tag_name).toBe("v1.1.1");
      expect(releaseInfo.body).toBe("- Add\n - function");
    }
    done();
  });
});
