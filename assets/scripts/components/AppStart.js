cc.Class({
    extends: cc.Component,

    properties: {
        lblLoadingMsg: cc.Label,
        _index: null,
        _scheduleId: null
    },

    onLoad: function() {
        this._index = 0;
        if (th == null) {
            return;
        }
        this.initEventHandlers();
    },
    initEventHandlers() {
        cc.log("AppStart initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;
        /*
        this.node.on("api_connect_success", () => {
            cc.log("<<<===AppStart api_connect_success");
            this.unschedule(this._scheduleId);
        });
        */
    },
    start: function() {
        th.webSocketManager.connectGameServer(
            {
                ip: "47.96.177.207",
                port: 10000,
                namespace: "api"
            },
            () => {
                this.unschedule(this._scheduleId);
                th.wc.show("正在获取TOKEN...");
                let params = {
                    operation: "getToken",
                    data: { code: th.args.code }
                };
                cc.log("===>>>[getToken] WebSocketManager:", params);
                th.ws.send(JSON.stringify(params));
            }
        );

        this._scheduleId = this.schedule(() => {
            let x = this._index % 6;
            let dian = "".padStart(x + 1, ".");
            ++this._index;
            this.lblLoadingMsg.string = `正在连接服务器${dian}`;
        }, 0.25);
    },
    onDestroy: function() {
        cc.log("Appstart onDestroy");
        this.unschedule(this._scheduleId);
    },
    update: function(dt) {}
});
