"use strict";
cc._RF.push(module, 'a6e34fDC+BAcpoXQQTJsDLe', 'GameNN');
// scripts/components/GameNN.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

cc.Class({
    extends: cc.Component,

    properties: {
        seatPrefab: cc.Prefab,

        baseNode: cc.Node,
        nodeSeats: [cc.Node], //所有座位的NODE
        componentSeats: [cc.Component], //所有座位的组件
        nodePokers: [cc.Node], //所有座位的扑克
        nodeAmins: cc.Node, //用来播放动画

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

        sprWaitBet: cc.Sprite,
        sprPlayerBet: cc.Sprite,
        sprQiangzhuang: cc.Sprite,
        sprReady: cc.Sprite,
        sprWaitPlayerBet: cc.Sprite,
        sprWaitShow: cc.Sprite,
        sprWaitNext: cc.Sprite,

        spriteClickLookPai: cc.Sprite, //点击看牌

        coinPrefab: cc.Prefab,

        resultNode: cc.Node,
        resultDeatilNode: cc.Node,
        resultItemPrefab: cc.Prefab,
        resultDetailItemPrefab: cc.Prefab,
        resultDetailSonItemPrefab: cc.Prefab,

        btnCaptureScreen: cc.Button,
        btnTest: cc.Button,

        holdTimeEclipse: 0, //用来检测长按
        holdClick: false,

        _countdownEndTime: 0, //倒计时剩余时间
        _isPlay: true //用来播放倒计时声音
    },

    onLoad: function onLoad() {
        var _this = this;

        if (th == null) {
            return;
        }
        cc.log("GameNN onLoad");
        //自由抢庄需要看牌两次
        this.initEventHandlers();
        this.initView();

        this.btnCaptureScreen.node.on("touchstart", function (event) {
            _this.holdClick = true;
            _this.holdTimeEclipse = 0;
        });
        this.btnCaptureScreen.node.on("touchend", function (event) {
            _this.holdClick = false;
            if (_this.holdTimeEclipse >= 30) {
                _this.node.emit("captureScreenLongClicked");
            }
            _this.holdTimeEclipse = 0;
        });

        this.node.on("captureScreenLongClicked", function (data) {
            _this.onChanganbaocunClicked();
        });
    },
    onEnable: function onEnable() {
        cc.log("GameNN onEnable");
    },
    start: function start() {
        cc.log("GameNN start");
    },
    initEventHandlers: function initEventHandlers() {
        var _this2 = this;

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
            _this2.initSingleSeat(player);
        });
        this.node.on("UpdateGuestInfo", function () {
            cc.log("<<<===[UpdateGuestInfo] GmaeNN");
        });
        this.node.on("UpdateAccountStatus", function (player) {
            cc.log("<<<===[UpdateAccountStatus] GmaeNN", player);
            _this2.initSingleSeat(player);
            if (player.account_id == th.myself.account_id) {
                _this2.refreshOptions();
                _this2.initSingleSeat(player);
            }
        });
        this.node.on("GameStart", function (data) {
            cc.log("<<<===[GameStart] GmaeNN", data);
            _this2.initRoomInfo();
            _this2.setCountdown(data.limit_time, "游戏开始了");
            _this2.refreshOptions();
        });
        this.node.on("MyCards", function (player) {
            cc.log("<<<===[MyCards] GmaeNN", player);
            _this2.showPokers();
            _this2.refreshOptions();
        });

        //开始游戏,闲家选倍数
        this.node.on("StartBet", function (data) {
            cc.log("<<<===[StartBet] GmaeNN:", data);
            _this2.setCountdown(data.limit_time, "投注开始了");
            //抢庄account_ID数据
            //"grab_array": ["31", "18"],
            data.data.forEach(function (player) {
                var oldPlayer = th.getPlayerById(player.account_id);
                _this2.initSingleSeat(oldPlayer);
            });

            //TODO
            cc.log("TODO抢庄效果", data.grab_array);
            data.grab_array.forEach(function (account_id, index) {
                _this2.scheduleOnce(function () {
                    var player = th.getPlayerById(account_id);
                    var index = th.getLocalIndex(player.serial_num - 1);
                    _this2.componentSeats[index].doBlink();
                }, index * 0.5);
            });
            cc.log("\u62A2\u5E84\u4EBA\u6570" + data.grab_array.length + " \u603B\u7528\u65F6\uFF1A" + data.grab_array.length * 0.5);
            _this2.scheduleOnce(function () {
                data.data.forEach(function (player) {
                    var oldPlayer = th.getPlayerById(player.account_id);
                    _this2.initSingleSeat(oldPlayer);
                });
                var player = th.getBankerPlayer();
                var index = th.getLocalIndex(player.serial_num - 1);
                cc.log("\u5E84 " + player.nickname + " player.serial_num:" + player.serial_num + ", index: " + index);
                _this2.componentSeats[index].setBanker(true);
            }, data.grab_array.length * 0.5);

            var delayTime = data.grab_array.length * 0.5 + 1;
            cc.log("\u663E\u793A\u500D\u6570\u6309\u94AE\u5EF6\u65F6\uFF1A" + delayTime);

            _this2.scheduleOnce(function () {
                _this2.refreshOptions();
            }, delayTime);
        });

        //闲家选倍数 通知
        this.node.on("UpdateAccountMultiples", function (player) {
            cc.log("<<<===[UpdateAccountMultiples] GmaeNN:", player);
            _this2.initSingleSeat(player);
            if (player.account_id == th.myself.account_id) {
                _this2.refreshOptions();
            }
        });

        //显示牌
        this.node.on("StartShow", function (data) {
            cc.log("<<<===[StartShow] GmaeNN:", data);

            _this2.refreshOptions();
            //1 自由抢庄

            //显示我自己的牌
            var player = th.getMyselfPlayer();
            var cards = player.cards;
            var index = th.getLocalIndex(player.serial_num - 1);
            var pokers = _this2.nodePokers[index].children;
            var showCard = 5 - th.myself.needLookCount;
            cc.log("显示我自己的牌:", player, cards);
            pokers.forEach(function (poker, index) {
                if (index >= showCard) {
                    poker.pokerId = cards[index];
                }
            });
            if (th.room.banker_mode == 1) {
                pokers.forEach(function (poker, idx) {
                    if (idx >= showCard) return;
                    poker.runAction(cc.sequence(cc.scaleTo(0.3, 0, 1), cc.callFunc(function (target) {
                        target.addChild(th.pokerManager.getPokerSpriteById(target.pokerId));
                    }), cc.scaleTo(0.3, 1, 1), cc.callFunc(function (target) {
                        target.pokerId = -1;
                    })));
                });
            }

            _this2.setCountdown(data.limit_time, "摊牌开始了");

            data.data.forEach(function (item) {
                var player = th.getPlayerById(item.account_id);
                _this2.initSingleSeat(player);
            });
        });

        //摊牌
        this.node.on("UpdateAccountShow", function (player) {
            cc.log("<<<===[UpdateAccountShow] GmaeNN:", player);
            var index = th.getLocalIndex(player.serial_num - 1);
            var nodePoker = _this2.nodePokers[index];
            var nodeSeat = _this2.nodeSeats[index];
            var pokers = nodePoker.children;

            // 大于0为有牛
            var hasNiu = th.getNiuIndex(player.card_type, player.combo_point) > 0;
            var cards = hasNiu > 0 ? player.combo_array : player.cards;
            //如果不是自己
            //(isMyself ? 100 : seat.x > 0 ? -210 : 90) + basePokers.y +i * (isMyself ? 110 : 30),
            // isMyself ? -25 : 0,
            var isMyself = th.getMyselfLocalIndex() == index;
            var firstX = isMyself ? 100 : nodeSeat.x > 0 ? -210 : 90;
            var firstY = isMyself ? -25 : 0;
            var offset = isMyself ? 110 : 30;
            pokers.forEach(function (poker, index) {
                poker.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(firstX, firstY)), cc.callFunc(function (target) {
                    target.addChild(th.pokerManager.getPokerSpriteById(cards[index]));
                }), cc.moveTo(0.3, cc.v2(firstX + nodePoker.y + index * offset + (hasNiu && index > 2 ? 15 : 0), firstY))));
            });
            _this2.showNiuType(player);
        });

        //结果
        this.node.on("Win", function (data) {
            cc.log("<<<===[Win] GmaeNN:", data);
            //赢的人
            //let win = data.winner_array;
            //输的人
            //let lose = data.loser_array;
            _this2.scheduleOnce(function () {
                _this2.nodeAmins.removeAllChildren();

                cc.log("TODO 飞筹码效果");
                //通比牛牛先飞向最大的人，否则先飞向庄
                var tagerPalyer = th.room.banker_mode == 4 ? th.getPlayerById(data.winner_array[0].account_id) : th.getBankerPlayer();

                var seatxy = th.getSeatXY();
                var index = th.getLocalIndex(tagerPalyer.serial_num - 1);

                var _seatxy$index = _slicedToArray(seatxy[index], 2),
                    tx = _seatxy$index[0],
                    ty = _seatxy$index[1];
                //输得的人先飞向tagerPalyer


                th.audioManager.playSFX("coin.mp3");
                data.loser_array.forEach(function (loser) {
                    if (loser.account_id != tagerPalyer.account_id) {
                        var player = th.getPlayerById(loser.account_id);
                        var _index = th.getLocalIndex(player.serial_num - 1);

                        var _seatxy$_index = _slicedToArray(seatxy[_index], 2),
                            x = _seatxy$_index[0],
                            y = _seatxy$_index[1];

                        for (var i = 0; i < 5; i++) {
                            var coin = cc.instantiate(_this2.coinPrefab);
                            coin.x = x;
                            coin.y = y;
                            _this2.nodeAmins.addChild(coin);
                            coin.runAction(cc.sequence(cc.delayTime(0.1 + i * 0.05), cc.moveTo(0.5, cc.v2(tx, ty)).easing(cc.easeSineOut()), cc.callFunc(function (target) {
                                target.removeFromParent();
                            })));
                        }
                    }
                });
                var loserCount = data.loser_array.filter(function (loser) {
                    return loser.account_id != tagerPalyer.account_id;
                }).length;
                //this.nodeAmins.removeAllChildren();
                _this2.scheduleOnce(function () {
                    //tagerPalyer输得的人先飞向赢的人
                    th.audioManager.playSFX("coin.mp3");
                    data.winner_array.forEach(function (winer) {
                        if (winer.account_id != tagerPalyer.account_id) {
                            var player = th.getPlayerById(winer.account_id);
                            var _index2 = th.getLocalIndex(player.serial_num - 1);

                            var _seatxy$_index2 = _slicedToArray(seatxy[_index2], 2),
                                x = _seatxy$_index2[0],
                                y = _seatxy$_index2[1];

                            for (var i = 0; i < 5; i++) {
                                var coin = cc.instantiate(_this2.coinPrefab);
                                coin.x = tx;
                                coin.y = ty;
                                _this2.nodeAmins.addChild(coin);
                                coin.runAction(cc.sequence(cc.delayTime(0.1 + i * 0.05), cc.moveTo(0.5, cc.v2(x, y)).easing(cc.easeSineOut()), cc.callFunc(function (target) {
                                    target.removeFromParent();
                                })));
                            }
                        }
                    });
                }, 0.1 + 0.5 + loserCount * 0.05);

                var winerCount = data.winner_array.filter(function (winner) {
                    return winner.account_id != tagerPalyer.account_id;
                }).length;

                var offsetCount = loserCount + winerCount;
                cc.log("==================offsetCount:", offsetCount);

                _this2.scheduleOnce(function () {
                    var score_board = data.score_board;
                    var account_ids = Object.keys(score_board);
                    cc.log("AccountIds:", account_ids);
                    account_ids.forEach(function (account_id) {
                        var player = th.getPlayerById(account_id);
                        player.account_score = score_board[account_id];
                        var index = th.getLocalIndex(player.serial_num - 1);
                        _this2.componentSeats[index].setScoreAnim(player.account_score);
                    });
                }, 0.1 + 0.5 + offsetCount * 0.05 + 0.5);

                _this2.scheduleOnce(function () {
                    th.clear();
                    _this2.componentSeats.forEach(function (cpnt) {
                        cpnt.setBanker(false);
                    });
                    _this2.nodePokers.forEach(function (node) {
                        node.removeAllChildren();
                    });
                    th.room.players.forEach(function (player) {
                        _this2.initSingleSeat(player);
                    });
                    _this2.refreshOptions();
                    if (th.room.game_num == th.room.total_num) {
                        cc.log("done........................");
                        _this2.toConnectApi();
                    }
                }, 0.1 + 0.5 + offsetCount * 0.05 + 3);
            }, 1);
        });

        //战绩
        this.node.on("getScoreBoard", function (data) {
            cc.log("<<<===[getScoreBoard] GameNN:", data);
            th.wc.hide();
            _this2.resultNode.x = 0;
            _this2.resultNode.y = 0;
            _this2.resultNode.active = true;

            var _data$balance_scorebo = data.balance_scoreboard,
                room_number = _data$balance_scorebo.room_number,
                time = _data$balance_scorebo.time,
                total_num = _data$balance_scorebo.total_num,
                room_creator = _data$balance_scorebo.room_creator,
                scoreboard = _data$balance_scorebo.scoreboard;


            _this2.resultNode.getChildByName("lbl_roomId").getComponent("cc.Label").string = "房间号：" + room_number;

            _this2.resultNode.getChildByName("lbl_time").getComponent("cc.Label").string = time;

            _this2.resultNode.getChildByName("lbl_round").getComponent("cc.Label").string = total_num + "局";

            _this2.resultNode.getChildByName("lbl_banker").getComponent("cc.Label").string = "房主：" + room_creator;

            var resultNode = _this2.resultNode.getChildByName("results").getChildByName("view").getChildByName("content");
            scoreboard.forEach(function (player, index) {
                var item = cc.instantiate(_this2.resultItemPrefab);
                item.getChildByName("lbl_id").getComponent("cc.Label").string = "ID：" + player.account_id;
                item.getChildByName("lbl_name").getComponent("cc.Label").string = player.name;
                item.getChildByName("lbl_score").getComponent("cc.Label").string = player.score;

                var headImg = item.getChildByName("headImg").getComponent("cc.Sprite");
                cc.loader.load({
                    url: player.avatar,
                    type: "jpg"
                }, function (err, texture) {
                    if (!err) {
                        var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                        headImg.spriteFrame = headSpriteFrame;
                        headImg.node.setScale(2 - texture.width / 120);
                    }
                });

                if (index == 0) {
                    item.getChildByName("dayinjia").active = true;
                }
                resultNode.addChild(item);
            });
            //Object.assign(th.room, data);
        });

        //战绩明细
        this.node.on("getScoreDetail", function (data) {
            cc.log("<<<===[getScoreDetail] GameNN:", data);
            //Object.assign(th.room, data);
            th.wc.hide();
            _this2.resultDeatilNode.x = 0;
            _this2.resultDeatilNode.y = 0;
            _this2.resultDeatilNode.active = true;

            var room_number = data.room_number,
                create_time = data.create_time,
                game_num = data.game_num,
                rule_text = data.rule_text;


            _this2.resultDeatilNode.getChildByName("lbl_roomId").getComponent("cc.Label").string = "房间号：" + room_number;

            _this2.resultDeatilNode.getChildByName("lbl_time").getComponent("cc.Label").string = create_time;

            _this2.resultDeatilNode.getChildByName("lbl_round").getComponent("cc.Label").string = game_num + "局";

            _this2.resultDeatilNode.getChildByName("lbl_info").getComponent("cc.Label").string = rule_text;

            var resultDetailNode = _this2.resultDeatilNode.getChildByName("results").getChildByName("view").getChildByName("content");

            //加载头像
            var players = {};
            data.balance_board.forEach(function (item) {
                players[item.name] = item;
            });

            data.player_array.forEach(function (player) {
                var game_num = player.game_num,
                    total_num = player.total_num,
                    player_cards = player.player_cards;

                var roundNode = cc.instantiate(_this2.resultDetailItemPrefab);
                roundNode.height = 100 + data.balance_board.length * 100;
                roundNode.getChildByName("lbl_round").getComponent("cc.Label").string = game_num + "/" + total_num;
                var playersNode = roundNode.getChildByName("players");
                player_cards.forEach(function (item) {
                    var playerNode = cc.instantiate(_this2.resultDetailSonItemPrefab);

                    playerNode.getChildByName("lbl_id").getComponent("cc.Label").string = players[item.name].account_id + "";
                    playerNode.getChildByName("lbl_name").getComponent("cc.Label").string = item.name + "";
                    playerNode.getChildByName("lbl_mtp").getComponent("cc.Label").string = item.chip + "";
                    playerNode.getChildByName("lbl_score").getComponent("cc.Label").string = item.score + "";
                    playerNode.getChildByName("lbl_niu").getComponent("cc.Label").string = item.card_type_str + "";
                    playerNode.getChildByName("icon_banker").active = item.is_banker == 1;

                    var headimg = playerNode.getChildByName("headImg").getComponent("cc.Sprite");

                    cc.loader.load({
                        url: players[item.name].avatar,
                        type: "jpg"
                    }, function (err, texture) {
                        if (!err) {
                            var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                            headimg.spriteFrame = headSpriteFrame;
                            headimg.node.setScale(2 - texture.width / 120);
                        }
                    });

                    var pokerNode = playerNode.getChildByName("pokers");
                    item.player_cards.forEach(function (card) {
                        pokerNode.addChild(th.pokerManager.getPokerSpriteById(card));
                    });
                    playersNode.addChild(playerNode);
                });
                resultDetailNode.addChild(roundNode);
            });
        });

        this.node.on("getCopyUrl", function (data) {
            cc.log("<<<===[getCopyUrl] GameNN:", data);
            /*
            let result = th.webCopyString(data.url);
            cc.log("address:", data.url);
            th.msg.show(result ? "复制成功！" : "复制失败");
            */
        });
    },
    onResultCloseClicked: function onResultCloseClicked() {
        th.wc.show("正在返回大厅。。。");
        th.args = {};
        th.room.room_id = null;
        th.room.room_number = null;
        th.gametype = null;
        cc.director.loadScene("Hall", function () {
            th.wc.hide();
        });
    },
    onZhanjiseachClicked: function onZhanjiseachClicked() {
        var params = {
            operation: "getScoreDetail", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                type: 1,
                num2: 10291,
                num: th.room.room_number
            }
        };
        cc.log("===>>>[getScoreDetail] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onResultDetailCloseClicked: function onResultDetailCloseClicked() {
        this.resultDeatilNode.active = false;
    },
    onChanganbaocunClicked: function onChanganbaocunClicked() {
        cc.log("长按保存....");
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
            niuType.scale = 0.1;
            nodePoker.addChild(niuType);
            niuType.runAction(cc.scaleTo(0.3, 1.2));
        } else {
            //TODO 显示牛几
            var _niuType = th.pokerManager.getNiuSprite(player.card_type, player.combo_point);
            _niuType.x = 310;
            _niuType.y = 85;
            _niuType.scale = 0.1;
            nodePoker.addChild(_niuType);
            _niuType.runAction(cc.scaleTo(0.3, 1.5));
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
            var _player = th.getMyselfPlayer();
            _player.cards = th.room.cards;
            this.showPokers();
        }
        //是不是有庄
        var player = th.getBankerPlayer();
        if (player) {
            var index = th.getLocalIndex(player.serial_num - 1);
            this.componentSeats[index].setBanker(true);
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
            this.sprReady.node.active = isShowBtnReady;
            //抢庄按钮
            var isShowQiangBrank = player.account_status == 3 && (th.room.room_status == 1 || th.room.room_status == 2);
            this.btnBankerMtp1.node.active = isShowQiangBrank && !isZYQZ;
            this.btnBankerMtp2.node.active = isShowQiangBrank && !isZYQZ;
            this.btnBankerMtp4.node.active = isShowQiangBrank && !isZYQZ;
            this.btnQiang.node.active = isShowQiangBrank && isZYQZ;
            this.btnBuqiang.node.active = isShowQiangBrank;
            this.sprQiangzhuang.node.active = isShowQiangBrank;
            //闲加倍数选择
            var isShowSelectMultiples = player.is_banker == 0 && player.account_status == 6 && (th.room.room_status == 1 || th.room.room_status == 2) && player.multiples == 0;
            this.btnPlayerMtp1.node.active = isShowSelectMultiples;
            this.btnPlayerMtp2.node.active = isShowSelectMultiples;
            this.btnPlayerMtp3.node.active = isShowSelectMultiples;
            this.btnPlayerMtp4.node.active = isShowSelectMultiples;
            this.sprWaitPlayerBet.node.active = isShowSelectMultiples;
            //摊牌按钮
            var isShowText = player.account_status == 7 && (th.room.room_status == 1 || th.room.room_status == 2) && th.myself.needLookCount <= 0;
            this.btnShow.node.active = isShowText;

            var isShowClickLookPai = player.account_status == 7 && (th.room.room_status == 1 || th.room.room_status == 2) && th.myself.needLookCount > 0;
            this.spriteClickLookPai.node.active = isShowClickLookPai;
            this.sprWaitShow.node.active = isShowClickLookPai || isShowText;
        }
    },
    initRoomInfo: function initRoomInfo() {
        this.lblRoomInfo.string = th.room.game_num + "/" + th.room.total_num + "\u5C40 \u5E95\u5206\uFF1A" + th.room.base_score + "\u5206";
    },
    initSeat: function initSeat() {
        var seatsxy = th.getSeatXY();
        for (var i = 0; i < seatsxy.length; i++) {
            var _seatsxy$i = _slicedToArray(seatsxy[i], 2),
                x = _seatsxy$i[0],
                y = _seatsxy$i[1];

            var seat = cc.instantiate(this.seatPrefab);
            seat.x = x;
            seat.y = y;
            seat.seatIndex = i; //为座位编号
            this.baseNode.addChild(seat);
            this.nodeSeats.push(seat);
            this.componentSeats.push(seat.getComponent("Seat"));
            this.nodePokers.push(seat.getChildByName("info").getChildByName("pokers"));
        }
        var players = th.room.players;
        for (var _i = 0; _i < players.length; ++_i) {
            this.initSingleSeat(players[_i]);
        }
    },

    initSingleSeat: function initSingleSeat(player) {
        var index = th.getLocalIndex(player.serial_num - 1);
        this.componentSeats[index].setInfo(player.account_id, player.nickname, player.account_score, player.headimgurl, player.sex);
        this.componentSeats[index].setOffline(player.online_status == 1 ? false : true);
        /*
        this.componentSeats[index].setBanker(
            player.is_banker == 1 ? true : false
        );
        */
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
            this.componentSeats[index].setMultiples(player.multiples != 0 ? "x" + player.multiples : "");
            /*
            //闲家倍数
            if (player.is_banker == 1) {
                this.componentSeats[index].setMultiples(
                    player.multiples != 0 ? "x" + player.multiples : ""
                );
            } else {
                this.componentSeats[index].setMultiples(null);
            }
            */
        } else if (player.account_status == 7) {
            //未摊牌
            this.componentSeats[index].setMultiples(player.is_banker == 1 ? null : "x" + player.multiples);
        } else {
            this.componentSeats[index].setMultiples(null);
        }
    },
    onCopyCliecked: function onCopyCliecked(targer, data) {
        /*
        let address = `${th.href}?roomId=${th.room.room_number}&type=${
            th.gametype
        }`;
        */
        var result = th.webCopyString(th.room.copyurl);
        cc.log("address:", th.room.copyurl);
        th.msg.show(result ? "复制成功！" : "复制失败");
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
    onLookClicked: function onLookClicked(targer) {
        cc.log("onLookClickedonLookClickedonLookClickedonLookClicked");
        var result = th.webCopyString("onLookClickedonLookClickedonLookClickedonLookClickedCopy");
        th.msg.show(result ? "复制成功！" : "复制失败");
    },
    onPokerClicked: function onPokerClicked(targer, value) {
        cc.log("Poker", targer.target.pokerId, value);
        var pokerId = targer.target.pokerId;
        if (pokerId != -1) {
            this.showOpenPokerAnim(targer.target);
            th.myself.needLookCount = th.myself.needLookCount - 1;
            this.refreshOptions();
        }
    },
    showOpenPokerAnim: function showOpenPokerAnim(poker) {
        var pokerId = poker.pokerId;
        if (pokerId != -1) {
            poker.runAction(cc.sequence(cc.scaleTo(0.3, 0, 1), cc.callFunc(function (target) {
                target.addChild(th.pokerManager.getPokerSpriteById(pokerId));
            }), cc.scaleTo(0.3, 1, 1), cc.callFunc(function (traget) {
                traget.pokerId = -1;
            })));
        }
    },
    showPokers: function showPokers() {
        var _this3 = this;

        //找到坐位上有人，且准备的发牌
        var seatIndexs = [];
        var players = [];
        th.room.players.forEach(function (player) {
            cc.log("showPokers:", player.account_status);
            if (player.account_status > 1) {
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
                    for (var j = 0; j < 5 - th.myself.needLookCount; j++) {
                        pokerIds[j] = player.cards[j];
                    }
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
                var realPokerId = readyPokersIds[pi] || -1;
                var poker = th.pokerManager.getPokerSpriteById(pokerId);
                poker.pokerId = isMyself ? realPokerId : -1;
                poker.scale = 0.65;
                //poker.x = (seat.x > 0 ? -250 : 45) + basePoker.y + pi * 30;
                poker.position = basePoker.convertToNodeSpaceAR(cc.v2(375, 603 + 60));
                if (pokerId == -1) {
                    var clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                    clickEventHandler.component = "GameNN"; //这个是代码文件名
                    clickEventHandler.handler = "onPokerClicked";
                    clickEventHandler.customEventData = realPokerId;
                    poker.getComponent(cc.Button).clickEvents.push(clickEventHandler);
                }
                basePoker.addChild(poker);
            }
        }
        //发牌效果
        th.audioManager.playSFX("fapai.m4a");
        for (var _i2 = 0; _i2 < 5; _i2++) {
            for (var _j = 0; _j < seatIndexs.length; _j++) {
                var seatIndex = seatIndexs[_j];
                var seat = this.nodeSeats[seatIndex];
                var basePokers = this.nodePokers[seatIndex];
                var pokers = basePokers.children;
                var _poker = pokers[_i2];
                var _isMyself = seatIndex == myLocalIndex;
                var showCard = _i2 < 5 - th.myself.needLookCount;
                //cc.log(seatIndex, myLocalIndex, seatIndex == myLocalIndex);
                (function (poker, delay, x, y, isMyself, showCard) {
                    //cc.log("delay:", delay, x, y, isMyself);
                    if (isMyself) {
                        poker.runAction(cc.sequence(cc.delayTime(delay), cc.spawn(cc.moveTo(0.2, cc.v2(x, y)), cc.scaleTo(0.2, 1)), cc.callFunc(function (target) {
                            if (showCard) {
                                _this3.showOpenPokerAnim(target);
                            }
                        })));
                    } else {
                        poker.runAction(cc.sequence(cc.delayTime(delay), cc.moveTo(0.2, cc.v2(x, y))));
                    }
                })(_poker, 0.1 + _i2 * 0.04 * seatIndexs.length + _j * 0.04, (_isMyself ? 100 : seat.x > 0 ? -210 : 90) + basePokers.y + _i2 * (_isMyself ? 110 : 30), _isMyself ? -25 : 0, _isMyself, showCard);
            }
        }

        //如果玩家已经 摊牌，显示牛
        for (var _i3 = 0; _i3 < seatIndexs.length; _i3++) {
            var _player2 = players[_i3];
            if (_player2.account_status == 8) {
                this.showNiuType(_player2);
            }
        }
    },
    setCountdown: function setCountdown(val, content) {
        var _this4 = this;

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
            if (_this4._countdownEndTime <= Date.now()) {
                _this4.nodeCountdown.active = false;
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
            //th.audioManager.playSFX("timeup_alarm.mp3");
        }
        if (this.holdClick) {
            this.holdTimeEclipse++;
            if (this.holdTimeEclipse > 120) {
                //如果长按时间大于2s，则认为长按了2s
                this.holdTimeEclipse = 120;
            }
        }
    },
    toConnectApi: function toConnectApi(targer) {
        cc.log("onCreateClicked:", this.createFrom);
        //断开大厅连接连接游戏websocket
        th.webSocketManager.connectGameServer({
            ip: "47.96.177.207",
            port: 10000,
            namespace: "api"
        }, function () {
            th.wc.show("正在获取结果...");
            var params = {
                operation: "getScoreBoard", //操作标志
                account_id: th.myself.account_id, //用户id};
                session: th.sign,
                data: {
                    type: 1,
                    num2: 10291,
                    num: th.room.room_number
                }
            };
            cc.log("===>>>[getScoreBoard] GameNN:", params);
            th.ws.send(JSON.stringify(params));
        });
    }
});

cc._RF.pop();