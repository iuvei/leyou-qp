(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/JoinOrLook.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd872ee2ZINNjY/rcTOfi+fr', 'JoinOrLook', __filename);
// scripts/components/JoinOrLook.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

cc.Class(_defineProperty({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },
    start: function start() {
        this.node.active = false;
    },
    show: function show(type) {
        cc.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },

    onJoinClicked: function onJoinClicked(traget) {
        cc.log("onJoinClicked");
    },
    onLookClicked: function onLookClicked(traget) {
        cc.log("onLookClicked");
    }
}, "start", function start() {}));

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
        //# sourceMappingURL=JoinOrLook.js.map
        