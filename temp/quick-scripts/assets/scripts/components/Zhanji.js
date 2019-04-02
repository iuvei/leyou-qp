(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Zhanji.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e12c4RB1GBDZoKMb7DwPJUA', 'Zhanji', __filename);
// scripts/components/Zhanji.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onTypeClicked: function onTypeClicked(target, type) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩类别选择:", type);
        //TODO
        switch (type) {
            case "join":
                break;
            case "create":
                break;
        }
    },
    onGameClicked: function onGameClicked(traget, type) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩游戏选择:", type);
        //TODO
        switch (type) {
            case "nn":
                break;
            case "zjh":
                break;
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Zhanji.js.map
        