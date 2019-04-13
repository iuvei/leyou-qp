"use strict";
cc._RF.push(module, '8b182TVaatK/p4c8JGIa9Ek', 'WebSocket');
// scripts/WebSocket.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        msgprefn: null,
        addHandler: function addHandler(event, fn) {
            cc.log("AddHandler ", event);
            if (this.handlers[event]) {
                cc.log("event:" + event + "' handler has been registered.");
                return;
            }
            var handler = function handler(data) {
                if (event != "disconnect" && typeof data == "string") {
                    data = JSON.parse(data);
                }
                fn(data);
            };
            this.handlers[event] = handler;
        },
        connect: function connect(fnConnect, fnError) {
            var _this = this;

            cc.log("connect to " + this.addr);
            this.ws = new WebSocket(this.addr);

            this.ws.onopen = function (event) {
                cc.log("WebSocket instance onopen.", _this.ws);
                _this.ws.connected = true;
                fnConnect(event.data);
                _this.heartbeat();
            };
            this.ws.onmessage = function (event) {
                var self = _this;
                _this.lastRecieveTime = Date.now();
                _this.delay = _this.lastRecieveTime - _this.lastSendTime;
                var data = event.data;
                if ("@" === data) {
                    //cc.log("<<<===pong");
                    return;
                }
                var json = JSON.parse(data);
                var pass = true;
                if (_this.msgprefn) {
                    pass = _this.msgprefn(json);
                }
                if (pass && Reflect.has(_this.handlers, json.operation)) {
                    _this.handlers[json.operation](json);
                } else {
                    cc.log("<<<===[未处理的]：", json);
                }
            };

            this.ws.onerror = function (error) {
                cc.log("WebSocket instance error.");
                fnError(error);
            };
            var self = this;
            this.ws.onclose = function (event) {
                cc.log("WebSocket instance closed.");
                _this.ws.connected = false;
                _this.isPinging = false;
            };
        },
        heartbeat: function heartbeat() {
            var _this2 = this;

            this.lastRecieveTime = Date.now();
            if (!this.isPinging) {
                this.isPinging = true;
                cc.game.on(cc.game.EVENT_HIDE, function () {
                    cc.log("cc.game.EVENT_HIDE");
                    _this2.ping();
                });
                //每5秒ping一下服务器
                this.pingRef = setInterval(function () {
                    if (_this2.ws) {
                        _this2.ping();
                    }
                }, 2000);
                //每1000毫秒检查一次最后收到消息时间，如果大于10秒就是断开

                this.checkRef = setInterval(function () {
                    if (_this2.ws) {
                        if (Date.now() - _this2.lastRecieveTime > 10000) {
                            _this2.close();
                        }
                    }
                }, 1000);
            }
        },
        close: function close() {
            clearInterval(this.pingRef);
            clearInterval(this.checkRef);
            if (this.ws && this.ws.connected) {
                this.ws.connected = false;
                this.ws.close();
            }
            if (this.fnDisconnect) {
                this.fnDisconnect();
                this.fnDisconnect = null;
            }
        },
        send: function send(data) {
            if (this.ws && this.ws.connected) {
                if (data && (typeof data === "undefined" ? "undefined" : _typeof(data)) == "object") {
                    data == JSON.stringify(data);
                }
                this.ws.send(data);
            }
        },
        ping: function ping() {
            if (this.ws) {
                this.lastSendTime = Date.now();
                this.send("@");
                //cc.log("===>>>ping");
            }
        }
    }
});

cc._RF.pop();