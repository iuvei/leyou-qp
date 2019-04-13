"use strict";
cc._RF.push(module, '7c6aas2kcFG5KBfpRPpUiDm', 'Global');
// scripts/Global.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        cc.log("Global onLoad....................");
        window.th = window.th || {};

        this.initManager();
        this.urlParse();

        var _node$getContentSize = this.node.getContentSize(),
            width = _node$getContentSize.width,
            height = _node$getContentSize.height;

        th.wsurl = "ws://47.96.177.207:10000/api"; //websocket连接地址
        th.width = width; //宽度
        th.height = height; //高度
        th.myself = {
            account_id: "000000",
            nickname: "游客", //名字
            headimgurl: "", //头像
            account_ticket: 0, //房卡
            phone: "--------",
            isPlayer: false //是不是玩家（不是玩家就是游客）， false=游客
        };
        th.token = null;
        th.sign = null;
        th.gametype = null; //游戏类型 nn,zjh
        th.room = {
            room_id: null,
            room_number: null,
            players: [], //游戏人员列表
            guests: [], //观战人员列表
            max_count: 0 //总人数
        };
        //座位坐标
        th.seatxy = {
            "6": [[-305, -420], [305, -100], [305, 200], [-100, 485], [-305, 200], [-305, -100]],
            "9": [[-305, -420], [305, -200], [305, 0], [305, 200], [305, 400], [-305, 400], [-305, 200], [-305, 0], [-305, -200]],
            "10": [[-305, -420], [305, -220], [305, -40], [305, 140], [305, 320], [-100, 485], [-305, 320], [-305, 140], [-305, -40], [-305, -220]],
            "12": [[-305, -420], [305, -260], [305, -110], [305, 40], [305, 190], [305, 340], [-100, 485], [-305, 340], [-305, 190], [-305, 40], [-305, -110], [-305, -260]],
            "13": [[-305, -420], [305, -260], [305, -110], [305, 40], [305, 190], [305, 340], [305, 485], [-305, 485], [-305, 340], [-305, 190], [-305, 40], [-305, -110], [-305, -260]]
        };
        th.getSeatXY = function () {
            return th.seatxy[this.room.max_count.toString()];
        };

        th.getLocalIndex = function (index) {
            if (!th.myself.isPlayer) {
                return 0;
            }
            var total = Number(th.room.max_count);
            var rindex = (Number(index) - th.getMyselfSeatIndex() + total) % total;
            return rindex;
        };
        th.getSeatIndexById = function (account_id) {
            if (!th.myself.isPlayer) {
                return 0;
            }
            var player = th.room.players.findIndex(function (player) {
                return player.account_id == account_id;
            });
            return player.serial_num - 1;
        };
        th.getMyselfSeatIndex = function () {
            if (!th.myself.isPlayer) {
                return 0;
            }
            var player = th.room.players.find(function (player) {
                return player.account_id == th.myself.account_id;
            });
            return Number(player.serial_num) - 1;
        };
        th.getMyselfPlayer = function () {
            if (!th.myself.isPlayer) {
                return null;
            }
            var player = th.room.players.find(function (player) {
                return player.account_id == th.myself.account_id;
            });
            return player;
        };
    },
    initManager: function initManager() {
        th.ws = require("WebSocket");

        var AudioManager = require("AudioManager");
        th.audioManager = new AudioManager();
        th.audioManager.init();

        //播放背景音乐
        th.audioManager.playBGM("bg_hall.mp3");

        var WebSocketManager = require("WebSocketManager");
        th.webSocketManager = new WebSocketManager();
        th.webSocketManager.initHandlers();
    },
    urlParse: function urlParse() {
        var params = { code: 123 };
        if (window.location == null) {
            return params;
        }
        var name, value;
        var str = window.location.href; //取得整个地址栏
        var num = str.indexOf("?");
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }
        cc.log("Params:", params);
        th.args = params;
    }
});

cc._RF.pop();