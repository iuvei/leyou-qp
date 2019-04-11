cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler: null //websocket发过来的数据的节点
    },

    dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    },
    initHandlers: function() {
        cc.log("==>WebSocketManager initHandlers");
        //获取TOKEN
        th.ws.addHandler("getToken", data => {
            cc.log("<<<===WebSocketManager getToken:", data);
            this.dispatchEvent("getToken", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show(
                    "提示",
                    th.args.debug ? result_message : "系统维护更新"
                );
                return;
            }
            th.wc.show("正在获生成签名...");
            th.token = rdata.t;
            let params = {
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
        th.ws.addHandler("makeSign", data => {
            cc.log("<<<===WebSocketManager makeSign:", data);
            this.dispatchEvent("makeSign", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show(
                    "提示",
                    th.args.debug ? result_message : "系统维护更新"
                );
                return;
            }
            th.wc.show("正在用户信息...");
            th.sign = rdata.sign;
            let params = {
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
        th.ws.addHandler("pullUserInfo", data => {
            cc.log("<<<===WebSocketManager pullUserInfo:", data);
            this.dispatchEvent("pullUserInfo", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", result_message);
                return;
            }
            th.wc.show("正在加载游戏...");
            th.myself.id = rdata.account_id;
            th.myself.name = rdata.nickname;
            cc.director.loadScene("Hall", () => {
                th.wc.hide();
            });
        });

        //创建房间
        th.ws.addHandler("CreateRoom", data => {
            cc.log("<<<===WebSocketManager CreateRoom:", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show(
                    "提示",
                    th.args.debug ? result_message : "系统维护更新"
                );
                return;
            }
            th.wc.show("正在加请求房间数据...");
            th.room.id = rdata.room_id;
            th.room.number = rdata.room_number;
            this.dispatchEvent("CreateRoom", data);
            let params = {
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
        th.ws.addHandler("PrepareJoinRoom", data => {
            cc.log("<<<===WebSocketManager PrepareJoinRoom:", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show(
                    "提示",
                    th.args.debug ? result_message : "系统维护更新"
                );
                return;
            }
            th.wc.hide();
            th.room = Object.assign(th.room, rdata);
            this.dispatchEvent("PrepareJoinRoom", rdata);
        });

        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", data => {
            cc.log("<<<===WebSocketManager getUserInfo:", JSON.stringify(data));
            this.dispatchEvent("getUserInfo", data);
        });

        //断线
        th.ws.addHandler("disconnect", data => {
            cc.log("<<<===WebSocketManager 断开连接");
        });
    },

    connectApiServer: function({ ip, port, namespace }) {
        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = `ws://${ip}:${port}/${namespace}`;
        th.ws.connect(
            () => {
                this.dispatchEvent("api_connect_success");
                cc.log(
                    `===WebSocketManager 连接成功:${ip}:${port}/${namespace}===`
                );
                let params = {
                    operation: "getToken",
                    data: { code: th.args.code }
                };
                cc.log("===>>>WebSocketManager getToken:", params);
                th.ws.send(JSON.stringify(params));
                th.wc.show("正在获取TOKEN...");
            },
            () => {
                cc.log(
                    `===WebSocketManager 连接失败:${ip}:${port}/${namespace}===`
                );
                th.alert.show("提示", "连接失败");
            }
        );
    },
    connectGameNNServer: function({ ip, port, namespace }) {
        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = `ws://${ip}:${port}/${namespace}`;
        th.ws.connect(
            () => {
                this.dispatchEvent("game_connect_success");
                cc.log(
                    `===WebSocketManager 连接成功:${ip}:${port}/${namespace}===`
                );
                //cc.log("===>>>WebSocketManager getToken:", params);
            },
            () => {
                cc.log(
                    `===WebSocketManager 连接失败:${ip}:${port}/${namespace}===`
                );
                th.alert.show("提示", "连接失败");
            }
        );
    }
});
