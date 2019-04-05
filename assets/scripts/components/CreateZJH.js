cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        if (th == null) {
            return;
        }
    },
    show(type) {
        cc.log("CreateZJH:", type);
        switch (type) {
            case "jdzjh":
                break;
            case "dpzjh":
                break;
            case "xzzjh":
                break;
            case "lzzjh":
                break;
        }
        this.node.active = true;
    },
    onCloseClicked: function(traget) {
        this.node.active = false;
    },
    start() {}
});
