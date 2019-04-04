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
        bangdingshouji: cc.Node
    },

    onLoad: function() {},
    onEnable() {
        const bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm != "0") {
            th.audioManager.setBGMVolume(bgm);
            this.voiceToggle.isChecked = false;
        } else {
            this.voiceToggle.isChecked = true;
        }
    },
    start: function() {},

    update: function(dt) {},

    //防作弊
    onFzbChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = true;
    },
    //防作弊关闭
    onFzbCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
    },
    //防作弊提交
    onFzbYesChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
        //TODO
    },
    //绑定手机
    onBdsjChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = true;
    },
    //绑定手机关闭
    onBdsjCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
    },
    //绑定手机提交
    onBdsjYesChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
        //TODO
    },
    //开关声音
    onVoiceChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("开关声音", trager.isChecked);
        if (trager.isChecked) {
            th.audioManager.setBGMVolume(0);
        } else {
            th.audioManager.setBGMVolume(0.5);
        }
    },
    //发送房卡
    onSendFangKaChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    //复制ID
    onCopyIdChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("复制ID");
        //TODO
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
                this.selectNN.position = cc.v2(0, -th.height);
                this.selectNN.runAction(
                    cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn())
                );
                break;
            case "zjh":
                this.selectZJH.position = cc.v2(0, -th.height);
                this.selectZJH.runAction(
                    cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn())
                );
                break;
        }
    }
});
