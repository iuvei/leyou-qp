(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Gerenzhongxin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '36dc3c5aYhL1rTRaa59BzdB', 'Gerenzhongxin', __filename);
// scripts/components/Gerenzhongxin.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onFsfkClicked: function onFsfkClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    onZhglClicked: function onZhglClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("帐号关联");
        //TODO
    },
    onLszjClicked: function onLszjClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("历史战绩");
        //TODO
    },
    onZjtjClicked: function onZjtjClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩统计");
        //TODO
    },
    onSmrzClicked: function onSmrzClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("实名认证");
        //TODO
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
        //# sourceMappingURL=Gerenzhongxin.js.map
        