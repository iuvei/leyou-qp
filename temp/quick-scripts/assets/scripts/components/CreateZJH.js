(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/CreateZJH.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '69681YtmUFJCYNJqaYi8v2w', 'CreateZJH', __filename);
// scripts/components/CreateZJH.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
    },
    show: function show(type) {
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

    onCloseClicked: function onCloseClicked(traget) {
        this.node.active = false;
    },
    start: function start() {}
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
        //# sourceMappingURL=CreateZJH.js.map
        