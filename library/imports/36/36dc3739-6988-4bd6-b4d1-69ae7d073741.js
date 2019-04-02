"use strict";
cc._RF.push(module, '36dc3c5aYhL1rTRaa59BzdB', 'Gerenzhongxin');
// scripts/components/Gerenzhongxin.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onFsfkClicked: function onFsfkClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    onZhglClicked: function onZhglClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("帐号关联");
        //TODO
    },
    onLszjClicked: function onLszjClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("历史战绩");
        //TODO
    },
    onZjtjClicked: function onZjtjClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩统计");
        //TODO
    },
    onSmrzClicked: function onSmrzClicked(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("实名认证");
        //TODO
    }
});

cc._RF.pop();