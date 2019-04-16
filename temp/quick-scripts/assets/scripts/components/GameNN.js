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

        btnBankerMtp1: cc.Button,
        btnBankerMtp2: cc.Button,
        btnBankerMtp4: cc.Button,

        btnPlayerMtp1: cc.Button,
        btnPlayerMtp2: cc.Button,
        btnPlayerMtp3: cc.Button,
        btnPlayerMtp4: cc.Button,

        btnQiang: cc.Button,
        btnBuqiang: cc.Button,
        btnReady: cc.Button,
        btnShow: cc.Button,

        spriteClickLookPai: cc.Sprite, //点击看牌

        _countdownEndTime: 0, //倒计时剩余时间
        _isPlay: true //用来播放倒计时声音
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        cc.log("GameNN onLoad");
        //自由抢庄需要看牌两次
        this.initEventHandlers();
        this.initView();
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
            cc.log("<<<===[UpdateAccountStatus] GmaeNN", player);
            _this.initSingleSeat(player);
            if (player.account_id == th.myself.account_id) {
                _this.refreshOptions();
                _this.initSingleSeat(player);
            }
        });
        this.node.on("GameStart", function (data) {
            cc.log("<<<===[GameStart] GmaeNN", data);
            _this.initRoomInfo();
            _this.setCountdown(data.limit_time, "游戏开始了");
            _this.refreshOptions();
        });
        this.node.on("MyCards", function (player) {
            cc.log("<<<===[MyCards] GmaeNN", player);
            _this.showPokers();
            _this.refreshOptions();
        });

        //开始游戏,闲家选倍数
        this.node.on("StartBet", function (data) {
            cc.log("<<<===[StartBet] GmaeNN:", data);
            _this.refreshOptions();
            _this.setCountdown(data.limit_time, "投注开始了");
            //抢庄account_ID数据
            //"grab_array": ["31", "18"],
            data.data.forEach(function (player) {
                var oldPlayer = th.getPlayerById(player.account_id);
                _this.initSingleSeat(oldPlayer);
            });

            //TODO
            cc.log("TODO抢庄效果", data.grab_array);
            data.grab_array.forEach(function (account_id, index) {
                _this.scheduleOnce(function () {
                    var player = th.getPlayerById(account_id);
                    var index = th.getLocalIndex(player.serial_num - 1);
                    _this.componentSeats[index].doBlink();
                }, index * 0.3 + 0.1);
            });

            _this.scheduleOnce(function () {
                var player = th.getBankerPlayer();
                var index = th.getLocalIndex(player.serial_num - 1);
                _this.componentSeats[index].doBlink();
                _this.refreshOptions();
            }, data.grab_array.length * 0.3 + (data.grab_array.length == 0 ? 0 : 0.6));
        });

        //闲家选倍数 通知
        this.node.on("UpdateAccountMultiples", function (player) {
            cc.log("<<<===[UpdateAccountMultiples] GmaeNN:", player);
            _this.initSingleSeat(player);
        });

        //显示牌
        this.node.on("StartShow", function (data) {
            cc.log("<<<===[StartShow] GmaeNN:", data);

            _this.refreshOptions();
            //显示我自己的牌
            var player = th.getMyselfPlayer();
            var cards = player.cards;
            var index = th.getLocalIndex(player.serial_num - 1);
            var pokers = _this.nodePokers[index].children;
            cc.log("显示我自己的牌:", player, cards);
            pokers.forEach(function (poker, index) {
                poker.pokerId = cards[index];
            });
            pokers.forEach(function (poker, idx) {
                if (idx >= 3) return;
                poker.runAction(cc.sequence(cc.scaleTo(0.3, 0, 1), cc.callFunc(function (target) {
                    target.addChild(th.pokerManager.getPokerSpriteById(target.pokerId));
                }), cc.scaleTo(0.3, 1, 1), cc.callFunc(function (target) {
                    target.pokerId = -1;
                })));
            });

            _this.setCountdown(data.limit_time, "摊牌开始了");

            data.data.forEach(function (item) {
                var player = th.getPlayerById(item.account_id);
                _this.initSingleSeat(player);
            });
        });

        //摊牌
        this.node.on("UpdateAccountShow", function (player) {
            cc.log("<<<===[UpdateAccountShow] GmaeNN:", player);
            var index = th.getLocalIndex(player.serial_num - 1);
            var nodePoker = _this.nodePokers[index];
            var pokers = nodePoker.children;
            var cards = player.cards;
            //如果不是自己
            if (player.account_id != th.myself.account_id) {
                pokers.forEach(function (poker, index) {
                    poker.addChild(th.pokerManager.getPokerSpriteById(cards[index]));
                });
            }
            _this.showNiuType(player);
        });

        //结果
        this.node.on("Win", function (data) {
            cc.log("<<<===[Win] GmaeNN:", data);
            //赢的人
            //let win = data.winner_array;
            //输的人
            //let lose = data.loser_array;

            var score_board = data.score_board;
            var account_ids = Object.keys(score_board);
            account_ids.forEach(function (account_id) {
                var player = th.getPlayerById(account_id);
                player.account_score = score_board[account_id];
                var index = th.getLocalIndex(player.serial_num - 1);
                _this.componentSeats[index].setScoreAnim(player.account_score);
                //this.initSingleSeat(player);
            });
            cc.log("TODO 赢的效果");

            cc.log("TODO 飞筹码效果");

            _this.scheduleOnce(function () {
                if (th.room.banker_mode == 1) {
                    th.myself.needLookCount = 2;
                }
                th.clear();
                _this.nodePokers.forEach(function (node) {
                    node.removeAllChildren();
                });
                th.room.players.forEach(function (player) {
                    _this.initSingleSeat(player);
                });
                _this.refreshOptions();
            }, 3);
        });
    },
    showNiuType: function showNiuType(player) {
        var index = th.getLocalIndex(player.serial_num - 1);
        var nodeSeat = this.nodeSeats[index];
        var nodePoker = this.nodePokers[index];
        if (player.account_id != th.myself.account_id) {
            //TODO 显示牛几
            var niuType = th.pokerManager.getNiuSprite(player.card_type, player.combo_point);
            niuType.x = nodeSeat.x > 0 ? -160 : 150;
            niuType.y = -20;
            nodePoker.addChild(niuType);
        } else {
            //TODO 显示牛几
            var _niuType = th.pokerManager.getNiuSprite(player.card_type, player.combo_point);
            _niuType.x = 310;
            _niuType.y = 70;
            nodePoker.addChild(_niuType);
        }
        var niuIndex = th.getNiuIndex(player.card_type, player.combo_point);
        var mp3Name = "bull" + niuIndex + ".m4a";
        th.audioManager.playSFX(mp3Name);
    },
    initView: function initView() {
        cc.log("GameNN initView");
        this.nodeCountdown.active = false;
        this.spriteClickLookPai.node.active = false;
        this.initRoomInfo();
        this.initSeat();
        this.initMtpBtn();
        this.refreshOptions();
        if (th.room.room_status == 2) {
            var player = th.getMyselfPlayer();
            player.cards = th.room.cards;
            this.showPokers();
        }
    },
    initMtpBtn: function initMtpBtn() {
        var _th$room$bet_type_arr = _slicedToArray(th.room.bet_type_arr, 4),
            mtp1 = _th$room$bet_type_arr[0],
            mtp2 = _th$room$bet_type_arr[1],
            mtp3 = _th$room$bet_type_arr[2],
            mtp4 = _th$room$bet_type_arr[3];

        this.btnPlayerMtp1.node.getChildByName("lbl_txt").getComponent("cc.Label").string = mtp1 + "倍";
        this.btnPlayerMtp2.node.getChildByName("lbl_txt").getComponent("cc.Label").string = mtp2 + "倍";
        this.btnPlayerMtp3.node.getChildByName("lbl_txt").getComponent("cc.Label").string = mtp3 + "倍";
        this.btnPlayerMtp4.node.getChildByName("lbl_txt").getComponent("cc.Label").string = mtp4 + "倍";
        this.btnBankerMtp1.node.acitve = false;
        this.btnBankerMtp2.node.acitve = false;
        this.btnBankerMtp4.node.acitve = false;
        this.btnPlayerMtp1.node.active = false;
        this.btnPlayerMtp2.node.active = false;
        this.btnPlayerMtp3.node.active = false;
        this.btnPlayerMtp4.node.active = false;

        this.btnPlayerMtp1.node.multiples = mtp1;
        this.btnPlayerMtp2.node.multiples = mtp2;
        this.btnPlayerMtp3.node.multiples = mtp3;
        this.btnPlayerMtp4.node.multiples = mtp4;

        this.btnQiang.node.active = false;
        this.btnBuqiang.node.active = false;
        this.btnReady.node.active = false;
        this.btnShow.node.active = false;
    },
    refreshOptions: function refreshOptions() {
        if (!th.myself.isPlayer) {
            //游客直接不显示
            this.nodeOptions.active = false;
        } else {
            this.nodeOptions.active = true;

            /*
            banker_mode: 1,
            1 = 自由抢庄     抢与不抢（没有倍数）都不抢或者都抢随机一个    选倍数（不是庄选）    开牌
            2 = 明牌抢庄
            3 = 转庄牛牛,牛牛上庄
            4 = 通比牛牛
            5 = 固定庄家 
            */

            var banker_mode = th.room.banker_mode;
            var isZYQZ = banker_mode == 1;

            var player = th.getMyselfPlayer();
            //准备按钮
            var isShowBtnReady = (player.account_status == 0 || player.account_status == 1) && th.room.room_status == 1;
            this.btnReady.node.active = isShowBtnReady;
            //抢庄按钮
            var isShowQiangBrank = player.account_status == 3 && (th.room.room_status == 1 || th.room.room_status == 2);
            this.btnBankerMtp1.node.active = isShowQiangBrank && !isZYQZ;
            this.btnBankerMtp2.node.active = isShowQiangBrank && !isZYQZ;
            this.btnBankerMtp4.node.active = isShowQiangBrank && !isZYQZ;
            this.btnQiang.node.active = isShowQiangBrank && isZYQZ;
            this.btnBuqiang.node.active = isShowQiangBrank;
            //闲加倍数选择
            var isShowSelectMultiples = player.is_banker == 0 && player.account_status == 6 && (th.room.room_status == 1 || th.room.room_status == 2);
            this.btnPlayerMtp1.node.active = isShowSelectMultiples;
            this.btnPlayerMtp2.node.active = isShowSelectMultiples;
            this.btnPlayerMtp3.node.active = isShowSelectMultiples;
            this.btnPlayerMtp4.node.active = isShowSelectMultiples;
            //摊牌按钮
            this.btnShow.node.active = player.account_status == 7 && (th.room.room_status == 1 || th.room.room_status == 2) && th.myself.needLookCount <= 0;
            var isShowClickLookPai = player.account_status == 7 && (th.room.room_status == 1 || th.room.room_status == 2) && th.myself.needLookCount > 0;
            this.spriteClickLookPai.node.active = isShowClickLookPai;
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
            seat.seatIndex = _i; //为座位编号
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
        this.componentSeats[index].setInfo(player.account_id, player.nickname, player.account_score, player.headimgurl, player.sex);
        this.componentSeats[index].setOffline(player.online_status == 1 ? false : true);
        this.componentSeats[index].setBanker(player.is_banker == 1 ? true : false);
        this.componentSeats[index].setScore(player.account_score);
        this.componentSeats[index].setReady(player.account_status == 2);
        if (player.account_status == 4) {
            //不抢
            this.componentSeats[index].setMultiples("n");
        } else if (player.account_status == 5) {
            //抢庄
            var mtp = player.multiples != 0 ? "x" + player.multiples : "";
            this.componentSeats[index].setMultiples("y" + mtp);
        } else if (player.account_status == 6) {
            //闲家倍数
            if (player.is_banker == 1) {
                this.componentSeats[index].setMultiples(player.multiples != 0 ? "x" + player.multiples : "");
            } else {
                this.componentSeats[index].setMultiples(null);
            }
        } else if (player.account_status == 7) {
            //未摊牌
            this.componentSeats[index].setMultiples(player.is_banker == 1 ? null : "x" + player.multiples);
        } else {
            this.componentSeats[index].setMultiples(null);
        }
    },
    onBankerMultiplesClicked: function onBankerMultiplesClicked(targer, value) {
        var multiples = 1;
        if (Number(value) == 0) {
            multiples = 1;
            th.audioManager.playSFX("robbanker.m4a");
        } else {
            multiples = Number(value);
            th.audioManager.playSFX("multiples" + multiples + ".m4a");
        }
        var params = {
            operation: "GrabBanker",
            account_id: th.myself.account_id,
            session: th.sign,
            data: {
                room_id: th.room.room_id,
                is_grab: 1,
                multiples: Number(value)
            }
        };
        cc.log("===>>>[GrabBanker] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onBuqiangClicked: function onBuqiangClicked() {
        th.audioManager.playSFX("nobanker.m4a");
        var params = {
            operation: "GrabBanker",
            account_id: th.myself.account_id,
            session: th.sign,
            data: {
                room_id: th.room.room_id,
                is_grab: 0,
                multiples: 1
            }
        };
        cc.log("===>>>[NoGrabBanker] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onReadyClicked: function onReadyClicked() {
        cc.log("onReadyClicked");
        var params = {
            operation: "ReadyStart", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                room_id: th.room.room_id
            }
        };
        cc.log("===>>>[ReadyStart] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onPlayerMultiplesClicked: function onPlayerMultiplesClicked(targer, value) {
        var multiples = targer.target.multiples;
        cc.log(targer);
        cc.log("==============================multiples:", targer.target);
        cc.log("==============================multiples:", targer.target.multiples);
        th.audioManager.playSFX("multiples" + multiples + ".m4a");
        var params = {
            operation: "PlayerMultiples",
            account_id: th.myself.account_id,
            session: th.sign,
            data: {
                room_id: th.room.room_id,
                multiples: Number(multiples)
            }
        };
        cc.log("===>>>[PlayerMultiples] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onShowClicked: function onShowClicked(targer) {
        cc.log("onPlayerMultiplesClicked:");
        var params = {
            operation: "ShowCard", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                room_id: th.room.room_id
            }
        };
        cc.log("===>>>[ShowCard] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onBackClicked: function onBackClicked(targer) {
        th.wc.show("正在加载。。。");
        cc.director.loadScene("Hall", function () {
            th.wc.hide();
        });
    },
    onChatClicked: function onChatClicked(targer) {
        /*
        this.node.getChildByName("Poker_Ghost")
        .runAction(cc.sequence(cc.rotateBy(0,0,-180),cc.rotateBy(0.5,0,90), cc.callFunc((targer)=>{
            cc.log("换派",targer);
            targer.getChildByName("bg_back").active=false;;
        }),cc.rotateBy(0.5,0,90)) )
         let poker = th.pokerManager.getPokerSpriteById("A1");
        this.node.getChildByName("Poker_Back").addChild(poker);
        this.node.addChild(th.pokerManager.getNiuSprite(4, 0));
        this.setCountdown(10, "TEST.....");
        */
        cc.log(th.room);
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
    onPokerClicked: function onPokerClicked(targer, value) {
        cc.log("Poker", targer.target.pokerId, value);
        var pokerId = targer.target.pokerId;
        if (pokerId != -1) {
            targer.target.runAction(cc.sequence(cc.scaleTo(0.3, 0, 1), cc.callFunc(function (target) {
                target.addChild(th.pokerManager.getPokerSpriteById(pokerId));
            }), cc.scaleTo(0.3, 1, 1), cc.callFunc(function (traget) {
                traget.pokerId = -1;
            })));
            th.myself.needLookCount = th.myself.needLookCount - 1;
            this.refreshOptions();
        }
    },
    showPokers: function showPokers() {
        //找到坐位上有人，且准备的发牌
        var seatIndexs = [];
        var players = [];
        th.room.players.forEach(function (player) {
            if (player.account_status) {
                var index = th.getLocalIndex(player.serial_num - 1);
                seatIndexs.push(index);
                players.push(player);
            }
        });
        var myLocalIndex = th.getMyselfLocalIndex();
        for (var i = 0; i < seatIndexs.length; i++) {
            var player = players[i];
            var pokerIds = player.cards;
            var isMyself = seatIndexs[i] == myLocalIndex;
            if (player.account_status == 7) {
                //没摊牌
                if (isMyself) {
                    pokerIds = new Array(5).fill(-1);
                    pokerIds[0] = player.cards[0];
                    pokerIds[1] = player.cards[1];
                    pokerIds[2] = player.cards[2];
                } else {
                    pokerIds = new Array(5).fill(-1);
                }
            } else if (player.account_status == 8) {
                //摊牌
                pokerIds = player.cards;
            } else {
                //其他
                pokerIds = new Array(5).fill(-1);
            }
            cc.log("是自己：" + isMyself, player.nickname + " 发牌：", pokerIds);
            var basePoker = this.nodePokers[seatIndexs[i]];
            basePoker.removeAllChildren();
            var readyPokersIds = player.cards;
            for (var pi = 0; pi < pokerIds.length; pi++) {
                var pokerId = pokerIds[pi];
                var readyPokerId = readyPokersIds[pi] || -1;
                var poker = th.pokerManager.getPokerSpriteById(pokerId);
                poker.pokerId = readyPokerId;
                poker.scale = 0.65;
                //poker.x = (seat.x > 0 ? -250 : 45) + basePoker.y + pi * 30;
                poker.position = basePoker.convertToNodeSpaceAR(cc.v2(375, 603 + 60));
                if (pokerId == -1) {
                    var clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                    clickEventHandler.component = "GameNN"; //这个是代码文件名
                    clickEventHandler.handler = "onPokerClicked";
                    clickEventHandler.customEventData = readyPokerId;
                    poker.getComponent(cc.Button).clickEvents.push(clickEventHandler);
                }
                basePoker.addChild(poker);
            }
        }
        //发牌效果
        th.audioManager.playSFX("fapai.m4a");
        for (var _i2 = 0; _i2 < 5; _i2++) {
            for (var j = 0; j < seatIndexs.length; j++) {
                var seatIndex = seatIndexs[j];
                var seat = this.nodeSeats[seatIndex];
                var basePokers = this.nodePokers[seatIndex];
                var pokers = basePokers.children;
                var _poker = pokers[_i2];
                var _isMyself = seatIndex == myLocalIndex;
                //cc.log(seatIndex, myLocalIndex, seatIndex == myLocalIndex);
                (function (poker, delay, x, y, isMyself) {
                    //cc.log("delay:", delay, x, y, isMyself);
                    if (isMyself) {
                        poker.runAction(cc.sequence(cc.delayTime(delay), cc.spawn(cc.moveTo(0.2, cc.v2(x, y)), cc.scaleTo(0.2, 1))));
                    } else {
                        poker.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(0.2, cc.v2(x, y))));
                    }
                })(_poker, 0.1 + _i2 * 0.04 * seatIndexs.length + j * 0.04, (_isMyself ? 100 : seat.x > 0 ? -210 : 90) + basePokers.y + _i2 * (_isMyself ? 110 : 30), _isMyself ? -25 : 0, _isMyself);
            }
        }

        //如果玩家已经 摊牌，显示牛
        for (var _i3 = 0; _i3 < seatIndexs.length; _i3++) {
            var _player = players[_i3];
            if (_player.account_status == 8) {
                this.showNiuType(_player);
            }
        }
    },
    setCountdown: function setCountdown(val, content) {
        var _this2 = this;

        var num = Number(val);
        this.nodeCountdown.active = num > 0 ? true : false;
        if (content) {
            this.nodeCountdown.getChildByName("lbl_title").getComponent("cc.Label").string = content;
        } else {
            this.nodeCountdown.getChildByName("lbl_title").node.active = false;
        }
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
        