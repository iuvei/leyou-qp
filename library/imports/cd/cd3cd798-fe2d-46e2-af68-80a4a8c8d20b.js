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
            cc.log("<<<===WebSocketManager getToken:", data);
            _this.dispatchEvent("getToken", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", th.args.debug ? result_message : "系统维护更新");
                return;
            }
            th.wc.show("正在获生成签名...");
            th.token = rdata.t;
            var params = {
                operation: "makeSign",
                data: {
                    timestamp: Date.parse(new Date()) / 1000,
                    token: rdata.t
                }
            };
            cc.log("===>>>WebSocketManager makeSign:", params);
            th.ws.send(JSON.stringify(params));
        });

        //模拟生成签名(获取用户信息)
        th.ws.addHandler("makeSign", function (data) {
            cc.log("<<<===WebSocketManager makeSign:", data);
            _this.dispatchEvent("makeSign", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", th.args.debug ? result_message : "系统维护更新");
                return;
            }
            th.wc.show("正在用户信息...");
            th.sign = rdata.sign;
            var params = {
                operation: "pullUserInfo",
                data: {
                    timestamp: Date.parse(new Date()) / 1000,
                    token: th.token,
                    sign: rdata.sign
                }
            };
            cc.log("===>>>WebSocketManager pullUserInfo:", params);
            th.ws.send(JSON.stringify(params));
        });

        //4. 获取用户信息
        th.ws.addHandler("pullUserInfo", function (data) {
            cc.log("<<<===WebSocketManager pullUserInfo:", data);
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

        //创建房间
        th.ws.addHandler("CreateRoom", function (data) {
            cc.log("<<<===WebSocketManager CreateRoom:", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", th.args.debug ? result_message : "系统维护更新");
                return;
            }
            th.wc.show("正在加请求房间数据...");
            th.room.id = rdata.room_id;
            th.room.number = rdata.room_number;
            _this.dispatchEvent("CreateRoom", data);
            var params = {
                operation: "PrepareJoinRoom",
                account_id: th.myself.id, //用户id};
                session: th.sign,
                data: {
                    room_number: th.room.number
                }
            };
            cc.log("===>>>WebSocketManager PrepareJoinRoom:", params);
            th.ws.send(JSON.stringify(params));
        });

        //进入房间请求初始信息
        th.ws.addHandler("PrepareJoinRoom", function (data) {
            cc.log("<<<===WebSocketManager PrepareJoinRoom:", data);
            var result = data.result,
                result_message = data.result_message,
                rdata = data.data;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", th.args.debug ? result_message : "系统维护更新");
                return;
            }
            th.wc.hide();
            th.room = Object.assign(th.room, rdata);
            _this.dispatchEvent("PrepareJoinRoom", rdata);
        });

        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", function (data) {
            cc.log("<<<===WebSocketManager getUserInfo:", JSON.stringify(data));
            _this.dispatchEvent("getUserInfo", data);
        });

        //断线
        th.ws.addHandler("disconnect", function (data) {
            cc.log("<<<===WebSocketManager 断开连接");
        });
    },

    connectApiServer: function connectApiServer(_ref) {
        var _this2 = this;

        var ip = _ref.ip,
            port = _ref.port,
            namespace = _ref.namespace;

        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/" + namespace;
        th.ws.connect(function () {
            _this2.dispatchEvent("api_connect_success");
            cc.log("===WebSocketManager \u8FDE\u63A5\u6210\u529F:" + ip + ":" + port + "/" + namespace + "===");
            var params = {
                operation: "getToken",
                data: { code: th.args.code }
            };
            cc.log("===>>>WebSocketManager getToken:", params);
            th.ws.send(JSON.stringify(params));
            th.wc.show("正在获取TOKEN...");
        }, function () {
            cc.log("===WebSocketManager \u8FDE\u63A5\u5931\u8D25:" + ip + ":" + port + "/" + namespace + "===");
            th.alert.show("提示", "连接失败");
        });
    },
    connectGameNNServer: function connectGameNNServer(_ref2) {
        var _this3 = this;

        var ip = _ref2.ip,
            port = _ref2.port,
            namespace = _ref2.namespace;

        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/" + namespace;
        th.ws.connect(function () {
            _this3.dispatchEvent("game_connect_success");
            cc.log("===WebSocketManager \u8FDE\u63A5\u6210\u529F:" + ip + ":" + port + "/" + namespace + "===");
            //cc.log("===>>>WebSocketManager getToken:", params);
        }, function () {
            cc.log("===WebSocketManager \u8FDE\u63A5\u5931\u8D25:" + ip + ":" + port + "/" + namespace + "===");
            th.alert.show("提示", "连接失败");
        });
    }
});

cc._RF.pop();