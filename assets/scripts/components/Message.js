cc.Class({
    extends: cc.Component,

    properties: {
        ltlMsg: cc.Label
    },

    onLoad() {
        cc.log("Message====>onload");
        if (th == null) {
            return null;
        }
        th.msg = this;
        this.node.active = false;
    },

    show(content) {
        if (this.node) {
            this.node.active = true;
            this.ltlMsg.string = content || "";
            this.node.runAction(
                cc.sequence(
                    cc.fadeIn(0),
                    cc.moveTo(1, cc.v2(0, 200)),
                    cc.fadeOut(0),
                    cc.callFunc(target => (target.y = 0))
                )
            );
        }
    },
    onDestory: function() {
        if (th) {
            th.alert = null;
        }
    }
});
