/*
if(window.io == null){
    window.io = require("socket.io");
}
*/
var WS = cc.Class({
    extends: cc.Component,

    statics: {
        ip: null,
        port: null,
        addr: null,
        ws: null,
        handlers: {},
        fnDisconnect: null,
        isPinging: false,
        lastSendTime: 0,
        lastRecieveTime: 0,
        delay: 0,
        connected: false,
        pingRef: null,
        checkRef: null,
        addHandler: function(event, fn) {
            cc.log("addHandler....", event);
            if (this.handlers[event]) {
                cc.log("event:" + event + "' handler has been registered.");
                return;
            }
            const handler = function(data) {
                if (event != "disconnect" && typeof data == "string") {
                    data = JSON.parse(data);
                }
                fn(data);
            };
            this.handlers[event] = handler;
        },
        connect: function(fnConnect, fnError) {
            cc.log(`connect to ${this.addr}`);
            this.ws = new WebSocket(this.addr);

            this.ws.onopen = event => {
                cc.log("WebSocket instance onopen.", this.ws);
                this.ws.connected = true;
                fnConnect(event.data);
                this.heartbeat();
            };
            this.ws.onmessage = event => {
                let self = this;
                this.lastRecieveTime = Date.now();
                this.delay = this.lastRecieveTime - this.lastSendTime;
                const data = event.data;
                if ("@" === data) {
                    cc.log("<<<===pong");
                    return;
                }
                const json = JSON.parse(data);
                this.handlers[json.operation](json);
            };

            this.ws.onerror = event => {
                cc.log("WebSocket instance error.");
                fnError(error);
            };
            let self = this;
            this.ws.onclose = event => {
                cc.log(
                    "WebSocket instance closed.",
                    self.ws === this.ws,
                    this.ws
                );
                this.ws.connected = false;
                this.close();
            };
        },
        heartbeat: function() {
            this.lastRecieveTime = Date.now();
            if (!this.isPinging) {
                this.isPinging = true;
                cc.game.on(cc.game.EVENT_HIDE, () => {
                    cc.log("cc.game.EVENT_HIDE");
                    this.ping();
                });
                //每5秒ping一下服务器
                this.pingRef = setInterval(() => {
                    if (this.ws) {
                        this.ping();
                    }
                }, 2000);
                //每1000毫秒检查一次最后收到消息时间，如果大于10秒就是断开

                this.checkRef = setInterval(() => {
                    if (this.ws) {
                        if (Date.now() - this.lastRecieveTime > 10000) {
                            this.close();
                        }
                    }
                }, 1000);
            }
        },
        close: function() {
            clearInterval(this.pingRef);
            clearInterval(this.checkRef);
            if (this.ws && this.ws.connected) {
                this.ws.connected = false;
                this.ws.close();
            }
            this.ws = null;
            if (this.fnDisconnect) {
                this.fnDisconnect();
                this.fnDisconnect = null;
            }
        },
        send: function(data) {
            if (this.ws && this.ws.connected) {
                if (data && typeof data == "object") {
                    data == JSON.stringify(data);
                }
                this.ws.send(data);
            }
        },
        ping: function() {
            if (this.ws) {
                this.lastSendTime = Date.now();
                this.send("@");
                cc.log("===>>>ping");
            }
        }
    }
});
