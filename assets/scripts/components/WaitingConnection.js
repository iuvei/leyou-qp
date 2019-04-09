cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
        lblContent: cc.Label
    },

    onLoad() {
        if (th == null) {
            return null;
        }
        th.wc = this;
        this.node.active = false;
    },

    start() {},
    update(dt) {
        this.target.rotation = this.target.rotation + dt * 90 * 2;
    },

    show(content) {
        if (this.node) {
            this.node.x = 0;
            this.node.y = 0;
            this.node.active = true;
        }
        if (this.lblContent) {
            this.lblContent.string = content || "";
        }
    },

    hide() {
        if (this.node) {
            this.node.active = false;
        }
    },

    onDestory: function() {
        if (th) {
            th.wc = null;
        }
    }
});
