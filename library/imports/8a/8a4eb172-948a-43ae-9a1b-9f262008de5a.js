"use strict";
cc._RF.push(module, '8a4ebFylIpDrpobnyYgCN5a', 'GameZJH');
// scripts/components/GameZJH.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        createFrom: null //创建房间有参数
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        cc.log("GameNN onLoad");
        this.initEventHandlers();
        //创建房间初始参数
        this.createFrom = {};

        //些文件为ZJH主文件
        //th 是全局变量 在Global.js 里
    },
    initEventHandlers: function initEventHandlers() {
        //用来处理WebSocketManager发送的事件
        th.webSocketManager.dataEventHandler = this.node; //这句代码不能删除
    },
    start: function start() {}

    // update (dt) {},

});

cc._RF.pop();