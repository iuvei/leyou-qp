"use strict";
cc._RF.push(module, 'f9be6OCtzFFjb+Jw0VMXcmZ', 'SelectNN');
// scripts/components/SelectNN.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {},
    start: function start() {},


    onCloseClicked: function onCloseClicked(target) {
        cc.log("selectNN");
        //this.node.active = false;
        this.node.getComponent(cc.Animation).play("topTobottom");
    }
    // update (dt) {},
});

cc._RF.pop();