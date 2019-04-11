"use strict";
cc._RF.push(module, 'cd3cdeY/i1G4q9ogKSoyNIL', 'WebSocketManager');
// scripts/WebSocketManager.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler: null //websocket发过来的数据的节点
    },

    dispatchEvent: function dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    },

    initHandlers: function initHandlers() {
        var _this = this;

        cc.log("==>WebSocketManager initHandlers");
        //获取TOKEN
        th.ws.addHandler("getToken", function (data) {
            cc.log("===>>>WebSocketManager getToken:", JSON.stringify(data));
            _this.dispatchEvent("getToken", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", result_message);
                return;
            }
            th.token = rdata.t;
            var params = {
                operation: "makeSign",
                data: {
                    timestamp: "1554910784",
                    token: rdata.t
                }
            };
            th.ws.send(JSON.stringify(params));
            th.wc.show("正在获生成签名...");
        });

        //模拟生成签名(获取用户信息)
        th.ws.addHandler("makeSign", function (data) {
            cc.log("===>>>WebSocketManager makeSign:", JSON.stringify(data));
            _this.dispatchEvent("makeSign", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", result_message);
                return;
            }
            th.sign = rdata.sign;
            var params = {
                operation: "pullUserInfo",
                data: {
                    timestamp: "1554910784",
                    token: th.token,
                    sign: rdata.sign
                }
            };
            th.ws.send(JSON.stringify(params));
            th.wc.show("正在用户信息...");
        });

        //4. 获取用户信息
        th.ws.addHandler("pullUserInfo", function (data) {
            cc.log(JSON.stringify(data));
            _this.dispatchEvent("pullUserInfo", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", result_message);
                return;
            }
            th.wc.show("正在加载游戏...");
            th.myself.id = rdata.account_id;
            th.myself.name = rdata.nickname;
            cc.director.loadScene("Hall", function () {
                th.wc.hide();
            });
        });

        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", function (data) {
            cc.log("===>>>WebSocketManager getUserInfo:", JSON.stringify(data));
            _this.dispatchEvent("getUserInfo", data);
        });

        //断线
        th.ws.addHandler("disconnect", function (data) {
            cc.log("===>>>WebSocketManager 断开连接");
        });
    },

    connectServer: function connectServer(_ref) {
        var _this2 = this;

        var ip = _ref.ip,
            port = _ref.port,
            namespace = _ref.namespace;

        cc.log(th.ws.connected);
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/" + namespace;
        th.ws.connect(function () {
            _this2.dispatchEvent("connect_success");
            cc.log("==>WebSocketManager 连接成功");
            var params = {
                operation: "getToken",
                data: { code: th.args.code }
            };
            th.ws.send(JSON.stringify(params));
            th.wc.show("正在获取TOKEN...");
        }, function () {
            cc.log("==>WebSocketManager 连接失败");
            th.alert.show("提示", "连接失败");
        });
    }
});

cc._RF.pop();