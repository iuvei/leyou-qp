(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Message.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '15051BPFbNCjIvQHBN9Rlp7', 'Message', __filename);
// scripts/components/Message.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        ltlMsg: cc.Label
    },

    onLoad: function onLoad() {
        cc.log("Message====>onload");
        if (th == null) {
            return null;
        }
        th.msg = this;
        this.node.active = false;
    },
    show: function show(content) {
        if (this.node) {
            this.node.active = true;
            this.ltlMsg.string = content || "";
            this.node.runAction(cc.sequence(cc.fadeIn(0), cc.moveTo(1, cc.v2(0, 150)), cc.fadeOut(0), cc.callFunc(function (target) {
                return target.y = 0;
            })));
        }
    },

    onDestory: function onDestory() {
        if (th) {
            th.msg = null;
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
        //# sourceMappingURL=Message.js.map
        