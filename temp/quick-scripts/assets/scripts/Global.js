(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Global.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7c6aas2kcFG5KBfpRPpUiDm', 'Global', __filename);
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
            max_count: 0, //总人数
            copyurl: null //要copy的地地址
        };
        //座位坐标
        th.seatxy = {
            "6": [[-305, -420], [305, -100], [305, 200], [-100, 485], [-305, 200], [-305, -100]],
            "9": [[-305, -420], [305, -200], [305, 0], [305, 200], [305, 400], [-305, 400], [-305, 200], [-305, 0], [-305, -200]],
            "10": [[-305, -420], [305, -220], [305, -40], [305, 140], [305, 320], [-100, 485], [-305, 320], [-305, 140], [-305, -40], [-305, -220]],
            "12": [[-305, -420], [305, -260], [305, -110], [305, 40], [305, 190], [305, 340], [-100, 485], [-305, 340], [-305, 190], [-305, 40], [-305, -110], [-305, -260]],
            "13": [[-305, -420], [305, -260], [305, -110], [305, 40], [305, 190], [305, 340], [305, 485], [-305, 485], [-305, 340], [-305, 190], [-305, 40], [-305, -110], [-305, -260]]
        };
        th.getNiuIndex = function (cardType, comboPoint) {
            cardType = Number(cardType);
            var index = 0;
            if (cardType == 1) {
                index = 0;
            } else if (cardType >= 4 && cardType <= 14) {
                index = cardType + 6;
            } else {
                index = comboPoint;
            }
            return index;
        };
        th.getSeatXY = function () {
            return th.seatxy[this.room.max_count.toString()];
        };
        th.getGuestById = function (account_id) {
            return this.room.guests.find(function (guest) {
                return guest.account_id == account_id;
            });
        };
        th.getPlayerById = function (account_id) {
            return this.room.players.find(function (player) {
                return player.account_id == account_id;
            });
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
            var player = this.getPlayerById(account_id);
            return player.serial_num - 1;
        };
        th.getMyselfSeatIndex = function () {
            if (!th.myself.isPlayer) {
                return 0;
            }
            var player = this.getPlayerById(th.myself.account_id);
            return Number(player.serial_num) - 1;
        };
        th.getMyselfPlayer = function () {
            if (!th.myself.isPlayer) {
                return null;
            }
            var player = this.getPlayerById(th.myself.account_id);
            return player;
        };
        th.getMyselfLocalIndex = function () {
            if (!th.myself.isPlayer) {
                return 0;
            }
            var player = this.getMyselfPlayer();
            return this.getLocalIndex(player.serial_num - 1);
        };
        th.getBankerPlayer = function () {
            return this.room.players.find(function (player) {
                return player.is_banker == 1;
            });
        };
        th.initRoom = function () {
            if (th.room.banker_mode == 1) {
                th.myself.needLookCount = 2;
            } else if (th.room.banker_mode == 2) {
                th.myself.needLookCount = 1;
            }
        };
        th.clear = function () {
            th.room.room_status = 1;
            th.room.players.forEach(function (player) {
                player.account_status = 1;
                player.banker_multiples = "";
                player.multiples = 0;
                player.cards = [];
                player.card_type = 0;
                player.combo_array = [];
                player.combo_point = 0;
                player.is_banker = 0;
            });
            th.initRoom();
        };
        th.getRoomCopyUrl = function () {
            //先把要COPY的房间URL请求回来
            var params = {
                operation: "getCopyUrl",
                account_id: th.myself.account_id,
                session: th.sign,
                data: {
                    roomId: th.room.room_number,
                    type: th.gametype,
                    url: th.href
                }
            };
            cc.log("===>>>[getCopyUrl] Global:", params);
            th.ws.send(JSON.stringify(params));
        };
        th.webCopyString = function (content) {
            //确保在浏览器中
            if (cc.sys.isBrowser) {
                var input = content + "";
                var el = document.createElement("textarea");
                el.value = input;
                el.setAttribute("readonly", "");
                el.style.contain = "strict";
                el.style.position = "absolute";
                el.style.left = "-9999px";
                el.style.fontSize = "12pt"; // Prevent zooming on iOS

                var selection = getSelection();
                var originalRange = false;
                if (selection.rangeCount > 0) {
                    originalRange = selection.getRangeAt(0);
                }
                document.body.appendChild(el);
                el.select();
                el.selectionStart = 0;
                el.selectionEnd = input.length;
                var success = false;
                try {
                    success = document.execCommand("copy");
                } catch (err) {}

                document.body.removeChild(el);
                if (originalRange) {
                    selection.removeAllRanges();
                    selection.addRange(originalRange);
                }
                return success;
            }
            return false;
        };
        th.webCaptureScreen = function () {
            if (cc.sys.isBrowser) {
                cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
                    // 获取base64截图
                    var canvas = document.getElementById("GameCanvas");
                    var base64 = canvas.toDataURL();

                    /*
                    // 1.用cc.Sprite组件显示截图
                    const image = new Image();
                    image.src = base64;
                    image.onload = () => {
                        const texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        const spriteFrame = new cc.SpriteFrame(texture);
                        // this.img是cc.Sprite组件.
                        this.img.spriteFrame = spriteFrame;
                    }
                    */

                    // 2.用http的img显示截图（可以保存图片到本地）

                    var image = new Image();
                    image.src = base64;
                    var body = document.createElement("body");
                    body.append(image);
                    document.body = body;
                    image.setAttribute("width", "100%");
                    image.setAttribute("height", "100%");
                });
            }
        };
    },
    initManager: function initManager() {
        th.ws = require("WebSocket");

        var AudioManager = require("AudioManager");
        th.audioManager = new AudioManager();
        th.audioManager.init();

        //播放背景音乐
        th.audioManager.playBGM("background.mp3");

        var WebSocketManager = require("WebSocketManager");
        th.webSocketManager = new WebSocketManager();
        th.webSocketManager.initHandlers();
    },
    urlParse: function urlParse() {
        var params = { code: 123 };
        if (window.location == null) {
            return params;
        }
        var name = void 0,
            value = void 0;
        var location = window.location.href; //取得整个地址栏
        var num = location.indexOf("?");
        var paramsStr = location.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        var arr = paramsStr.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
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
        //# sourceMappingURL=Global.js.map
        