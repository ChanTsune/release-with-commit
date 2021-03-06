
describe("Regex Example", () => {

    const regexpString = "Release v((\\d+([.]\\d+)*)-(alpha|beta|rc)\\d*)((\\s|\\S)*)"

    test(regexpString, async (done) => {
        class Param {
            constructor(
                public message: string,
                public $1: string
            ){}
        }
        const params = [
            new Param("Release v0.0.3-alpha Change to main branch", "0.0.3-alpha"),
            new Param("Release v0.0.3-alpha1 Change to main branch", "0.0.3-alpha1"),
            new Param("Release v0.0.3-rc2 Change to main branch", "0.0.3-rc2"),
        ];
        const regexp = new RegExp(regexpString, "us");
        for (const p of params) {
            if (p.message.replace(regexp, "$1") !== p.$1) {
                done.fail(p.message);
                break
            }
        }
        done();
    });
});
