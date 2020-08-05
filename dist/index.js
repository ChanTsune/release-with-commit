var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("releaseInfo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReleaseInfo = void 0;
    var ReleaseInfo = (function () {
        function ReleaseInfo(name, tag_name, body, draft, prerelease) {
            this.name = name;
            this.tag_name = tag_name;
            this.body = body;
            this.draft = draft;
            this.prerelease = prerelease;
        }
        return ReleaseInfo;
    }());
    exports.ReleaseInfo = ReleaseInfo;
});
define("config", ["require", "exports", "releaseInfo"], function (require, exports, releaseInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Config = exports.PushHook = void 0;
    var arrayLast = function (array) { return array[array.length - 1]; };
    var renderTemplate = function (r, text) {
        return arrayLast(r.map(function (v, i) {
            text = text.replace("{" + i + "}", v);
            return text;
        }));
    };
    var PushHook = (function () {
        function PushHook(commitMessageRegExp, releaseTitleTemplate, releaseTagTemplate, releaseBodyTemplate) {
            this.commitMessageRegExp = commitMessageRegExp;
            this.releaseTitleTemplate = releaseTitleTemplate;
            this.releaseTagTemplate = releaseTagTemplate;
            this.releaseBodyTemplate = releaseBodyTemplate;
            this.matchResult = null;
        }
        PushHook.prototype.exec = function (commitMessage) {
            this.matchResult = this.commitMessageRegExp.exec(commitMessage);
            return !!this.matchResult;
        };
        Object.defineProperty(PushHook.prototype, "releaseInfo", {
            get: function () {
                var r = this.matchResult;
                if (r) {
                    return new releaseInfo_1.ReleaseInfo(renderTemplate(r, this.releaseTitleTemplate), renderTemplate(r, this.releaseTagTemplate), renderTemplate(r, this.releaseBodyTemplate), false, false);
                }
                return null;
            },
            enumerable: false,
            configurable: true
        });
        PushHook.parse = function (hook) {
            return new PushHook(new RegExp(hook.commitMessageRegExp, "us"), hook.releaseTitleTemplate, hook.releaseTagTemplate, hook.releaseBodyTemplate);
        };
        return PushHook;
    }());
    exports.PushHook = PushHook;
    var Config = (function () {
        function Config(pushHook) {
            this.pushHook = pushHook;
        }
        Config.prototype.exec = function (commitMessage) {
            var result = this.pushHook.exec(commitMessage);
            if (result) {
                return this.pushHook.releaseInfo;
            }
            return null;
        };
        Config.parse = function (config) {
            switch (config.version) {
                default:
                    return Config.parseVersion0(config);
            }
        };
        Config.parseVersion0 = function (config) {
            var pushHook = PushHook.parse(config);
            return new Config(pushHook);
        };
        return Config;
    }());
    exports.Config = Config;
});
define("index", ["require", "exports", "config", "@actions/core", "@actions/github"], function (require, exports, config_1, core_1, github_1) {
    "use strict";
    return function () { return __awaiter(void 0, void 0, void 0, function () {
        var env, github, _a, owner, repo, commits, headCommit, parsedConfig, releaseInfo, commitish;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    env = process.env;
                    github = new github_1.GitHub(env.GITHUB_TOKEN);
                    _a = github_1.context.repo, owner = _a.owner, repo = _a.repo;
                    commits = github_1.context.payload.commits;
                    if (commits.length === 0) {
                        console.log('No commits detected!');
                        return [2];
                    }
                    headCommit = commits[0];
                    parsedConfig = config_1.Config.parse({
                        pushHook: {
                            commitMessageRegExp: core_1.getInput('commit_message_regexp'),
                            releaseTitleTemplate: core_1.getInput('release_title_template'),
                            releaseTagTemplate: core_1.getInput('release_tag_template'),
                            releaseBodyTemplate: core_1.getInput('release_body_template'),
                        }
                    });
                    if (!parsedConfig) {
                        return [2];
                    }
                    releaseInfo = parsedConfig.exec(headCommit.message);
                    if (!releaseInfo) {
                        console.log('Commit message does not matched.');
                        return [2];
                    }
                    commitish = github_1.context.sha;
                    return [4, github.repos.createRelease({
                            owner: owner,
                            repo: repo,
                            tag_name: releaseInfo.tag_name,
                            name: releaseInfo.name,
                            body: releaseInfo.body,
                            draft: releaseInfo.draft,
                            prerelease: releaseInfo.prerelease,
                            target_commitish: commitish
                        })];
                case 1:
                    _b.sent();
                    console.log(github_1.context);
                    return [2];
            }
        });
    }); };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVsZWFzZUluZm8udHMiLCIuLi9zcmMvY29uZmlnLnRzIiwiLi4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQTtRQUNFLHFCQUNXLElBQVksRUFDWixRQUFnQixFQUNoQixJQUFZLEVBQ1osS0FBYyxFQUNkLFVBQW1CO1lBSm5CLFNBQUksR0FBSixJQUFJLENBQVE7WUFDWixhQUFRLEdBQVIsUUFBUSxDQUFRO1lBQ2hCLFNBQUksR0FBSixJQUFJLENBQVE7WUFDWixVQUFLLEdBQUwsS0FBSyxDQUFTO1lBQ2QsZUFBVSxHQUFWLFVBQVUsQ0FBUztRQUMzQixDQUFDO1FBQ04sa0JBQUM7SUFBRCxDQUFDLEFBUkQsSUFRQztJQVJZLGtDQUFXOzs7Ozs7SUNFeEIsSUFBTSxTQUFTLEdBQUcsVUFBQyxLQUFtQixJQUFLLE9BQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQXZCLENBQXVCLENBQUE7SUFFbEUsSUFBTSxjQUFjLEdBQUcsVUFBQyxDQUFpQixFQUFFLElBQVc7UUFDdEQsT0FBQSxTQUFTLENBQ1AsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1lBQ1QsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBSSxDQUFDLE1BQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtZQUNoQyxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUMsQ0FBQyxDQUNIO0lBTEQsQ0FLQyxDQUFBO0lBRUQ7UUFFRSxrQkFDVyxtQkFBMkIsRUFDM0Isb0JBQTRCLEVBQzVCLGtCQUEwQixFQUMxQixtQkFBMkI7WUFIM0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFRO1lBQzNCLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBUTtZQUM1Qix1QkFBa0IsR0FB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LENBQUMsdUJBQXVCLENBQUM7NEJBQ3RELG9CQUFvQixFQUFFLGVBQVEsQ0FBQyx3QkFBd0IsQ0FBQzs0QkFDeEQsa0JBQWtCLEVBQUUsZUFBUSxDQUFDLHNCQUFzQixDQUFDOzRCQUNwRCxtQkFBbUIsRUFBRSxlQUFRLENBQUMsdUJBQXVCLENBQUM7eUJBQ3ZEO3FCQUNGLENBQUMsQ0FBQTtvQkFDRixJQUFJLENBQUMsWUFBWSxFQUFFO3dCQUNqQixXQUFNO3FCQUNQO29CQUNLLFdBQVcsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtvQkFDekQsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO3dCQUMvQyxXQUFNO3FCQUNQO29CQUVLLFNBQVMsR0FBRyxnQkFBTyxDQUFDLEdBQUcsQ0FBQTtvQkFDN0IsV0FBTSxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQzs0QkFDL0IsS0FBSyxPQUFBOzRCQUNMLElBQUksTUFBQTs0QkFDSixRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVE7NEJBQzlCLElBQUksRUFBRSxXQUFXLENBQUMsSUFBSTs0QkFDdEIsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJOzRCQUN0QixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7NEJBQ3hCLFVBQVUsRUFBRSxXQUFXLENBQUMsVUFBVTs0QkFDbEMsZ0JBQWdCLEVBQUUsU0FBUzt5QkFDNUIsQ0FBQyxFQUFBOztvQkFURixTQVNFLENBQUE7b0JBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBTyxDQUFDLENBQUE7Ozs7U0FDckIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBSZWxlYXNlSW5mbyB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIG5hbWU6IHN0cmluZyxcbiAgICAgIHB1YmxpYyB0YWdfbmFtZTogc3RyaW5nLFxuICAgICAgcHVibGljIGJvZHk6IHN0cmluZyxcbiAgICAgIHB1YmxpYyBkcmFmdDogYm9vbGVhbixcbiAgICAgIHB1YmxpYyBwcmVyZWxlYXNlOiBib29sZWFuLFxuICApIHt9XG59XG4iLCJpbXBvcnQgeyBSZWxlYXNlSW5mbyB9IGZyb20gJy4vcmVsZWFzZUluZm8nXG5cbmNvbnN0IGFycmF5TGFzdCA9IChhcnJheTpBcnJheTxzdHJpbmc+KSA9PiBhcnJheVthcnJheS5sZW5ndGggLSAxXVxuXG5jb25zdCByZW5kZXJUZW1wbGF0ZSA9IChyOlJlZ0V4cEV4ZWNBcnJheSwgdGV4dDpzdHJpbmcpID0+IFxuYXJyYXlMYXN0KFxuICByLm1hcCgodiwgaSkgPT4ge1xuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoYHske2l9fWAsIHYpXG4gICAgcmV0dXJuIHRleHRcbiAgfSlcbilcblxuZXhwb3J0IGNsYXNzIFB1c2hIb29rIHtcbiAgcHJpdmF0ZSBtYXRjaFJlc3VsdDogUmVnRXhwRXhlY0FycmF5fG51bGwgPSBudWxsXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbW1pdE1lc3NhZ2VSZWdFeHA6IFJlZ0V4cCxcbiAgICAgIHB1YmxpYyByZWxlYXNlVGl0bGVUZW1wbGF0ZTogc3RyaW5nLFxuICAgICAgcHVibGljIHJlbGVhc2VUYWdUZW1wbGF0ZTogc3RyaW5nLFxuICAgICAgcHVibGljIHJlbGVhc2VCb2R5VGVtcGxhdGU6IHN0cmluZyxcbiAgKSB7fVxuICBleGVjKGNvbW1pdE1lc3NhZ2U6IHN0cmluZyk6XG4gICAgICBib29sZWFue3RoaXMubWF0Y2hSZXN1bHQgPSB0aGlzLmNvbW1pdE1lc3NhZ2VSZWdFeHAuZXhlYyhjb21taXRNZXNzYWdlKVxuICAgIHJldHVybiAhIXRoaXMubWF0Y2hSZXN1bHRcbiAgfVxuICBnZXQgcmVsZWFzZUluZm8oKTogUmVsZWFzZUluZm98bnVsbHtcbiAgICBjb25zdCByID0gdGhpcy5tYXRjaFJlc3VsdFxuICAgIGlmIChyKSB7XG4gICAgICByZXR1cm4gbmV3IFJlbGVhc2VJbmZvKFxuICAgICAgICByZW5kZXJUZW1wbGF0ZShyLCB0aGlzLnJlbGVhc2VUaXRsZVRlbXBsYXRlKSxcbiAgICAgICAgcmVuZGVyVGVtcGxhdGUociwgdGhpcy5yZWxlYXNlVGFnVGVtcGxhdGUpLFxuICAgICAgICByZW5kZXJUZW1wbGF0ZShyLCB0aGlzLnJlbGVhc2VCb2R5VGVtcGxhdGUpLFxuICAgICAgICBmYWxzZSxcbiAgICAgICAgZmFsc2UsXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgc3RhdGljIHBhcnNlKGhvb2s6IGFueSk6IFB1c2hIb29rIHtcbiAgICByZXR1cm4gbmV3IFB1c2hIb29rKFxuICAgICAgbmV3IFJlZ0V4cChob29rLmNvbW1pdE1lc3NhZ2VSZWdFeHAsIFwidXNcIiksXG4gICAgICBob29rLnJlbGVhc2VUaXRsZVRlbXBsYXRlLFxuICAgICAgaG9vay5yZWxlYXNlVGFnVGVtcGxhdGUsXG4gICAgICBob29rLnJlbGVhc2VCb2R5VGVtcGxhdGUsXG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb25maWcge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcHVzaEhvb2s6IFB1c2hIb29rXG4gICkge31cbiAgZXhlYyhjb21taXRNZXNzYWdlOnN0cmluZyk6UmVsZWFzZUluZm98bnVsbCB7XG4gICAgbGV0IHJlc3VsdCA9IHRoaXMucHVzaEhvb2suZXhlYyhjb21taXRNZXNzYWdlKVxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1c2hIb29rLnJlbGVhc2VJbmZvXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgc3RhdGljIHBhcnNlKGNvbmZpZzogYW55KTogQ29uZmlnIHtcbiAgICAgIHN3aXRjaCAoY29uZmlnLnZlcnNpb24pIHtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5wYXJzZVZlcnNpb24wKGNvbmZpZylcbiAgICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHBhcnNlVmVyc2lvbjAoY29uZmlnOiBhbnkpOiBDb25maWcge1xuICAgIGNvbnN0IHB1c2hIb29rID0gUHVzaEhvb2sucGFyc2UoY29uZmlnKVxuICAgIHJldHVybiBuZXcgQ29uZmlnKHB1c2hIb29rKVxuICB9XG5cbn0iLCJpbXBvcnQgeyBDb25maWcgfSBmcm9tICcuL2NvbmZpZydcbmltcG9ydCB7IGdldElucHV0IH0gZnJvbSAnQGFjdGlvbnMvY29yZSdcbmltcG9ydCB7IGNvbnRleHQsIEdpdEh1YiB9IGZyb20gJ0BhY3Rpb25zL2dpdGh1YidcblxuZXhwb3J0ID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBlbnYgPSBwcm9jZXNzLmVudiBhcyBhbnlcbiAgY29uc3QgZ2l0aHViID0gbmV3IEdpdEh1YihlbnYuR0lUSFVCX1RPS0VOKVxuICBjb25zdCB7b3duZXIsIHJlcG99ID0gY29udGV4dC5yZXBvXG4gIGNvbnN0IGNvbW1pdHMgPSBjb250ZXh0LnBheWxvYWQuY29tbWl0c1xuICBpZiAoY29tbWl0cy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zb2xlLmxvZygnTm8gY29tbWl0cyBkZXRlY3RlZCEnKVxuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGhlYWRDb21taXQgPSBjb21taXRzWzBdO1xuXG4gIGNvbnN0IHBhcnNlZENvbmZpZyA9IENvbmZpZy5wYXJzZSh7XG4gICAgcHVzaEhvb2s6IHtcbiAgICAgIGNvbW1pdE1lc3NhZ2VSZWdFeHA6IGdldElucHV0KCdjb21taXRfbWVzc2FnZV9yZWdleHAnKSxcbiAgICAgIHJlbGVhc2VUaXRsZVRlbXBsYXRlOiBnZXRJbnB1dCgncmVsZWFzZV90aXRsZV90ZW1wbGF0ZScpLFxuICAgICAgcmVsZWFzZVRhZ1RlbXBsYXRlOiBnZXRJbnB1dCgncmVsZWFzZV90YWdfdGVtcGxhdGUnKSxcbiAgICAgIHJlbGVhc2VCb2R5VGVtcGxhdGU6IGdldElucHV0KCdyZWxlYXNlX2JvZHlfdGVtcGxhdGUnKSxcbiAgICB9XG4gIH0pXG4gIGlmICghcGFyc2VkQ29uZmlnKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgY29uc3QgcmVsZWFzZUluZm8gPSBwYXJzZWRDb25maWcuZXhlYyhoZWFkQ29tbWl0Lm1lc3NhZ2UpXG4gIGlmICghcmVsZWFzZUluZm8pIHtcbiAgICBjb25zb2xlLmxvZygnQ29tbWl0IG1lc3NhZ2UgZG9lcyBub3QgbWF0Y2hlZC4nKVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgY29tbWl0aXNoID0gY29udGV4dC5zaGFcbiAgYXdhaXQgZ2l0aHViLnJlcG9zLmNyZWF0ZVJlbGVhc2Uoe1xuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gICAgdGFnX25hbWU6IHJlbGVhc2VJbmZvLnRhZ19uYW1lLFxuICAgIG5hbWU6IHJlbGVhc2VJbmZvLm5hbWUsXG4gICAgYm9keTogcmVsZWFzZUluZm8uYm9keSxcbiAgICBkcmFmdDogcmVsZWFzZUluZm8uZHJhZnQsXG4gICAgcHJlcmVsZWFzZTogcmVsZWFzZUluZm8ucHJlcmVsZWFzZSxcbiAgICB0YXJnZXRfY29tbWl0aXNoOiBjb21taXRpc2hcbiAgfSlcblxuICBjb25zb2xlLmxvZyhjb250ZXh0KVxufVxuIl19