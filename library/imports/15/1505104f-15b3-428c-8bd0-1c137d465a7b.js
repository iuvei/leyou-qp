"use strict";
cc._RF.push(module, '15051BPFbNCjIvQHBN9Rlp7', 'Message');
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
            this.node.runAction(cc.sequence(cc.fadeIn(0), cc.moveTo(1, cc.v2(0, 200)), cc.fadeOut(0), cc.callFunc(function (target) {
                return target.y = 0;
            })));
        }
    },

    onDestory: function onDestory() {
        if (th) {
            th.alert = null;
        }
    }
});

cc._RF.pop();