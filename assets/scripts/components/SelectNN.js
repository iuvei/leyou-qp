cc.Class({
    extends: cc.Component,

    properties: {
        createNN: cc.Node
    },

    onCloseClicked: function(target) {
        th.audioManager.playSFX("click.mp3");
        this.node.runAction(
            cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn())
        );
    },
    onCreateCloseClicked: function(target) {
        cc.log("AAAAAAAAAAAAAAAAAAAAA");
        th.audioManager.playSFX("click.mp3");
        this.createNN.active = false;
    },
    onGameChecked: function(trage, type) {
        cc.log("牛牛选择类别:", type);
        //TODO
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "jdnn":
                break;
            case "12nn":
                break;
            case "13nn":
                break;
            case "lznn":
                break;
            case "mpmm":
                break;
            case "nsz":
                break;
            case "dcxnn":
                break;
        }
        this.createNN.active = true;
    }
});
