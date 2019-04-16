cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        if (th == null) {
            return;
        }
    },
    show(type) {
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
    onCloseClicked: function(traget) {
        this.node.active = false;
    },
    onCreateClicked: function(targer) {
        cc.log("onCreateClicked:", this.createFrom);
        //断开大厅连接连接游戏websocket
        th.webSocketManager.connectGameServer(
            {
                ip: "47.96.177.207",
                port: 10000,
                namespace: "gamezjh" //这里改成炸金花的
            },
            () => {
                th.wc.show("正在创建房间...");
                let roomInfo = Object.assign({}, this.createFrom);
                roomInfo.data_key =
                    Date.parse(new Date()) + this.randomString(5);
                const params = {
                    operation: "CreateRoom", //操作标志
                    account_id: th.myself.account_id, //用户id};
                    session: th.sign,
                    data: roomInfo
                };
                Object.assign(th.room, roomInfo);
                cc.log("===>>>[CreateRoom] CreateNN:", params);
                th.ws.send(JSON.stringify(params));
            }
        );
    },
    start() {}
});
