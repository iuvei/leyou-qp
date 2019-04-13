(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/GameNN.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a6e34fDC+BAcpoXQQTJsDLe', 'GameNN', __filename);
// scripts/components/GameNN.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

cc.Class({
    extends: cc.Component,

    properties: {
        seatPrefab: cc.Prefab,

        nodeSeats: [cc.Node], //所有座位的NODE
        componentSeats: [cc.Component], //所有座位的组件
        nodePokers: [cc.Node], //所有座位的扑克

        nodeOptions: cc.Node,
        nodeCountdown: cc.Node,
        lblCountdown: cc.Label,

        lblRoomInfo: cc.Label,
        btnMtp1: cc.Button,
        btnMtp2: cc.Button,
        btnMtp3: cc.Button,
        btnMtp4: cc.Button,
        btnBuqiang: cc.Button,
        btnReady: cc.Button,

        _countdownEndTime: 0, //倒计时剩余时间
        _isPlay: true //用来播放倒计时声音
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        cc.log("GameNN onLoad");

        /*
        const cvs = this.node.getComponent(cc.Canvas);
        const {
            width: designWidth,
            height: designHeight
        } = cc.view.getDesignResolutionSize();
        const {
            width: visibleWidth,
            height: visibleHeight
        } = cc.view.getFrameSize();
        cc.log(visibleHeight / visibleWidth, designHeight / designWidth);
        cc.log(visibleHeight / visibleWidth > designHeight / designWidth);
        if (visibleHeight / visibleWidth > designHeight / designWidth) {
            cvs.fitWidth = true;
            cvs.fitHeight = false;
            cc.log("等比拉伸宽度到全屏：FitWidth");
        } else if (visibleHeight / visibleWidth < designHeight / designWidth) {
            cvs.fitWidth = false;
            cvs.fitHeight = true;
            cc.log("等比拉伸高度到全屏：FitHeight");
        } else {
            cvs.fitWidth = true;
            cvs.fitHeight = true;
            cc.log("按比例放缩，全部展示不裁剪：ShowALl");
        }
         this.label.string = cc.view.getFrameSize();
         //cvs.fitHeight = true;
        //cvs.fitWidth = true;
        */
        this.initEventHandlers();
        this.initView();

        //this.intiPoker();
    },
    onEnable: function onEnable() {
        cc.log("GameNN onEnable");
    },
    start: function start() {
        cc.log("GameNN start");
    },
    initEventHandlers: function initEventHandlers() {
        var _this = this;

        cc.log("GameNN initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;

        this.node.on("CreateRoom", function () {
            cc.log("<<<===[JoinRoom] GmaeNN");
        });
        this.node.on("GuestRoom", function () {
            cc.log("<<<===[GuestRoom] GmaeNN");
        });
        this.node.on("AllGamerInfo", function () {
            cc.log("<<<===[AllGamerInfo] GmaeNN");
        });
        this.node.on("AllGuestInfo", function () {
            cc.log("<<<===[AllGuestInfo] GmaeNN");
        });
        this.node.on("UpdateGamerInfo", function (player) {
            cc.log("<<<===[UpdateGamerInfo] GmaeNN:", player);
            _this.initSingleSeat(player);
        });
        this.node.on("UpdateGuestInfo", function () {
            cc.log("<<<===[UpdateGuestInfo] GmaeNN");
        });
        this.node.on("UpdateAccountStatus", function (player) {
            cc.log("<<<===[UpdateAccountStatus] GmaeNN");
            _this.initSingleSeat(player);
        });
    },
    initView: function initView() {
        cc.log("GameNN initView");
        this.nodeCountdown.active = false;
        this.initRoomInfo();
        this.initSeat();
        this.refreshOptions();
    },
    intiPoker: function intiPoker() {
        var pokers = ["A1"];

        for (var i = 0; i < pokers.length; i++) {
            var poker = th.pokerManager.getPokerSpriteById(pokers[i]);
            this.pokersNode.addChild(poker);
        }
    },
    refreshOptions: function refreshOptions() {
        if (!th.myself.isPlayer) {
            //游客直接不显示
            this.nodeOptions.active = false;
        } else {
            //准备按钮
            var player = th.getMyselfPlayer();
            var showBtnReady = (player.account_status == 1 || player.account_status == 2) && th.room.can_break == 1 && th.room.game_num != th.room.total_num && th.room.banker_mode == 5 && player.is_banker == 1;
            this.btnReady.node.acitve = showBtnReady;
            //1倍
            //2倍
            //4倍
            //不抢
            var showBtnMtp = th.room.banker_mode == 2;
            this.btnMtp1.node.acitve = showBtnMtp;
            this.btnMtp2.node.acitve = showBtnMtp;
            this.btnMtp3.node.acitve = showBtnMtp;
            this.btnBuqiang.node.acitve = showBtnMtp;

            cc.log(showBtnReady, showBtnMtp);
        }
    },
    initRoomInfo: function initRoomInfo() {
        this.lblRoomInfo.string = th.room.game_num + "/" + th.room.total_num + "\u5C40 \u5E95\u5206\uFF1A" + th.room.base_score + "\u5206";
    },
    initSeat: function initSeat() {
        var seatsxy = th.getSeatXY();
        for (var _i = 0; _i < seatsxy.length; _i++) {
            var _seatsxy$_i = _slicedToArray(seatsxy[_i], 2),
                x = _seatsxy$_i[0],
                y = _seatsxy$_i[1];

            var seat = cc.instantiate(this.seatPrefab);
            seat.x = x;
            seat.y = y;
            this.node.addChild(seat);
            this.nodeSeats.push(seat);
            this.componentSeats.push(seat.getComponent("Seat"));
            this.nodePokers.push(seat.getChildByName("info").getChildByName("pokers"));
        }
        var players = th.room.players;
        for (var i = 0; i < players.length; ++i) {
            this.initSingleSeat(players[i]);
        }
    },

    initSingleSeat: function initSingleSeat(player) {
        var index = th.getLocalIndex(player.serial_num - 1);
        cc.log(player.nickname + " local index = " + index + "  serial_num=" + (player.serial_num - 1));
        this.componentSeats[index].setInfo(player.account_id, player.nickname, player.account_score, player.headimgurl, player.sex);
        this.componentSeats[index].setOffline(player.online_status == "1" ? false : true);
        this.componentSeats[index].setBanker(player.is_banker == "1" ? true : false);
        this.componentSeats[index].setScore(player.account_score);
    },
    onReadyClicked: function onReadyClicked() {
        cc.log("onReadyClicked");
    },
    onMultiplesClicked: function onMultiplesClicked(target, value) {
        cc.log("onMultiplesClicked");
    },
    onBackClicked: function onBackClicked(targer) {
        th.wc.show("正在加载。。。");
        cc.director.loadScene("Hall", function () {
            th.wc.hide();
        });
    },

    onChatClicked: function onChatClicked(targer) {
        this.setCountdown(10);
    },
    onMoreClicked: function onMoreClicked(targer) {
        var seat = this.componentSeats[0];
        seat.setChat("伙右伙历伙");
        seat.setReady(true);
        seat.setOffline(true);
        seat.setScore("-8888");
        seat.setUserName("我的名字");
        seat.setCountdown(10);
    },
    onThemeClicked: function onThemeClicked(targer) {
        var seat = this.componentSeats[0];
        seat.setChat("伙右伙历伙伙右伙历伙");
        seat.setReady(false);
        seat.setOffline(true);
        seat.setScore("+8888");
        seat.setCountdown(0);
    },
    onLookClicked: function onLookClicked(targer) {},
    showPokers: function showPokers(pokerIds) {
        //let pokerIds = ["-A9", "-A10", "-A11", "-A12", "-A13"];
        //生成牌
        for (var i = 0; i < this.nodePokers.length; i++) {
            var basePokers = this.nodePokers[i];
            basePokers.removeAllChildren();

            var pokers = [];
            for (var pi = 0; pi < pokerIds.length; pi++) {
                var poker = th.pokerManager.getPokerSpriteById(pokerIds[pi]);
                poker.scale = 0.65;
                //poker.x = (seat.x > 0 ? -250 : 45) + basePoker.y + pi * 30;
                poker.position = basePokers.convertToNodeSpaceAR(cc.v2(375, 603 + 60));
                basePokers.addChild(poker);
                pokers.push(poker);
            }
        }
        //发牌效果
        for (var _i2 = 0; _i2 < pokerIds.length; _i2++) {
            for (var j = 0; j < this.nodeSeats.length; j++) {
                var seat = this.nodeSeats[j];
                var _basePokers = this.nodePokers[j];
                var _pokers = _basePokers.children;
                var _poker = _pokers[_i2];
                var isMyself = j == this.nodeSeats.length - 1;
                (function (poker, delay, x, y, isMyself) {
                    //cc.log("delay:", delay, x, y, isMyself);
                    if (isMyself) {
                        poker.runAction(cc.sequence(cc.delayTime(delay), cc.spawn(cc.moveTo(0.2, cc.v2(x, y)), cc.scaleTo(0.2, 1))));
                    } else {
                        poker.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(0.2, cc.v2(x, y))));
                    }
                })(_poker, 0.1 + _i2 * 0.04 * this.nodeSeats.length + j * 0.04, (isMyself ? 100 : seat.x > 0 ? -210 : 90) + _basePokers.y + _i2 * (isMyself ? 110 : 30), isMyself ? -25 : 0, isMyself);
            }
        }
    },
    setCountdown: function setCountdown(val) {
        var _this2 = this;

        var num = Number(val);
        cc.log("countdown num:", num > 0);
        this.nodeCountdown.active = num > 0 ? true : false;
        this._countdownEndTime = Date.now() + num * 1000;
        this._alertStartTime = Date.now() + (num - 3) * 1000;
        this._isPlay = false;

        this.scheduleOnce(function () {
            if (_this2._countdownEndTime <= Date.now()) {
                _this2.nodeCountdown.active = false;
            }
        }, num + 0.1);
    },

    update: function update(dt) {
        var now = Date.now();
        if (this._countdownEndTime > now) {
            var miao = Math.ceil((this._countdownEndTime - now) / 1000);
            this.lblCountdown.string = miao;
        }
        if (this._alertStartTime < now && !this._isPlay) {
            this._isPlay = true;
            th.audioManager.playSFX("timeup_alarm.mp3");
        }
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
        //# sourceMappingURL=GameNN.js.map
        