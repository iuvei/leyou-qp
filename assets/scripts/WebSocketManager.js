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
        th.ws.msgprefn = function({ result, result_message }) {
            if (result != 0) {
                th.wc.hide();
                th.alert.show(
                    "提示",
                    th.args.debug ? result_message : "系统维护更新"
                );
                return false;
            }
            return true;
        };
        //获取TOKEN
        th.ws.addHandler("getToken", ({ data }) => {
            cc.log("<<<===[getToken] WebSocketManager:", data);
            this.dispatchEvent("getToken", data);
            th.wc.show("正在获生成签名...");
            th.token = data.t;
            let params = {
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
        th.ws.addHandler("makeSign", ({ data }) => {
            cc.log("<<<===[makeSign] WebSocketManager:", data);
            this.dispatchEvent("makeSign", data);
            th.wc.show("正在用户信息...");
            th.sign = data.sign;
            let params = {
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
        th.ws.addHandler("pullUserInfo", ({ data }) => {
            cc.log("<<<===[pullUserInfo] WebSocketManager:", data);
            this.dispatchEvent("pullUserInfo", data);
            th.wc.show("正在加载游戏...");
            Object.assign(th.myself, data);
            cc.director.loadScene("Hall", () => {
                th.wc.hide();
            });
        });

        //创建房间
        th.ws.addHandler("CreateRoom", ({ data }) => {
            cc.log("<<<===[CreateRoom] WebSocketManager:", data);
            th.wc.show("正在加请求房间数据...");
            Object.assign(th.room, data);
            this.dispatchEvent("CreateRoom", data);
            let params = {
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
        th.ws.addHandler("PrepareJoinRoom", ({ data }) => {
            cc.log("<<<===[PrepareJoinRoom] WebSocketManager:", data);
            th.room = Object.assign(th.room, data);
            this.dispatchEvent("PrepareJoinRoom", data);
            th.wc.hide();
        });

        //加入房间
        th.ws.addHandler("JoinRoom", ({ data }) => {
            cc.log("<<<===[JoinRoom] WebSocketManager:", data);
            Object.assign(th.room, data);
            let sceneName = th.gametype == "nn" ? "GameNN" : "GameZJH";
            cc.director.loadScene(sceneName, () => {
                th.wc.hide();
            });
            this.dispatchEvent("JoinRoom", data);
        });
        //加入观战
        th.ws.addHandler("GuestRoom", ({ data }) => {
            cc.log("<<<===[GuestRoom] WebSocketManager:", data);
            Object.assign(th.room, data);
            let sceneName = th.gametype == "nn" ? "GameNN" : "GameZJH";
            cc.director.loadScene(sceneName, () => {
                th.wc.hide();
            });
            this.dispatchEvent("GuestRoom", data);
        });

        //到游戏人员信息
        th.ws.addHandler("AllGamerInfo", ({ data }) => {
            cc.log("<<<===[AllGamerInfo] WebSocketManager:", data);
            th.room.players = data;
            th.myself.isPlayer =
                data.findIndex(
                    player => player.account_id == th.myself.account_id
                ) > -1
                    ? true
                    : false;
            this.dispatchEvent("AllGamerInfo", data);
        });
        //观战人员信息
        th.ws.addHandler("AllGuestInfo", ({ data }) => {
            cc.log("<<<===[AllGuestInfo] WebSocketManager:", data);
            th.room.guests = data;
            this.dispatchEvent("AllGuestInfo", data);
        });

        //更新游戏人员信息
        th.ws.addHandler("UpdateGamerInfo", ({ data }) => {
            cc.log("<<<===[UpdateGamerInfo] WebSocketManager:", data);
            let player = th.room.players.find(
                player => player.account_id == data.account_id
            );
            if (player) {
                Object.assign(player, data);
                this.dispatchEvent("UpdateGamerInfo", player);
            } else {
                th.room.players.push(data);
                this.dispatchEvent("UpdateGamerInfo", data);
            }
        });

        //增加观战 ,更新观战人员信息
        th.ws.addHandler("UpdateGuestInfo", ({ data }) => {
            cc.log("<<<===[UpdateGuestInfo] WebSocketManager:", data);
            let guest = th.getGuestById(data.account_id);
            if (guest) {
                Object.assign(guest, data);
                this.dispatchEvent("UpdateGuestInfo", guest);
            } else {
                th.room.guests.push(data);
                this.dispatchEvent("UpdateGuestInfo", data);
            }
        });

        //更新玩家状态信息
        th.ws.addHandler("UpdateAccountStatus", ({ data }) => {
            cc.log("<<<===[UpdateAccountStatus] WebSocketManager:", data);
            let player = th.getPlayerById(data.account_id);
            if (player) {
                Object.assign(player, data);
                cc.log("UpdateAccountStatus player:", player);
                this.dispatchEvent("UpdateAccountStatus", player);
            }
        });

        //开始游戏
        th.ws.addHandler("GameStart", data => {
            cc.log("<<<===[GameStart] WebSocketManager:", data);
            let { game_num, limit_time, data: rdata } = data;
            th.room.game_num = game_num;
            th.room.limit_time = limit_time;
            rdata.forEach(player => {
                let oldPlayer = th.getPlayerById(player.account_id);
                Object.assign(oldPlayer, player);
                this.dispatchEvent("UpdateAccountStatus", oldPlayer);
            });
            this.dispatchEvent("GameStart", data);
        });
        //我的牌
        th.ws.addHandler("MyCards", ({ data }) => {
            cc.log("<<<===[MyCards] WebSocketManager:", data);
            let player = th.getPlayerById(data.account_id);
            player.cards = data.cards;
            this.dispatchEvent("MyCards", player);
        });
        //开始游戏,闲家选倍数
        th.ws.addHandler("StartBet", data => {
            cc.log("<<<===[StartBet] WebSocketManager:", data);
            data.data.forEach(player => {
                let oldPlayer = th.getPlayerById(player.account_id);
                Object.assign(oldPlayer, player);
            });
            this.dispatchEvent("StartBet", data);
        });

        //闲家选倍数 通知
        th.ws.addHandler("UpdateAccountMultiples", ({ data }) => {
            cc.log("<<<===[UpdateAccountMultiples] WebSocketManager:", data);
            let player = th.getPlayerById(data.account_id);
            player.multiples = data.multiples;
            this.dispatchEvent("UpdateAccountMultiples", player);
        });

        //显示牌
        th.ws.addHandler("StartShow", data => {
            cc.log("<<<===[StartShow] WebSocketManager:", data);
            data.data.forEach(player => {
                let oldPlayer = th.getPlayerById(player.account_id);
                Object.assign(oldPlayer, player);
            });
            this.dispatchEvent("StartShow", data);
        });

        //摊牌
        th.ws.addHandler("UpdateAccountShow", ({ data }) => {
            cc.log("<<<===[UpdateAccountShow] WebSocketManager:", data);
            let player = th.getPlayerById(data.account_id);
            Object.assign(player, data);
            this.dispatchEvent("UpdateAccountShow", player);
        });

        //结果
        th.ws.addHandler("Win", ({ data }) => {
            cc.log("<<<===[Win] WebSocketManager:", data);
            Object.assign(th.room, data);
            this.dispatchEvent("Win", data);
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
    connectGameNNServer: function({ ip, port, namespace }, callback) {
        th.ws.close();
        th.ws.ip = ip;
        th.ws.port = port;
        th.ws.addr = `ws://${ip}:${port}/${namespace}`;
        th.gametype = "nn";
        th.ws.connect(
            () => {
                this.dispatchEvent("game_connect_success");
                callback();
                cc.log(
                    `===WebSocketManager 连接成功:${ip}:${port}/${namespace}===`
                );
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
