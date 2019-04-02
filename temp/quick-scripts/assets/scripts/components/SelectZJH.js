(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/SelectZJH.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69681YtmUFJCYNJqaYi8v2w', 'SelectZJH', __filename);
// scripts/components/SelectZJH.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {},


    onCloseClicked: function onCloseClicked(target) {
        th.audioManager.playSFX("click.mp3");
        this.node.runAction(cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()));
    },
    onGameChecked: function onGameChecked(trage, type) {
        cc.log("炸金花选择类别:", type);
        //TODO
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "jdzjh":
                break;
            case "dpzjh":
                break;
            case "xzzjh":
                break;
            case "lzzjh":
                break;
            case "hpzjh":
                break;
            case "cjzjh":
                break;
            case "mpzjh":
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
        //# sourceMappingURL=SelectZJH.js.map
        