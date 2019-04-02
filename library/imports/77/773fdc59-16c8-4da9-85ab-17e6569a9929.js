"use strict";
cc._RF.push(module, '773fdxZFshNqYWrF+ZWmpkp', 'Hall');
// scripts/components/Hall.js

"use strict";

function initManager() {
    window.th = window.th || {};

    var AudioManager = require("AudioManager");
    th.audioManager = new AudioManager();
    th.audioManager.init();
}

cc.Class({
    extends: cc.Component,

    properties: {
        dating: cc.Node,
        yuleting: cc.Node,
        zhanji: cc.Node,
        gerenzhongxin: cc.Node,
        selectNN: cc.Node,
        selectZJH: cc.Node
    },

    onLoad: function onLoad() {
        initManager();
        cc.log("================>>initManager<<=====================");
    },

    update: function update(dt) {},

    //防作弊
    onFzbChecked: function onFzbChecked(trager) {
        th.audioManager.playSFX("click.mp3");
    },
    //发送房卡
    onSendFangKaChecked: function onSendFangKaChecked(trager) {
        th.audioManager.playSFX("click.mp3");
    },
    //wechat
    onWechatChecked: function onWechatChecked(trager) {
        th.audioManager.playSFX("click.mp3");
    },
    //开关声音
    onVoiceChecked: function onVoiceChecked(trager) {
        cc.log(trager.isChecked);
        th.audioManager.playSFX("click.mp3");
    },
    //复制ID
    onCopyIdChecked: function onCopyIdChecked(trager) {
        th.audioManager.playSFX("click.mp3");
    },

    //大厅dock按钮点击事件
    onDockChecked: function onDockChecked(traget, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "dating":
                this.dating.active = true;
                this.yuleting.active = false;
                this.zhanji.active = false;
                this.gerenzhongxin.active = false;
                break;
            case "yuleting":
                this.dating.active = false;
                this.yuleting.active = true;
                this.zhanji.active = false;
                this.gerenzhongxin.active = false;
                break;
            case "zhanji":
                this.dating.active = false;
                this.yuleting.active = false;
                this.zhanji.active = true;
                this.gerenzhongxin.active = false;
                break;
            case "gerenzhongxin":
                this.dating.active = false;
                this.yuleting.active = false;
                this.zhanji.active = false;
                this.gerenzhongxin.active = true;
                break;
        }
    },
    //游戏按钮点击
    onGameChecked: function onGameChecked(trage, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "nn":
                this.selectNN.getComponent(cc.Animation).play("bottomToTop");
                //this.selectNN.active = true;
                break;
            case "zjh":
                this.selectNN.getComponent(cc.Animation).play("bottomToTop");
                //this.selectZJH.active = true;
                break;
        }
    }
});

cc._RF.pop();