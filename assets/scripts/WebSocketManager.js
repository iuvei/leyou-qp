cc.Class({
    extends: cc.Component,

    properties: {},

    dispatchEvent(event, data) {
        if (this.dataEventHandler) {
            this.dataEventHandler.emit(event, data);
        }
    },
    initHandlers: function() {
        cc.log("==>WebSocketManager initHandlers");
        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", data => {
            cc.log("==>WebSocketManager getUserInfo:", JSON.stringify(data));
            this.dispatchEvent("getUserInfo", data);
        });

        //断线
        th.ws.addHandler("disconnect", data => {
            cc.log("==>WebSocketManager 断开连接");
        });
    },

    connectServer: function({ ip, port }) {
        cc.log(th.ws.connected);
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = `ws://${ip}:${port}/bull`;
        th.ws.connect(
            () => {
                this.dispatchEvent("connect_success");
                cc.log("==>WebSocketManager 连接成功");
                //th.alert.show("提示", "连接成功");
                cc.director.loadScene("Hall", () => {
                    this.dispatchEvent("connect_success");
                });
            },
            () => {
                cc.log("==>WebSocketManager 连接失败");
            }
        );
    }
});
