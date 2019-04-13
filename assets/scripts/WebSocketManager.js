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
            Object.assign(
                th.room.guests.find(
                    player => player.account_id == data.account_id
                ),
                data
            );
            this.dispatchEvent("UpdateGuestInfo", data);
        });

        //更新玩家状态信息
        th.ws.addHandler("UpdateAccountStatus", ({ data }) => {
            cc.log("<<<===[UpdateAccountStatus] WebSocketManager:", data);
            let player = th.room.players.find(
                player => player.account_id == data.account_id
            );
            if (player) {
                Object.assign(player, data);
                this.dispatchEvent("UpdateAccountStatus", player);
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
