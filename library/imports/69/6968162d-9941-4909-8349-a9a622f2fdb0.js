"use strict";
cc._RF.push(module, '69681YtmUFJCYNJqaYi8v2w', 'CreateZJH');
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