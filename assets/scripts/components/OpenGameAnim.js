cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        if (th == null) {
            return;
        }
        this.node.active = false;
    },
    show() {
        this.node.active = true;
        let left = this.node.getChildByName("open1");
        let right = this.node.getChildByName("open2");

        let txt1 = this.node.getChildByName("open4");
        let txt2 = this.node.getChildByName("open3");

        txt1.active = false;
        txt2.active = false;
        txt2.scale = 1;
        left.x = -600;
        right.x = 600;

        left.runAction(cc.moveTo(0.3, cc.v2(-150, 0)).easing(cc.easeBackOut()));
        right.runAction(
            cc.sequence(
                cc.moveTo(0.3, cc.v2(150, 0)).easing(cc.easeBackOut()),
                cc.callFunc(() => {
                    txt1.active = true;
                    txt2.active = true;
                    txt2.runAction(
                        cc.sequence(
                            cc.fadeIn(0),
                            cc.spawn(cc.scaleTo(0.5, 1.3), cc.fadeOut(0.5))
                        )
                    );
                }),
                cc.delayTime(0.8),
                cc.callFunc(() => {
                    this.node.active = false;
                })
            )
        );
    }
});
