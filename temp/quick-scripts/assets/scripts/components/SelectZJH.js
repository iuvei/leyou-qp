(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/SelectZJH.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69681YtmUFJCYNJqaYi8v2w', 'SelectZJH', __filename);
// scripts/components/SelectZJH.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // onLoad () {},

    start: function start() {},


    onCloseClicked: function onCloseClicked(target) {
        cc.log("selectZJH");
        //this.node.active = false;
        this.node.getComponent(cc.Animation).play("topTobottom");
    }
    // update (dt) {},
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
        //# sourceMappingURL=SelectZJH.js.map
        