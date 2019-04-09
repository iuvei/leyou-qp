"use strict";
cc._RF.push(module, 'a72bdeeZb1Dvq/oXNZxwibM', 'WaitingConnection');
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