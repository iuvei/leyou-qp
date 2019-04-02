(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Hall.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '773fdxZFshNqYWrF+ZWmpkp', 'Hall', __filename);
// scripts/components/Hall.js

"use strict";

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

    onLoad: function onLoad() {},
    start: function start() {},

    update: function update(dt) {},

    //防作弊
    onFzbChecked: function onFzbChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("防作弊");
        //TODO
    },
    //发送房卡
    onSendFangKaChecked: function onSendFangKaChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    //wechat
    onWechatChecked: function onWechatChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("wechat");
        //TODO
    },
    //开关声音
    onVoiceChecked: function onVoiceChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("开关声音", trager.isChecked);
        //TODO
    },
    //复制ID
    onCopyIdChecked: function onCopyIdChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("复制ID");
        //TODO
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
                this.selectNN.position = cc.v2(0, -th.height);
                this.selectNN.runAction(cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn()));
                break;
            case "zjh":
                this.selectZJH.position = cc.v2(0, -th.height);
                this.selectZJH.runAction(cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn()));
                break;
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
        //# sourceMappingURL=Hall.js.map
        