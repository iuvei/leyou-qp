"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'Start');
// scripts/components/Start.js

"use strict";

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

    onLoad: function onLoad() {
        var cvs = this.node.getComponent(cc.Canvas);

        var _cc$view$getFrameSize = cc.view.getFrameSize(),
            width = _cc$view$getFrameSize.width,
            height = _cc$view$getFrameSize.height;

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

    update: function update(dt) {}
});

cc._RF.pop();