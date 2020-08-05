"use strict";
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
var config_1 = require("./config");
var core_1 = require("@actions/core");
var github_1 = require("@actions/github");
module.exports = function () { return __awaiter(void 0, void 0, void 0, function () {
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
                    return [2 /*return*/];
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
                    return [2 /*return*/];
                }
                releaseInfo = parsedConfig.exec(headCommit.message);
                if (!releaseInfo) {
                    console.log('Commit message does not matched.');
                    return [2 /*return*/];
                }
                commitish = github_1.context.sha;
                return [4 /*yield*/, github.repos.createRelease({
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
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map