cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        if (th == null) {
            return;
        }
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },
    start() {
        this.node.active = false;
    },
    show(type) {
        cc.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },
    onJoinClicked: function(traget) {
        cc.log("onJoinClicked");
    },
    onLookClicked: function(traget) {
        cc.log("onLookClicked");
    },
    start() {}
});
