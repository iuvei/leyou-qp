"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'AppStart');
// scripts/components/AppStart.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lblLoadingMsg: cc.Label,
        _index: null,
        _scheduleId: null
    },

    onLoad: function onLoad() {
        this._index = 0;
        if (th == null) {
            return;
        }
        this.initEventHandlers();
    },
    initEventHandlers: function initEventHandlers() {
        cc.log("AppStart initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;
        /*
        this.node.on("api_connect_success", () => {
            cc.log("<<<===AppStart api_connect_success");
            this.unschedule(this._scheduleId);
        });
        */
    },

    start: function start() {
        var _this = this;

        th.webSocketManager.connectGameServer({
            ip: "47.96.177.207",
            port: 10000,
            namespace: "api"
        }, function () {
            _this.unschedule(_this._scheduleId);
            th.wc.show("正在获取TOKEN...");
            var params = {
                operation: "getToken",
                data: { code: th.args.code }
            };
            cc.log("===>>>[getToken] WebSocketManager:", params);
            th.ws.send(JSON.stringify(params));
        });

        this._scheduleId = this.schedule(function () {
            var x = _this._index % 6;
            var dian = "".padStart(x + 1, ".");
            ++_this._index;
            _this.lblLoadingMsg.string = "\u6B63\u5728\u8FDE\u63A5\u670D\u52A1\u5668" + dian;
        }, 0.25);
    },
    onDestroy: function onDestroy() {
        cc.log("Appstart onDestroy");
        this.unschedule(this._scheduleId);
    },
    update: function update(dt) {}
});

cc._RF.pop();