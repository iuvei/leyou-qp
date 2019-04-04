(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7c6aas2kcFG5KBfpRPpUiDm', 'Global', __filename);
// scripts/Global.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        window.th = window.th || {};

        var AudioManager = require("AudioManager");
        th.audioManager = new AudioManager();
        th.audioManager.init();

        th.audioManager.playBGM("bg_hall.mp3");

        var _node$getContentSize = this.node.getContentSize(),
            width = _node$getContentSize.width,
            height = _node$getContentSize.height;

        cc.log("\u53EF\u89C6\u7A97\u53E3 width: " + width + " , height: " + height);
        th.width = width;
        th.height = height;
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
        //# sourceMappingURL=Global.js.map
        