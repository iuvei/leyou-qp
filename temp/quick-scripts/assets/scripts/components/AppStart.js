(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/AppStart.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'AppStart', __filename);
// scripts/components/AppStart.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lblLoadingMsg: cc.Label
    },

    onLoad: function onLoad() {},
    start: function start() {
        //th.webSocketManager.connectServer({ ip: "118.31.10.116", port: 10000 });
    },
    update: function update(dt) {}
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
        //# sourceMappingURL=AppStart.js.map
        