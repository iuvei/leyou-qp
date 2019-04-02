(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Start.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'Start', __filename);
// Script/Start.js

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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Start.js.map
        