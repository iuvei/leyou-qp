(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/WaitingConnection.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a72bdeeZb1Dvq/oXNZxwibM', 'WaitingConnection', __filename);
// scripts/components/WaitingConnection.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        lblContent: cc.Label
    },

    onLoad: function onLoad() {
        if (th == null) {
            return null;
        }
        th.wc = this;
        this.node.active = false;
    },
    start: function start() {},
    update: function update(dt) {
        this.target.rotation = this.target.rotation + dt * 90 * 2;
    },
    show: function show(content) {
        if (this.node) {
            this.node.x = 0;
            this.node.y = 0;
            this.node.active = true;
        }
        if (this.lblContent) {
            this.lblContent.string = content || "";
        }
    },
    hide: function hide() {
        if (this.node) {
            this.node.active = false;
        }
    },


    onDestory: function onDestory() {
        if (th) {
            th.wc = null;
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
        //# sourceMappingURL=WaitingConnection.js.map
        