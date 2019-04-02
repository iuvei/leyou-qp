"use strict";
cc._RF.push(module, 'f9be6OCtzFFjb+Jw0VMXcmZ', 'SelectNN');
// scripts/components/SelectNN.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onCloseClicked: function onCloseClicked(target) {
        th.audioManager.playSFX("click.mp3");
        this.node.runAction(cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()));
    },
    onGameChecked: function onGameChecked(trage, type) {
        cc.log("牛牛选择类别:", type);
        //TODO
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "jdnn":
                break;
            case "12nn":
                break;
            case "13nn":
                break;
            case "lznn":
                break;
            case "mpmm":
                break;
            case "nsz":
                break;
            case "dcxnn":
                break;
        }
    }
});

cc._RF.pop();