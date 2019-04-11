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
            id: "000000",
            name: "游客",
            headImgUrl: "",
            fangka: 0,
            phone: "--------"
        };
        th.numberOfPeople = 13; //人数
        //座位坐标
        th.seatxy = {
            "6": [[305, -100], [305, 200], [-100, 485], [-305, 200], [-305, -100], [-305, -420]],
            "9": [[305, -200], [305, 0], [305, 200], [305, 400], [-305, 400], [-305, 200], [-305, 0], [-305, -200], [-305, -420]],
            "10": [[305, -220], [305, -40], [305, 140], [305, 320], [-100, 485], [-305, 320], [-305, 140], [-305, -40], [-305, -220], [-305, -420]],
            "12": [[305, -260], [305, -110], [305, 40], [305, 190], [305, 340], [-100, 485], [-305, 340], [-305, 190], [-305, 40], [-305, -110], [-305, -260], [-305, -420]],
            "13": [[305, -260], [305, -110], [305, 40], [305, 190], [305, 340], [305, 485], [-305, 485], [-305, 340], [-305, 190], [-305, 40], [-305, -110], [-305, -260], [-305, -420]]
        };
        th.getSeatXY = function () {
            return th.seatxy[this.numberOfPeople.toString()];
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