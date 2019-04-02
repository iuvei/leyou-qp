cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },

        // defaults, set visually when attaching this script to the Canvas
        text: "Hello, World!"
    },

    onLoad: function() {
        const cvs = this.node.getComponent(cc.Canvas);
        const {
            width: designWidth,
            height: designHeight
        } = cc.view.getDesignResolutionSize();
        const {
            width: visibleWidth,
            height: visibleHeight
        } = cc.view.getFrameSize();
        cc.log(visibleHeight / visibleWidth, designHeight / designWidth);
        cc.log(visibleHeight / visibleWidth > designHeight / designWidth);
        if (visibleHeight / visibleWidth > designHeight / designWidth) {
            cvs.fitWidth = true;
            cvs.fitHeight = false;
            cc.log("等比拉伸宽度到全屏：FitWidth");
        } else if (visibleHeight / visibleWidth < designHeight / designWidth) {
            cvs.fitWidth = false;
            cvs.fitHeight = true;
            cc.log("等比拉伸高度到全屏：FitHeight");
        } else {
            cvs.fitWidth = true;
            cvs.fitHeight = true;
            cc.log("按比例放缩，全部展示不裁剪：ShowALl");
        }

        this.label.string = cc.view.getFrameSize();

        //cvs.fitHeight = true;
        //cvs.fitWidth = true;
    },

    update: function(dt) {}
});
