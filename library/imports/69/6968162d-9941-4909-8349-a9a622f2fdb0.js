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
    onCreateClicked: function onCreateClicked(targer) {
        var _this = this;

        cc.log("onCreateClicked:", this.createFrom);
        //断开大厅连接连接游戏websocket
        th.webSocketManager.connectGameServer({
            ip: "47.96.177.207",
            port: 10000,
            namespace: "gamezjh" //这里改成炸金花的
        }, function () {
            th.wc.show("正在创建房间...");
            var roomInfo = Object.assign({}, _this.createFrom);
            roomInfo.data_key = Date.parse(new Date()) + _this.randomString(5);
            var params = {
                operation: "CreateRoom", //操作标志
                account_id: th.myself.account_id, //用户id};
                session: th.sign,
                data: roomInfo
            };
            Object.assign(th.room, roomInfo);
            cc.log("===>>>[CreateRoom] CreateNN:", params);
            th.ws.send(JSON.stringify(params));
        });
    },
    start: function start() {}
});

cc._RF.pop();