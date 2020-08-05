"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.PushHook = void 0;
var releaseInfo_1 = require("./releaseInfo");
var arrayLast = function (array) { return array[array.length - 1]; };
var renderTemplate = function (r, text) {
    return arrayLast(r.map(function (v, i) {
        text = text.replace("{" + i + "}", v);
        return text;
    }));
};
var PushHook = /** @class */ (function () {
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
var Config = /** @class */ (function () {
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
//# sourceMappingURL=config.js.map