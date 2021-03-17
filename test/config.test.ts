import { Config, ConfigParam } from "../src/config";

describe("Config", () => {
  const baseConfig: ConfigParam = {
    regexp: "Release (\\d+([.]\\d+)*)\n*((\\s|\\S)+)",
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

  test("Config.exec.with.body", async (done) => {
    let cnf = baseConfig;
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
  test("Config.exec.with.body_path", async (done) => {
    let cnf = baseConfig;
    cnf.body_path = "test/fixtures/release_body.md";
    const config = Config.parse(cnf);
    const releaseInfo = config.exec("Release 1.1.1\n\n- Add\n - function");
    if (!releaseInfo) done();
    if (releaseInfo) {
      expect(releaseInfo.body).toBe("# Release Test md\r\n\r\n- Test markdown.\r\n");
    }
    done();
  });
});
