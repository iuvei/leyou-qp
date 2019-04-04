"use strict";
cc._RF.push(module, '7c6aas2kcFG5KBfpRPpUiDm', 'Global');
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