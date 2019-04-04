"use strict";
cc._RF.push(module, '69681YtmUFJCYNJqaYi8v2w', 'SelectZJH');
// scripts/components/SelectZJH.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        createZJH: cc.Node
    },

    start: function start() {},


    onCloseClicked: function onCloseClicked(target) {
        th.audioManager.playSFX("click.mp3");
        this.node.runAction(cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()));
    },
    onCreateCloseClicked: function onCreateCloseClicked(target) {
        th.audioManager.playSFX("click.mp3");
        this.createZJH.active = false;
    },
    onGameChecked: function onGameChecked(trage, type) {
        cc.log("炸金花选择类别:", type);
        //TODO
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "jdzjh":
                break;
            case "dpzjh":
                break;
            case "xzzjh":
                break;
            case "lzzjh":
                break;
            case "hpzjh":
                break;
            case "cjzjh":
                break;
            case "mpzjh":
                break;
        }
        this.createZJH.active = true;
    }
});

cc._RF.pop();