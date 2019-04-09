"use strict";
cc._RF.push(module, 'cd3cdeY/i1G4q9ogKSoyNIL', 'WebSocketManager');
// scripts/WebSocketManager.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    dispatchEvent: function dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    },

    initHandlers: function initHandlers() {
        var _this = this;

        cc.log("==>WebSocketManager initHandlers");
        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", function (data) {
            cc.log("==>WebSocketManager getUserInfo:", JSON.stringify(data));
            _this.dispatchEvent("getUserInfo", data);
        });

        //断线
        th.ws.addHandler("disconnect", function (data) {
            cc.log("==>WebSocketManager 断开连接");
        });
    },

    connectServer: function connectServer(_ref) {
        var _this2 = this;

        var ip = _ref.ip,
            port = _ref.port;

        cc.log(th.ws.connected);
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/bull";
        th.ws.connect(function () {
            _this2.dispatchEvent("connect_success");
            cc.log("==>WebSocketManager 连接成功");
            //th.alert.show("提示", "连接成功");
            cc.director.loadScene("Hall", function () {
                _this2.dispatchEvent("connect_success");
            });
        }, function () {
            cc.log("==>WebSocketManager 连接失败");
        });
    }
});

cc._RF.pop();