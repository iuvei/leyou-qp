(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/SelectNN.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f9be6OCtzFFjb+Jw0VMXcmZ', 'SelectNN', __filename);
// scripts/components/SelectNN.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onCloseClicked: function onCloseClicked(target) {
        th.audioManager.playSFX("click.mp3");
        this.node.runAction(cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()));
    },
    onGameChecked: function onGameChecked(trage, type) {
        cc.log("牛牛选择类别:", type);
        //TODO
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "jdnn":
                break;
            case "12nn":
                break;
            case "13nn":
                break;
            case "lznn":
                break;
            case "mpmm":
                break;
            case "nsz":
                break;
            case "dcxnn":
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
        //# sourceMappingURL=SelectNN.js.map
        