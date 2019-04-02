"use strict";
cc._RF.push(module, '69681YtmUFJCYNJqaYi8v2w', 'SelectZJH');
// scripts/components/SelectZJH.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // onLoad () {},

    start: function start() {},


    onCloseClicked: function onCloseClicked(target) {
        cc.log("selectZJH");
        //this.node.active = false;
        this.node.getComponent(cc.Animation).play("topTobottom");
    }
    // update (dt) {},
});

cc._RF.pop();