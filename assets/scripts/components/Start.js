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
        const { width, height } = cc.view.getFrameSize();
        cvs.fitWidth = true;
        cvs.fitHeight = false;
        /*
        if (height - width * 2 > 0) {
            cvs.fitWidth = true;
            cvs.fitHeight = false;
            cc.log("fitWidth");
        } else {
            cvs.fitWidth = false;
            cvs.fitHeight = true;
            cc.log("fitHeight");
        }
        */
        this.label.string = this.text;
    },

    update: function(dt) {}
});
