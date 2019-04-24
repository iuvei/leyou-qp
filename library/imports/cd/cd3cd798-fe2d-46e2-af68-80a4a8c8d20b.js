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

        //===================================================
        //下面公共消息
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
        });

        //加入房间
        th.ws.addHandler("JoinRoom", function (_ref7) {
            var data = _ref7.data;

            cc.log("<<<===[JoinRoom] WebSocketManager:", data);
            Object.assign(th.room, data);
            th.initRoom();
            th.getRoomCopyUrl();
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
            th.initRoom();
            th.getRoomCopyUrl();
            Object.assign(th.room, data);
            var sceneName = th.gametype == "nn" ? "GameNN" : "GameZJH";
            cc.director.loadScene(sceneName, function () {
                th.wc.hide();
            });
            _this.dispatchEvent("GuestRoom", data);
        });

        //======================================================
        //牛牛消息
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
            var guest = th.getGuestById(data.account_id);
            if (guest) {
                Object.assign(guest, data);
                _this.dispatchEvent("UpdateGuestInfo", guest);
            } else {
                th.room.guests.push(data);
                _this.dispatchEvent("UpdateGuestInfo", data);
            }
        });

        //更新玩家状态信息
        th.ws.addHandler("UpdateAccountStatus", function (_ref13) {
            var data = _ref13.data;

            cc.log("<<<===[UpdateAccountStatus] WebSocketManager:", data);
            var player = th.getPlayerById(data.account_id);
            if (player) {
                Object.assign(player, data);
                cc.log("UpdateAccountStatus player:", player);
                _this.dispatchEvent("UpdateAccountStatus", player);
            }
        });

        //开始游戏
        th.ws.addHandler("GameStart", function (data) {
            cc.log("<<<===[GameStart] WebSocketManager:", data);
            var game_num = data.game_num,
                limit_time = data.limit_time,
                rdata = data.data;

            th.room.game_num = game_num;
            th.room.limit_time = limit_time;
            rdata.forEach(function (player) {
                var oldPlayer = th.getPlayerById(player.account_id);
                Object.assign(oldPlayer, player);
                _this.dispatchEvent("UpdateAccountStatus", oldPlayer);
            });
            _this.dispatchEvent("GameStart", data);
        });
        //我的牌
        th.ws.addHandler("MyCards", function (_ref14) {
            var data = _ref14.data;

            cc.log("<<<===[MyCards] WebSocketManager:", data);
            var player = th.getPlayerById(data.account_id);
            player.cards = data.cards;
            _this.dispatchEvent("MyCards", player);
        });
        //开始游戏,闲家选倍数
        th.ws.addHandler("StartBet", function (data) {
            cc.log("<<<===[StartBet] WebSocketManager:", data);
            data.data.forEach(function (player) {
                var oldPlayer = th.getPlayerById(player.account_id);
                Object.assign(oldPlayer, player);
            });
            _this.dispatchEvent("StartBet", data);
        });

        //闲家选倍数 通知
        th.ws.addHandler("UpdateAccountMultiples", function (_ref15) {
            var data = _ref15.data;

            cc.log("<<<===[UpdateAccountMultiples] WebSocketManager:", data);
            var player = th.getPlayerById(data.account_id);
            player.multiples = data.multiples;
            _this.dispatchEvent("UpdateAccountMultiples", player);
        });

        //显示牌
        th.ws.addHandler("StartShow", function (data) {
            cc.log("<<<===[StartShow] WebSocketManager:", data);
            data.data.forEach(function (player) {
                var oldPlayer = th.getPlayerById(player.account_id);
                Object.assign(oldPlayer, player);
            });
            _this.dispatchEvent("StartShow", data);
        });

        //摊牌
        th.ws.addHandler("UpdateAccountShow", function (_ref16) {
            var data = _ref16.data;

            cc.log("<<<===[UpdateAccountShow] WebSocketManager:", data);
            var player = th.getPlayerById(data.account_id);
            Object.assign(player, data);
            _this.dispatchEvent("UpdateAccountShow", player);
        });

        //结果
        th.ws.addHandler("Win", function (_ref17) {
            var data = _ref17.data;

            cc.log("<<<===[Win] WebSocketManager:", data);
            Object.assign(th.room, data);
            _this.dispatchEvent("Win", data);
        });

        //战绩
        th.ws.addHandler("getScoreBoard", function (_ref18) {
            var data = _ref18.data;

            cc.log("<<<===[getScoreBoard] WebSocketManager:", data);
            //Object.assign(th.room, data);
            _this.dispatchEvent("getScoreBoard", data);
        });

        //战绩明细
        th.ws.addHandler("getScoreDetail", function (_ref19) {
            var data = _ref19.data;

            cc.log("<<<===[getScoreDetail] WebSocketManager:", data);
            //Object.assign(th.room, data);
            _this.dispatchEvent("getScoreDetail", data);
        });

        //复制URL
        th.ws.addHandler("getCopyUrl", function (_ref20) {
            var data = _ref20.data;

            cc.log("<<<===[getCopyUrl] WebSocketManager:", data);
            th.room.copyurl = data.url;
            _this.dispatchEvent("getCopyUrl", data);
        });

        //解散房间
        th.ws.addHandler("BreakRoom", function (_ref21) {
            var data = _ref21.data;

            cc.log("<<<===[BreakRoom] WebSocketManager:", data);
            Object.assign(th.room, data);
            _this.dispatchEvent("BreakRoom", data);
        });

        //设置暗号
        th.ws.addHandler("setIndividuality", function (_ref22) {
            var data = _ref22.data;

            cc.log("<<<===[setIndividuality] WebSocketManager:", data);
            Object.assign(th.myself, data);
            _this.dispatchEvent("setIndividuality", data);
        });

        th.ws.addHandler("StartLimitTime", function (_ref23) {
            var data = _ref23.data;

            cc.log("<<<===[StartLimitTime] WebSocketManager:", data);
            _this.dispatchEvent("StartLimitTime", data);
        });
        th.ws.addHandler("BroadcastVoice", function (_ref24) {
            var data = _ref24.data;

            cc.log("<<<===[BroadcastVoice] WebSocketManager:", data);
            _this.dispatchEvent("BroadcastVoice", data);
        });

        //=========================================================
        //炸金花消息写在这下面。
    },
    /*
    connectApiServer: function({ ip, port, namespace }) {
        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = `ws://${ip}:${port}/${namespace}`;
        th.ws.connect(
            () => {
                this.dispatchEvent("api_connect_success");
                cc.log(
                    `[连接成功] WebSocketManager :${ip}:${port}/${namespace}`
                );
                th.wc.show("正在获取TOKEN...");
                let params = {
                    operation: "getToken",
                    data: { code: th.args.code }
                };
                cc.log("===>>>[getToken] WebSocketManager:", params);
                th.ws.send(JSON.stringify(params));
            },
            () => {
                cc.log(
                    `[连接失败] WebSocketManager :${ip}:${port}/${namespace}`
                );
                th.alert.show("提示", "连接失败");
            }
        );
    },
    */
    connectGameServer: function connectGameServer(_ref25, callback) {
        var _this2 = this;

        var ip = _ref25.ip,
            port = _ref25.port,
            namespace = _ref25.namespace;

        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = "ws://" + ip + ":" + port + "/" + namespace;
        th.gametype = "nn";
        th.ws.connect(function () {
            _this2.dispatchEvent("game_connect_success");
            callback();
            cc.log("===WebSocketManager \u8FDE\u63A5\u6210\u529F:" + ip + ":" + port + "/" + namespace + "===");
        }, function () {
            cc.log("===WebSocketManager \u8FDE\u63A5\u5931\u8D25:" + ip + ":" + port + "/" + namespace + "===");
            th.alert.show("提示", "\u8FDE\u63A5\u5931\u8D25:" + ip + ":" + port + "/" + namespace);
        });
    }
});

cc._RF.pop();