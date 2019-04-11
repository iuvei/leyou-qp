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
            cc.log("===>>>WebSocketManager getToken:", JSON.stringify(data));
            this.dispatchEvent("getToken", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", result_message);
                return;
            }
            th.token = rdata.t;
            let params = {
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
        th.ws.addHandler("makeSign", data => {
            cc.log("===>>>WebSocketManager makeSign:", JSON.stringify(data));
            this.dispatchEvent("makeSign", data);
            let { result, result_message, data: rdata } = data;
            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", result_message);
                return;
            }
            th.sign = rdata.sign;
            let params = {
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
        th.ws.addHandler("pullUserInfo", data => {
            cc.log(JSON.stringify(data));
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

        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", data => {
            cc.log("===>>>WebSocketManager getUserInfo:", JSON.stringify(data));
            this.dispatchEvent("getUserInfo", data);
        });

        //断线
        th.ws.addHandler("disconnect", data => {
            cc.log("===>>>WebSocketManager 断开连接");
        });
    },

    connectServer: function({ ip, port, namespace }) {
        cc.log(th.ws.connected);
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = `ws://${ip}:${port}/${namespace}`;
        th.ws.connect(
            () => {
                this.dispatchEvent("connect_success");
                cc.log("==>WebSocketManager 连接成功");
                let params = {
                    operation: "getToken",
                    data: { code: th.args.code }
                };
                th.ws.send(JSON.stringify(params));
                th.wc.show("正在获取TOKEN...");
            },
            () => {
                cc.log("==>WebSocketManager 连接失败");
                th.alert.show("提示", "连接失败");
            }
        );
    }
});
