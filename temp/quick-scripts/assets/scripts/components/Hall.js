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
        selectZJH: cc.Node,
        voiceToggle: cc.Toggle,
        fangzuobi: cc.Node,
        bangdingshouji: cc.Node,

        //

        createNNComponent: cc.Class,
        createZJHComponent: cc.Class
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        this.createNNComponent = this.node.getChildByName("CreateNN").getComponent("CreateNN");
        this.createZJHComponent = this.node.getChildByName("CreateZJH").getComponent("CreateZJH");
    },
    onEnable: function onEnable() {
        var bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm != "0") {
            th.audioManager.setBGMVolume(bgm);
            this.voiceToggle.isChecked = false;
        } else {
            this.voiceToggle.isChecked = true;
        }
    },

    start: function start() {},

    update: function update(dt) {},

    //防作弊
    onFzbChecked: function onFzbChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = true;
    },
    //防作弊关闭
    onFzbCloseChecked: function onFzbCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
    },
    //防作弊提交
    onFzbYesChecked: function onFzbYesChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
        //TODO
    },
    //绑定手机
    onBdsjChecked: function onBdsjChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = true;
    },
    //绑定手机关闭
    onBdsjCloseChecked: function onBdsjCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
    },
    //绑定手机提交
    onBdsjYesChecked: function onBdsjYesChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
        //TODO
    },
    //开关声音
    onVoiceChecked: function onVoiceChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("开关声音", trager.isChecked);
        if (trager.isChecked) {
            th.audioManager.setBGMVolume(0);
        } else {
            th.audioManager.setBGMVolume(0.5);
        }
    },
    //发送房卡
    onSendFangKaChecked: function onSendFangKaChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    //复制ID
    onCopyIdChecked: function onCopyIdChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("复制ID");
        //TODO
    },

    //大厅dock按钮点击事件
    onDockChecked: function onDockChecked(targer, type) {
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
    //大厅游戏按钮点击
    onHallGameChecked: function onHallGameChecked(targer, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "nn":
                this.bottomToTopAnim(this.selectNN);
                break;
            case "zjh":
                this.bottomToTopAnim(this.selectZJH);
                break;
        }
    },
    //选择游戏界面关闭按钮点击
    onSelectGameCloseClicked: function onSelectGameCloseClicked(targer, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "nn":
                this.topToBottomAnim(this.selectNN);
                break;
            case "zjh":
                this.topToBottomAnim(this.selectZJH);
                break;
        }
    },
    bottomToTopAnim: function bottomToTopAnim(node) {
        if (node.isRun) return;
        node.position = cc.v2(0, -th.height);
        node.runAction(cc.sequence(cc.callFunc(function () {
            node.isRun = true;
        }), cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn()), cc.callFunc(function () {
            node.isRun = false;
        })));
    },
    topToBottomAnim: function topToBottomAnim(node) {
        if (node.isRun) return;
        node.runAction(cc.sequence(cc.callFunc(function () {
            node.isRun = true;
        }), cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()), cc.callFunc(function () {
            node.isRun = false;
        })));
    },
    //选择牛牛子分类
    onSelectNNChecked: function onSelectNNChecked(targer, type) {
        //cc.log("牛牛选择类别:", type);
        th.audioManager.playSFX("click.mp3");
        this.createNNComponent.show(type);
    },
    //选择炸金花子分类
    onSelectZJHChecked: function onSelectZJHChecked(targer, type) {
        //cc.log("炸金花选择类别:", type);
        th.audioManager.playSFX("click.mp3");
        this.createZJHComponent.show(type);
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
        