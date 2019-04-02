cc.Class({
    extends: cc.Component,

    properties: {},

    // onLoad () {},

    start() {},

    onCloseClicked: function(target) {
        cc.log("selectZJH");
        //this.node.active = false;
        this.node.getComponent(cc.Animation).play("topTobottom");
    }
    // update (dt) {},
});
