cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        cc.log("Global onLoad....................");
        window.th = window.th || {};

        this.initManager();
        this.urlParse();

        const { width, height } = this.node.getContentSize();
        th.wsurl = "ws://47.96.177.207:10000/api"; //websocket连接地址
        th.width = width; //宽度
        th.height = height; //高度
        th.myself = {
            account_id: "000000",
            nickname: "游客", //名字
            headimgurl: "", //头像
            account_ticket: 0, //房卡
            phone: "--------",
            isPlayer: false, //是不是玩家（不是玩家就是游客）， false=游客
            needLookCount: 0 //只用为0才能点击摊牌  会在收到 ShowCard 设置
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
            "6": [
                [-305, -420],
                [305, -100],
                [305, 200],
                [-100, 485],
                [-305, 200],
                [-305, -100]
            ],
            "9": [
                [-305, -420],
                [305, -200],
                [305, 0],
                [305, 200],
                [305, 400],
                [-305, 400],
                [-305, 200],
                [-305, 0],
                [-305, -200]
            ],
            "10": [
                [-305, -420],
                [305, -220],
                [305, -40],
                [305, 140],
                [305, 320],
                [-100, 485],
                [-305, 320],
                [-305, 140],
                [-305, -40],
                [-305, -220]
            ],
            "12": [
                [-305, -420],
                [305, -260],
                [305, -110],
                [305, 40],
                [305, 190],
                [305, 340],
                [-100, 485],
                [-305, 340],
                [-305, 190],
                [-305, 40],
                [-305, -110],
                [-305, -260]
            ],
            "13": [
                [-305, -420],
                [305, -260],
                [305, -110],
                [305, 40],
                [305, 190],
                [305, 340],
                [305, 485],
                [-305, 485],
                [-305, 340],
                [-305, 190],
                [-305, 40],
                [-305, -110],
                [-305, -260]
            ]
        };
        th.getNiuIndex = function(cardType, comboPoint) {
            cardType = Number(cardType);
            let index = 0;
            if (cardType == 1) {
                index = 0;
            } else if (cardType >= 4 && cardType <= 14) {
                index = cardType + 6;
            } else {
                index = comboPoint;
            }
            return index;
        };
        th.getSeatXY = function() {
            return th.seatxy[this.room.max_count.toString()];
        };
        th.getGuestById = function(account_id) {
            return this.room.guests.find(
                guest => guest.account_id == account_id
            );
        };
        th.getPlayerById = function(account_id) {
            return this.room.players.find(
                player => player.account_id == account_id
            );
        };
        th.getLocalIndex = function(index) {
            if (!th.myself.isPlayer) {
                return 0;
            }
            let total = Number(th.room.max_count);
            let rindex =
                (Number(index) - th.getMyselfSeatIndex() + total) % total;
            return rindex;
        };
        th.getSeatIndexById = function(account_id) {
            if (!th.myself.isPlayer) {
                return 0;
            }
            let player = this.getPlayerById(account_id);
            return player.serial_num - 1;
        };
        th.getMyselfSeatIndex = function() {
            if (!th.myself.isPlayer) {
                return 0;
            }
            let player = this.getPlayerById(th.myself.account_id);
            return Number(player.serial_num) - 1;
        };
        th.getMyselfPlayer = function() {
            if (!th.myself.isPlayer) {
                return null;
            }
            let player = this.getPlayerById(th.myself.account_id);
            return player;
        };
        th.getMyselfLocalIndex = function() {
            if (!th.myself.isPlayer) {
                return 0;
            }
            let player = this.getMyselfPlayer();
            return this.getLocalIndex(player.serial_num - 1);
        };
        th.getBankerPlayer = function() {
            return this.room.players.find(player => player.is_banker == 1);
        };
        th.initRoom = function() {
            if (th.room.banker_mode == 1) {
                th.myself.needLookCount = 2;
            }
        };
        th.clear = function() {
            th.room.room_status = 1;
            th.room.players.forEach(player => {
                player.account_status = 1;
                player.banker_multiples = "";
                player.multiples = 0;
                player.cards = [];
                player.card_type = 0;
                player.combo_array = [];
                player.combo_point = 0;
                player.is_banker = 0;
            });
        };
    },
    initManager() {
        th.ws = require("WebSocket");

        const AudioManager = require("AudioManager");
        th.audioManager = new AudioManager();
        th.audioManager.init();

        //播放背景音乐
        th.audioManager.playBGM("background.mp3");

        const WebSocketManager = require("WebSocketManager");
        th.webSocketManager = new WebSocketManager();
        th.webSocketManager.initHandlers();
    },
    urlParse() {
        let params = { code: 123 };
        if (window.location == null) {
            return params;
        }
        let name, value;
        let location = window.location.href; //取得整个地址栏
        let num = location.indexOf("?");
        let paramsStr = location.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        let arr = paramsStr.split("&"); //各个参数放到数组里
        for (let i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }
        cc.log("Params:", params);
        th.href = location.substr(0, location.indexOf("?"));
        th.args = params;
    }
});
