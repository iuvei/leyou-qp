cc.Class({
    extends: cc.Component,

    properties: {},

    onFsfkClicked: function(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("发送房卡");
        //TODO
    },
    onZhglClicked: function(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("帐号关联");
        //TODO
    },
    onLszjClicked: function(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("历史战绩");
        //TODO
    },
    onZjtjClicked: function(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩统计");
        //TODO
    },
    onSmrzClicked: function(target) {
        th.audioManager.playSFX("click.mp3");
        cc.log("实名认证");
        //TODO
    }
});
