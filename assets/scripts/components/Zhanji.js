cc.Class({
    extends: cc.Component,

    properties: {},

    onTypeClicked(target, type) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩类别选择:", type);
        //TODO
        switch (type) {
            case "join":
                break;
            case "create":
                break;
        }
    },

    onGameClicked(traget, type) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩游戏选择:", type);
        //TODO
        switch (type) {
            case "nn":
                break;
            case "zjh":
                break;
        }
    }
});
