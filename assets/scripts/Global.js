cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        cc.log("Global onLoad....................");
        window.th = window.th || {};

        this.initManager();
        //播放背景音乐
        th.audioManager.playBGM("bg_hall.mp3");
        //设置公共数据
        const { width, height } = this.node.getContentSize();
        //cc.log(`可视窗口 width: ${width} , height: ${height}`);
        th.wsurl = "ws://118.31.10.116:10000/bull"; //websocket连接地址
        th.width = width; //宽度
        th.height = height; //高度
        th.numberOfPeople = 12; //人数
        //座位坐标
        th.seatxy = {
            "6": [
                [305, -100],
                [305, 200],
                [-100, 485],
                [-305, 200],
                [-305, 0],
                [-305, -420]
            ],
            "9": [
                [305, -200],
                [305, 0],
                [305, 200],
                [305, 400],
                [-305, 400],
                [-305, 200],
                [-305, 0],
                [-305, -200],
                [-305, -420]
            ],
            "10": [
                [305, -220],
                [305, -40],
                [305, 140],
                [305, 320],
                [-100, 485],
                [-305, 320],
                [-305, 140],
                [-305, -40],
                [-305, -220],
                [-305, -420]
            ],
            "12": [
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
                [-305, -260],
                [-305, -420]
            ],
            "13": [
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
                [-305, -260],
                [-305, -420]
            ]
        };
        th.getSeatXY = function() {
            return th.seatxy[this.numberOfPeople.toString()];
        };
    },
    initManager() {
        th.ws = require("WebSocket");

        const AudioManager = require("AudioManager");
        th.audioManager = new AudioManager();
        th.audioManager.init();

        const WebSocketManager = require("WebSocketManager");
        th.webSocketManager = new WebSocketManager();
        th.webSocketManager.initHandlers();
    }
});
