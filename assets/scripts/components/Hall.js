function initManager() {
    window.th = window.th || {};

    const AudioManager = require("AudioManager");
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

    onLoad: function() {
        initManager();
        cc.log("================>>initManager<<=====================");
    },

    update: function(dt) {},

    //防作弊
    onFzbChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
    },
    //发送房卡
    onSendFangKaChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
    },
    //wechat
    onWechatChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
    },
    //开关声音
    onVoiceChecked: function(trager) {
        cc.log(trager.isChecked);
        th.audioManager.playSFX("click.mp3");
    },
    //复制ID
    onCopyIdChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
    },

    //大厅dock按钮点击事件
    onDockChecked: function(traget, type) {
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
    onGameChecked: function(trage, type) {
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
