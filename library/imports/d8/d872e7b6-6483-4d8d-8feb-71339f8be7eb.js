"use strict";
cc._RF.push(module, 'd872ee2ZINNjY/rcTOfi+fr', 'JoinOrLook');
// scripts/components/JoinOrLook.js

"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

cc.Class(_defineProperty({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },
    start: function start() {
        this.node.active = false;
    },
    show: function show(type) {
        cc.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },

    onJoinClicked: function onJoinClicked(traget) {
        cc.log("onJoinClicked");
    },
    onLookClicked: function onLookClicked(traget) {
        cc.log("onLookClicked");
    }
}, "start", function start() {}));

cc._RF.pop();