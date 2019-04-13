(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/WebSocketManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cd3cdeY/i1G4q9ogKSoyNIL', 'WebSocketManager', __filename);
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
        th.ws.msgprefn = function (_ref) {
            var result = _ref.result,
                result_message = _ref.result_message;

            if (result != 0) {
                th.wc.hide();
                th.alert.show("提示", th.args.debug ? result_message : "系统维护更新");
                return false;
            }
            return true;
        };
        //获取TOKEN
        th.ws.addHandler("getToken", function (_ref2) {
            var data = _ref2.data;

            cc.log("<<<===[getToken] WebSocketManager:", data);
            _this.dispatchEvent("getToken", data);
            th.wc.show("正在获生成签名...");
            th.token = data.t;
            var params = {
                operation: "makeSign",
                data: {
                    timestamp: Date.parse(new Date()) / 1000,
                    token: data.t
                }
            };
            cc.log("===>>>[makeSign] WebSocketManager:", params);
            th.ws.send(JSON.stringify(params));
        });

        //模拟生成签名(获取用户信息)
        th.ws.addHandler("makeSign", function (_ref3) {
            var data = _ref3.data;

            cc.log("<<<===[makeSign] WebSocketManager:", data);
            _this.dispatchEvent("makeSign", data);
            th.wc.show("正在用户信息...");
            th.sign = data.sign;
            var params = {
                operation: "pullUserInfo",
                data: {
                    timestamp: Date.parse(new Date()) / 1000,
                    token: th.token,
                    sign: data.sign
                }
            };
            cc.log("===>>>[pullUserInfo] WebSocketManager:", params);
            th.ws.send(JSON.stringify(params));
        });

        //4. 获取用户信息
        th.ws.addHandler("pullUserInfo", function (_ref4) {
            var data = _ref4.data;

            cc.log("<<<===[pullUserInfo] WebSocketManager:", data);
            _this.dispatchEvent("pullUserInfo", data);
            th.wc.show("正在加载游戏...");
            Object.assign(th.myself, data);
            cc.director.loadScene("Hall", function () {
                th.wc.hide();
            });
        });

        //创建房间
        th.ws.addHandler("CreateRoom", function (_ref5) {
            var data = _ref5.data;

            cc.log("<<<===[CreateRoom] WebSocketManager:", data);
            th.wc.show("正在加请求房间数据...");
            Object.assign(th.room, data);
            _this.dispatchEvent("CreateRoom", data);
            var params = {
                operation: "PrepareJoinRoom",
                account_id: th.myself.account_id, //用户id};
                session: th.sign,
                data: {
                    room_number: th.room.room_number
                }
            };
            cc.log("===>>>[PrepareJoinRoom] WebSocketManager:", params);
            th.ws.send(JSON.stringify(params));
        });

        //进入房间请求初始信息
        th.ws.addHandler("PrepareJoinRoom", function (_ref6) {
            var data = _ref6.data;

            cc.log("<<<===[PrepareJoinRoom] WebSocketManager:", data);
            th.room = Object.assign(th.room, data);
            _this.dispatchEvent("PrepareJoinRoom", data);
            th.wc.hide();
        });

        //加入房间
        th.ws.addHandler("JoinRoom", function (_ref7) {
            var data = _ref7.data;

            cc.log("<<<===[JoinRoom] WebSocketManager:", data);
            Object.assign(th.room, data);
            var sceneName = th.gametype == "nn" ? "GameNN" : "GameZJH";
            cc.director.loadScene(sceneName, function () {
                th.wc.hide();
            });
            _this.dispatchEvent("JoinRoom", data);
        });
        //加入观战
        th.ws.addHandler("GuestRoom", function (_ref8) {
            var data = _ref8.data;

            cc.log("<<<===[GuestRoom] WebSocketManager:", data);
            Object.assign(th.room, data);
            var sceneName = th.gametype == "nn" ? "GameNN" : "GameZJH";
            cc.director.loadScene(sceneName, function () {
                th.wc.hide();
            });
            _this.dispatchEvent("GuestRoom", data);
        });

        //到游戏人员信息
        th.ws.addHandler("AllGamerInfo", function (_ref9) {
            var data = _ref9.data;

            cc.log("<<<===[AllGamerInfo] WebSocketManager:", data);
            th.room.players = data;
            th.myself.isPlayer = data.findIndex(function (player) {
                return player.account_id == th.myself.account_id;
            }) > -1 ? true : false;
            _this.dispatchEvent("AllGamerInfo", data);
        });
        //观战人员信息
        th.ws.addHandler("AllGuestInfo", function (_ref10) {
            var data = _ref10.data;

            cc.log("<<<===[AllGuestInfo] WebSocketManager:", data);
            th.room.guests = data;
            _this.dispatchEvent("AllGuestInfo", data);
        });

        //更新游戏人员信息
        th.ws.addHandler("UpdateGamerInfo", function (_ref11) {
            var data = _ref11.data;

            cc.log("<<<===[UpdateGamerInfo] WebSocketManager:", data);
            var player = th.room.players.find(function (player) {
                return player.account_id == data.account_id;
            });
            if (player) {
                Object.assign(player, data);
                _this.dispatchEvent("UpdateGamerInfo", player);
            } else {
                th.room.players.push(data);
                _this.dispatchEvent("UpdateGamerInfo", data);
            }
        });

        //增加观战 ,更新观战人员信息
        th.ws.addHandler("UpdateGuestInfo", function (_ref12) {
            var data = _ref12.data;

            cc.log("<<<===[UpdateGuestInfo] WebSocketManager:", data);
            Object.assign(th.room.guests.find(function (player) {
                return player.account_id == data.account_id;
            }), data);
            _this.dispatchEvent("UpdateGuestInfo", data);
        });

        //更新玩家状态信息
        th.ws.addHandler("UpdateAccountStatus", function (_ref13) {
            var data = _ref13.data;

            cc.log("<<<===[UpdateAccountStatus] WebSocketManager:", data);
            var player = th.room.players.find(function (player) {
                return player.account_id == data.account_id;
            });
            if (player) {
                Object.assign(player, data);
                _this.dispatchEvent("UpdateAccountStatus", player);
            }
        });

        /*
        //连接成功初始化信息
        th.ws.addHandler("getUserInfo", data => {
            cc.log("<<<===WebSocketManager getUserInfo:", JSON.stringify(data));
            this.dispatchEvent("getUserInfo", data);
        });
          //断线
        th.ws.addHandler("disconnect", data => {
            cc.log("<<<===WebSocketManager 断开连接");
        });
        */
    },

    connectApiServer: function connectApiServer(_ref14) {
        var _this2 = this;

        var ip = _ref14.ip,
            port = _ref14.port,
            namespace = _ref14.namespace;

        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/" + namespace;
        th.ws.connect(function () {
            _this2.dispatchEvent("api_connect_success");
            cc.log("[\u8FDE\u63A5\u6210\u529F] WebSocketManager :" + ip + ":" + port + "/" + namespace);
            th.wc.show("正在获取TOKEN...");
            var params = {
                operation: "getToken",
                data: { code: th.args.code }
            };
            cc.log("===>>>[getToken] WebSocketManager:", params);
            th.ws.send(JSON.stringify(params));
        }, function () {
            cc.log("[\u8FDE\u63A5\u5931\u8D25] WebSocketManager :" + ip + ":" + port + "/" + namespace);
            th.alert.show("提示", "连接失败");
        });
    },
    connectGameNNServer: function connectGameNNServer(_ref15, callback) {
        var _this3 = this;

        var ip = _ref15.ip,
            port = _ref15.port,
            namespace = _ref15.namespace;

        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/" + namespace;
        th.gametype = "nn";
        th.ws.connect(function () {
            _this3.dispatchEvent("game_connect_success");
            callback();
            cc.log("===WebSocketManager \u8FDE\u63A5\u6210\u529F:" + ip + ":" + port + "/" + namespace + "===");
        }, function () {
            cc.log("===WebSocketManager \u8FDE\u63A5\u5931\u8D25:" + ip + ":" + port + "/" + namespace + "===");
            th.alert.show("提示", "连接失败");
        });
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=WebSocketManager.js.map
        