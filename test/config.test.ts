import { Config, PushHook } from "../src/config";

describe("Config", () => {
  let config: any;

  test("Config.parse", async (done) => {
    const parsedConfig = Config.parse(config);
    done(expect(parsedConfig.pushHook));
  });
  test("PushHook.parse", async (done) => {
    const pushHook = PushHook.parse(config.pushHook);
    done(expect(pushHook.releaseBodyTemplate).toBe("{3}"));
  });
  test("PushHook.exec", async (done) => {
    const pushHook = PushHook.parse(config.pushHook);
    const result = pushHook.exec("Release 1.1.1\n\n- Add\n - function");
    done(expect(result).toBeTruthy());
  });
  test("PushHook.exec", async (done) => {
    const pushHook = PushHook.parse(config.pushHook);
    const result = pushHook.exec("Release 1.1.1\n\n- Add\n - function");
    if (!result) done();
    const releaseInfo = pushHook.releaseInfo;
    if (releaseInfo) {
      expect(releaseInfo.name).toBe("Release version 1.1.1");
      expect(releaseInfo.tag_name).toBe("v1.1.1");
      expect(releaseInfo.body).toBe("- Add\n - function");
    }
    done();
  });
});
