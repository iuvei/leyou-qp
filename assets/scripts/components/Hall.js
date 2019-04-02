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

    onLoad: function() {},
    start: function() {},

    update: function(dt) {},

    //防作弊
    onFzbChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("防作弊");
        //TODO
    },
    //发送房卡
    onSendFangKaChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    //wechat
    onWechatChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("wechat");
        //TODO
    },
    //开关声音
    onVoiceChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("开关声音", trager.isChecked);
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
