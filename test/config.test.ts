import { Config, ConfigParams } from "../src/config";

describe("Config", () => {
  const cnf: ConfigParams = {
    regexp: "Release ((\\d+[.]?){1,2}\\d)\n\n((\\s|\\S)+)",
    regexp_options: "us",
    release_name: "version $1",
    tag_name: "v$1",
    body: "$3",
    body_path: "",
    draft: "false",
    prerelease: "false",
    commitish: "master",
    repo: "release-with-commit",
    owner: "me",
  };

  test("Config.exec", async (done) => {
    const config = Config.parse(cnf);
    const releaseInfo = config.exec("Release 1.1.1\n\n- Add\n - function");
    if (!releaseInfo) done();
    if (releaseInfo) {
      expect(releaseInfo.name).toBe("version 1.1.1");
      expect(releaseInfo.tag_name).toBe("v1.1.1");
      expect(releaseInfo.body).toBe("- Add\n - function");
      expect(releaseInfo.draft).toBe(false);
      expect(releaseInfo.prerelease).toBe(false);
    }
    done();
  });
});
