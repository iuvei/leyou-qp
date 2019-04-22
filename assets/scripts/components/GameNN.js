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

        btnXiazhuang: cc.Button,
        btnShangzhuang: cc.Button,
        btnBuShangzhuang: cc.Button,

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

    onLoad: function() {
        if (th == null) {
            return;
        }
        cc.log("GameNN onLoad");
        //自由抢庄需要看牌两次
        this.initEventHandlers();
        this.initView();

        this.btnCaptureScreen.node.on("touchstart", event => {
            this.holdClick = true;
            this.holdTimeEclipse = 0;
        });
        this.btnCaptureScreen.node.on("touchend", event => {
            this.holdClick = false;
            if (this.holdTimeEclipse >= 30) {
                this.node.emit("captureScreenLongClicked");
            }
            this.holdTimeEclipse = 0;
        });

        this.node.on("captureScreenLongClicked", data => {
            this.onChanganbaocunClicked();
        });
    },
    onEnable() {
        cc.log("GameNN onEnable");
    },
    start() {
        cc.log("GameNN start");
    },
    initEventHandlers() {
        cc.log("GameNN initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;

        this.node.on("JoinRoom", () => {
            cc.log("<<<===[JoinRoom] GmaeNN");
        });
        this.node.on("GuestRoom", () => {
            cc.log("<<<===[GuestRoom] GmaeNN");
        });
        this.node.on("AllGamerInfo", () => {
            cc.log("<<<===[AllGamerInfo] GmaeNN");
        });
        this.node.on("AllGuestInfo", () => {
            cc.log("<<<===[AllGuestInfo] GmaeNN");
        });
        this.node.on("UpdateGamerInfo", player => {
            cc.log("<<<===[UpdateGamerInfo] GmaeNN:", player);
            this.initSingleSeat(player);
        });
        this.node.on("UpdateGuestInfo", () => {
            cc.log("<<<===[UpdateGuestInfo] GmaeNN");
        });
        this.node.on("UpdateAccountStatus", player => {
            cc.log("<<<===[UpdateAccountStatus] GmaeNN", player);
            this.initSingleSeat(player);
            if (!th.myself.isPlayer) {
                this.initSingleSeat(player);
            } else {
                if (player.account_id == th.getMyselfAccountId()) {
                    //th.myself.account_id 因观战修改成th.getMyselfAccountId()
                    this.refreshOptions();
                    this.initSingleSeat(player);
                }
            }
        });
        this.node.on("GameStart", data => {
            cc.log("<<<===[GameStart] GmaeNN", data);
            this.initRoomInfo();
            this.setCountdown(data.limit_time, "游戏开始了");
            this.refreshOptions();
            //如果观战
            if (!th.myself.isPlayer) {
                this.showPokers();
            }
        });
        this.node.on("MyCards", player => {
            cc.log("<<<===[MyCards] GmaeNN", player);
            let bankerMode = th.room.banker_mode;
            if (
                bankerMode == 1 ||
                bankerMode == 2 ||
                bankerMode == 3 ||
                bankerMode == 4
            ) {
                this.showPokers();
            }
            this.refreshOptions();
        });

        //开始游戏,闲家选倍数
        this.node.on("StartBet", data => {
            cc.log("<<<===[StartBet] GmaeNN:", data);
            this.setCountdown(data.limit_time, "投注开始了");
            //抢庄account_ID数据
            //"grab_array": ["31", "18"],
            data.data.forEach(player => {
                const oldPlayer = th.getPlayerById(player.account_id);
                this.initSingleSeat(oldPlayer);
            });

            //TODO
            cc.log("TODO抢庄效果", data.grab_array);
            data.grab_array.forEach((account_id, index) => {
                this.scheduleOnce(() => {
                    const player = th.getPlayerById(account_id);
                    const index = th.getLocalIndex(player.serial_num - 1);
                    this.componentSeats[index].doBlink();
                }, index * 0.5);
            });
            cc.log(
                `抢庄人数${data.grab_array.length} 总用时：${data.grab_array
                    .length * 0.5}`
            );
            this.scheduleOnce(() => {
                data.data.forEach(player => {
                    const oldPlayer = th.getPlayerById(player.account_id);
                    this.initSingleSeat(oldPlayer);
                });
                const player = th.getBankerPlayer();
                const index = th.getLocalIndex(player.serial_num - 1);
                cc.log(
                    `庄 ${player.nickname} player.serial_num:${
                        player.serial_num
                    }, index: ${index}`
                );
                this.componentSeats[index].setBanker(true);
                //固定庄家 些时发牌
                if (th.room.banker_mode == 5) {
                    this.showPokers();
                }
            }, data.grab_array.length * 0.5);

            let delayTime = data.grab_array.length * 0.5 + 1;
            cc.log(`显示倍数按钮延时：${delayTime}`);

            this.scheduleOnce(() => {
                this.refreshOptions();
            }, delayTime);
        });

        //闲家选倍数 通知
        this.node.on("UpdateAccountMultiples", player => {
            cc.log("<<<===[UpdateAccountMultiples] GmaeNN:", player);
            this.initSingleSeat(player);
            if (player.account_id == th.getMyselfAccountId()) {
                //th.myself.account_id 因观战修改成th.getMyselfAccountId()
                this.refreshOptions();
            }
        });

        //显示牌
        this.node.on("StartShow", data => {
            cc.log("<<<===[StartShow] GmaeNN:", data);

            this.refreshOptions();
            //1 自由抢庄

            //显示我自己的牌
            let player = th.getMyselfPlayer();
            let cards = player.cards;
            const index = th.getLocalIndex(player.serial_num - 1);
            let pokers = this.nodePokers[index].children;
            let showCard = 5 - th.myself.needLookCount;
            cc.log("显示我自己的牌:", showCard, player, cards);
            //3=转庄牛牛, 2 = 明牌抢庄 5 = 固定庄家 1 = 自由抢庄 4 = 通比牛牛
            const bankerMode = th.room.banker_mode;
            if (
                bankerMode == 1 ||
                bankerMode == 3 ||
                bankerMode == 4 ||
                bankerMode == 5
            ) {
                //自由抢庄 通比牛牛 固定庄家 转庄牛牛
                pokers.forEach((poker, index) => {
                    poker.pokerId = cards[index];
                });
                if (th.room.banker_mode != 4) {
                    //通比牛牛通比牛牛不用开牌，因为mycard直接把牌发来了
                    pokers.forEach((poker, idx) => {
                        if (idx >= showCard) return;
                        this.showOpenPokerAnim(poker);
                    });
                }
            } else if (bankerMode == 2) {
                //明牌抢庄
                pokers.forEach((poker, index) => {
                    if (index >= showCard) {
                        poker.pokerId = cards[index];
                    }
                });
            }

            this.setCountdown(data.limit_time, "摊牌开始了");

            this.scheduleOnce(() => {
                //如果时间到还没摊牌就摊牌
                if (th.getMyselfPlayer().account_status == 7) {
                    this.onShowClicked();
                }
            }, data.limit_time);

            data.data.forEach(item => {
                let player = th.getPlayerById(item.account_id);
                this.initSingleSeat(player);
            });
        });

        //摊牌
        this.node.on("UpdateAccountShow", player => {
            cc.log("<<<===[UpdateAccountShow] GmaeNN:", player);
            const index = th.getLocalIndex(player.serial_num - 1);
            const nodePoker = this.nodePokers[index];
            const nodeSeat = this.nodeSeats[index];
            let pokers = nodePoker.children;

            // 大于0为有牛
            let hasNiu =
                th.getNiuIndex(player.card_type, player.combo_point) > 0;
            let cards = hasNiu > 0 ? player.combo_array : player.cards;
            //如果不是自己
            //(isMyself ? 100 : seat.x > 0 ? -210 : 90) + basePokers.y +i * (isMyself ? 110 : 30),
            // isMyself ? -25 : 0,
            let isMyself = th.getMyselfLocalIndex() == index;
            let firstX = isMyself ? 100 : nodeSeat.x > 0 ? -210 : 90;
            let firstY = isMyself ? -25 : 0;
            let offset = isMyself ? 110 : 30;
            pokers.forEach((poker, index) => {
                poker.runAction(
                    cc.sequence(
                        cc.moveTo(0.3, cc.v2(firstX, firstY)),
                        cc.callFunc(target => {
                            target.addChild(
                                th.pokerManager.getPokerSpriteById(cards[index])
                            );
                        }),
                        cc.moveTo(
                            0.3,
                            cc.v2(
                                firstX +
                                    nodePoker.y +
                                    index * offset +
                                    (hasNiu && index > 2 ? 15 : 0),
                                firstY
                            )
                        )
                    )
                );
            });
            this.showNiuType(player);
        });

        //结果
        this.node.on("Win", data => {
            cc.log("<<<===[Win] GmaeNN:", data);
            //赢的人
            //let win = data.winner_array;
            //输的人
            //let lose = data.loser_array;
            this.scheduleOnce(() => {
                this.nodeAmins.removeAllChildren();

                cc.log("TODO 飞筹码效果");
                //通比牛牛先飞向最大的人，否则先飞向庄
                let tagerPalyer =
                    th.room.banker_mode == 4
                        ? th.getPlayerById(data.winner_array[0].account_id)
                        : th.getBankerPlayer();

                const seatxy = th.getSeatXY();
                const index = th.getLocalIndex(tagerPalyer.serial_num - 1);
                let [tx, ty] = seatxy[index];
                //输得的人先飞向tagerPalyer
                th.audioManager.playSFX("coin.mp3");
                data.loser_array.forEach(loser => {
                    if (loser.account_id != tagerPalyer.account_id) {
                        const player = th.getPlayerById(loser.account_id);
                        const index = th.getLocalIndex(player.serial_num - 1);
                        let [x, y] = seatxy[index];
                        for (let i = 0; i < 5; i++) {
                            let coin = cc.instantiate(this.coinPrefab);
                            coin.x = x;
                            coin.y = y;
                            this.nodeAmins.addChild(coin);
                            coin.runAction(
                                cc.sequence(
                                    cc.delayTime(0.1 + i * 0.05),
                                    cc
                                        .moveTo(0.5, cc.v2(tx, ty))
                                        .easing(cc.easeSineOut()),
                                    cc.callFunc(target => {
                                        target.removeFromParent();
                                    })
                                )
                            );
                        }
                    }
                });
                let loserCount = data.loser_array.filter(
                    loser => loser.account_id != tagerPalyer.account_id
                ).length;
                //this.nodeAmins.removeAllChildren();
                this.scheduleOnce(() => {
                    //tagerPalyer输得的人先飞向赢的人
                    th.audioManager.playSFX("coin.mp3");
                    data.winner_array.forEach(winer => {
                        if (winer.account_id != tagerPalyer.account_id) {
                            const player = th.getPlayerById(winer.account_id);
                            const index = th.getLocalIndex(
                                player.serial_num - 1
                            );
                            let [x, y] = seatxy[index];
                            for (let i = 0; i < 5; i++) {
                                let coin = cc.instantiate(this.coinPrefab);
                                coin.x = tx;
                                coin.y = ty;
                                this.nodeAmins.addChild(coin);
                                coin.runAction(
                                    cc.sequence(
                                        cc.delayTime(0.1 + i * 0.05),
                                        cc
                                            .moveTo(0.5, cc.v2(x, y))
                                            .easing(cc.easeSineOut()),
                                        cc.callFunc(target => {
                                            target.removeFromParent();
                                        })
                                    )
                                );
                            }
                        }
                    });
                }, 0.1 + 0.5 + loserCount * 0.05);

                let winerCount = data.winner_array.filter(
                    winner => winner.account_id != tagerPalyer.account_id
                ).length;

                let offsetCount = loserCount + winerCount;
                cc.log("==================offsetCount:", offsetCount);

                this.scheduleOnce(() => {
                    let score_board = data.score_board;
                    let account_ids = Object.keys(score_board);
                    cc.log("AccountIds:", account_ids);
                    account_ids.forEach(account_id => {
                        const player = th.getPlayerById(account_id);
                        player.account_score = score_board[account_id];
                        const index = th.getLocalIndex(player.serial_num - 1);
                        this.componentSeats[index].setScoreAnim(
                            player.account_score
                        );
                    });
                }, 0.1 + 0.5 + offsetCount * 0.05 + 0.5);

                this.scheduleOnce(() => {
                    th.clear();
                    th.room.players.forEach(player => {
                        const index = th.getLocalIndex(player.serial_num - 1);
                        this.componentSeats[index].setBanker(player.is_banker);
                    });
                    this.nodePokers.forEach(node => {
                        node.removeAllChildren();
                    });
                    th.room.players.forEach(player => {
                        this.initSingleSeat(player);
                    });
                    this.refreshOptions();
                    if (th.room.game_num == th.room.total_num) {
                        cc.log("done........................");
                        th.wc.show("下在获取战绩");
                        this.toConnectApi();
                    }
                }, 0.1 + 0.5 + offsetCount * 0.05 + 3);
            }, 1);
        });

        //战绩
        this.node.on("getScoreBoard", data => {
            cc.log("<<<===[getScoreBoard] GameNN:", data);
            th.wc.hide();
            this.resultNode.x = 0;
            this.resultNode.y = 0;
            this.resultNode.active = true;
            let {
                room_number,
                time,
                total_num,
                room_creator,
                scoreboard
            } = data.balance_scoreboard;

            this.resultNode
                .getChildByName("lbl_roomId")
                .getComponent("cc.Label").string = "房间号：" + room_number;

            this.resultNode
                .getChildByName("lbl_time")
                .getComponent("cc.Label").string = time;

            this.resultNode
                .getChildByName("lbl_round")
                .getComponent("cc.Label").string = total_num + "局";

            this.resultNode
                .getChildByName("lbl_banker")
                .getComponent("cc.Label").string = "房主：" + room_creator;

            let itemNode = this.resultNode
                .getChildByName("results")
                .getChildByName("view")
                .getChildByName("content");
            itemNode.removeAllChildren();
            scoreboard.forEach((player, index) => {
                let item = cc.instantiate(this.resultItemPrefab);
                item.getChildByName("lbl_id").getComponent("cc.Label").string =
                    "ID：" + player.account_id;
                item
                    .getChildByName("lbl_name")
                    .getComponent("cc.Label").string = player.name;
                item
                    .getChildByName("lbl_score")
                    .getComponent("cc.Label").string = player.score;

                let headImg = item
                    .getChildByName("headImg")
                    .getComponent("cc.Sprite");
                cc.loader.load(
                    {
                        url: player.avatar,
                        type: "jpg"
                    },
                    (err, texture) => {
                        if (!err) {
                            let headSpriteFrame = new cc.SpriteFrame(
                                texture,
                                cc.Rect(0, 0, texture.width, texture.height)
                            );
                            headImg.spriteFrame = headSpriteFrame;
                            headImg.node.setScale(2 - texture.width / 120);
                        }
                    }
                );

                if (index == 0) {
                    item.getChildByName("dayinjia").active = true;
                }
                itemNode.addChild(item);
            });
            //Object.assign(th.room, data);
        });

        //战绩明细
        this.node.on("getScoreDetail", data => {
            cc.log("<<<===[getScoreDetail] GameNN:", data);
            //Object.assign(th.room, data);
            th.wc.hide();
            this.resultDeatilNode.x = 0;
            this.resultDeatilNode.y = 0;
            this.resultDeatilNode.active = true;
            let { room_number, create_time, game_num, rule_text } = data;

            this.resultDeatilNode
                .getChildByName("lbl_roomId")
                .getComponent("cc.Label").string = "房间号：" + room_number;

            this.resultDeatilNode
                .getChildByName("lbl_time")
                .getComponent("cc.Label").string = create_time;

            this.resultDeatilNode
                .getChildByName("lbl_round")
                .getComponent("cc.Label").string = game_num + "局";

            this.resultDeatilNode
                .getChildByName("lbl_info")
                .getComponent("cc.Label").string = rule_text;

            let resultDetailNode = this.resultDeatilNode
                .getChildByName("results")
                .getChildByName("view")
                .getChildByName("content");

            //加载头像
            let players = {};
            data.balance_board.forEach(item => {
                players[item.name] = item;
            });

            data.player_array.forEach(player => {
                let { game_num, total_num, player_cards } = player;
                let roundNode = cc.instantiate(this.resultDetailItemPrefab);
                roundNode.height = 100 + data.balance_board.length * 100;
                roundNode
                    .getChildByName("lbl_round")
                    .getComponent(
                        "cc.Label"
                    ).string = `${game_num}/${total_num}`;
                let playersNode = roundNode.getChildByName("players");
                player_cards.forEach(item => {
                    let playerNode = cc.instantiate(
                        this.resultDetailSonItemPrefab
                    );

                    playerNode
                        .getChildByName("lbl_id")
                        .getComponent("cc.Label").string =
                        players[item.name].account_id + "";
                    playerNode
                        .getChildByName("lbl_name")
                        .getComponent("cc.Label").string = item.name + "";
                    playerNode
                        .getChildByName("lbl_mtp")
                        .getComponent("cc.Label").string = item.chip + "";
                    playerNode
                        .getChildByName("lbl_score")
                        .getComponent("cc.Label").string = item.score + "";
                    playerNode
                        .getChildByName("lbl_niu")
                        .getComponent("cc.Label").string =
                        item.card_type_str + "";
                    playerNode.getChildByName("icon_banker").active =
                        item.is_banker == 1;

                    let headimg = playerNode
                        .getChildByName("headImg")
                        .getComponent("cc.Sprite");

                    cc.loader.load(
                        {
                            url: players[item.name].avatar,
                            type: "jpg"
                        },
                        (err, texture) => {
                            if (!err) {
                                let headSpriteFrame = new cc.SpriteFrame(
                                    texture,
                                    cc.Rect(0, 0, texture.width, texture.height)
                                );
                                headimg.spriteFrame = headSpriteFrame;
                                headimg.node.setScale(2 - texture.width / 120);
                            }
                        }
                    );

                    let pokerNode = playerNode.getChildByName("pokers");
                    item.player_cards.forEach(card => {
                        pokerNode.addChild(
                            th.pokerManager.getPokerSpriteById(card)
                        );
                    });
                    playersNode.addChild(playerNode);
                });
                resultDetailNode.addChild(roundNode);
            });
        });

        this.node.on("getCopyUrl", data => {
            cc.log("<<<===[getCopyUrl] GameNN:", data);
            /*
            let result = th.webCopyString(data.url);
            cc.log("address:", data.url);
            th.msg.show(result ? "复制成功！" : "复制失败");
            */
        });

        //解散房间
        this.node.on("BreakRoom", data => {
            cc.log("<<<===[BreakRoom] GameNN:", data);
            const player = th.getMyselfPlayer();
            if (player.is_banker == 1) {
                this.toConnectApi();
            } else {
                th.alert.show(
                    "提示",
                    "庄家主动下庄，点击确定查看结算。",
                    () => {
                        this.toConnectApi();
                    },
                    true
                );
            }
            //Object.assign(th.room, data);
        });
    },
    onResultCloseClicked() {
        th.wc.show("正在返回大厅。。。");
        th.args = {};
        th.room.room_id = null;
        th.room.room_number = null;
        th.gametype = null;
        cc.director.loadScene("Hall", () => {
            th.wc.hide();
        });
    },
    onZhanjiseachClicked() {
        const params = {
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
    onResultDetailCloseClicked() {
        this.resultDeatilNode.active = false;
    },
    onChanganbaocunClicked() {
        cc.log("长按保存....");
        th.webCaptureScreen();
    },
    showNiuType(player) {
        const index = th.getLocalIndex(player.serial_num - 1);
        const nodeSeat = this.nodeSeats[index];
        const nodePoker = this.nodePokers[index];
        if (player.account_id != th.getMyselfAccountId()) {
            //th.myself.account_id 因观战修改成th.getMyselfAccountId()
            //TODO 显示牛几
            let niuType = th.pokerManager.getNiuSprite(
                player.card_type,
                player.combo_point
            );
            niuType.x = nodeSeat.x > 0 ? -160 : 150;
            niuType.y = -20;
            niuType.scale = 0.1;
            nodePoker.addChild(niuType);
            niuType.runAction(cc.scaleTo(0.3, 1.2));
        } else {
            //TODO 显示牛几
            let niuType = th.pokerManager.getNiuSprite(
                player.card_type,
                player.combo_point
            );
            niuType.x = 310;
            niuType.y = 85;
            niuType.scale = 0.1;
            nodePoker.addChild(niuType);
            niuType.runAction(cc.scaleTo(0.3, 1.5));
        }
        let niuIndex = th.getNiuIndex(player.card_type, player.combo_point);
        let mp3Name = "bull" + niuIndex + ".m4a";
        th.audioManager.playSFX(mp3Name);
    },
    initView() {
        cc.log("GameNN initView");
        this.nodeCountdown.active = false;
        this.spriteClickLookPai.node.active = false;
        this.initRoomInfo();
        this.initSeat();
        this.initMtpBtn();
        this.refreshOptions();
        cc.log("InitView:", th.room);
        cc.log("InitView:", th.myself);
        const { room_status, banker_mode, account_status } = th.room;
        cc.log("room_status, banker_mode :", room_status, banker_mode);
        if (room_status == 2) {
            //如果观战
            if (!th.myself.isPlayer) {
                th.room.players.forEach(player => {
                    player.cards = new Array(5).fill(-1);
                });
                cc.log("观战:", th.room);
                this.showPokers();
                return;
            }
            if (
                banker_mode == 1 ||
                banker_mode == 2 ||
                banker_mode == 3 ||
                banker_mode == 4
            ) {
                //是自由抢庄或者明牌抢庄直接发牌
                //通比牛牛也直接发
                //转庄牛牛也直接发
                cc.log("自由抢庄或者明牌抢庄直接发牌");
                let player = th.getMyselfPlayer();
                player.cards = th.room.cards;
                this.showPokers();
            } else if (banker_mode == 5 && account_status >= 6) {
                cc.log("固定庄家发牌");
                //固定庄家闲家下注时才发牌
                let player = th.getMyselfPlayer();
                player.cards = th.room.cards;
                this.showPokers();
            }
        }
        //是不是有庄
        let player = th.getBankerPlayer();
        if (player) {
            let index = th.getLocalIndex(player.serial_num - 1);
            this.componentSeats[index].setBanker(true);
        }
        cc.log("th.myself.isPlayer:,", th.myself.isPlayer);
        this.node.getChildByName("icon_look").active = !th.myself.isPlayer;
    },
    initMtpBtn() {
        let [mtp1, mtp2, mtp3, mtp4] = th.room.bet_type_arr;
        this.btnPlayerMtp1.node
            .getChildByName("lbl_txt")
            .getComponent("cc.Label").string = mtp1 + "倍";
        this.btnPlayerMtp2.node
            .getChildByName("lbl_txt")
            .getComponent("cc.Label").string = mtp2 + "倍";
        this.btnPlayerMtp3.node
            .getChildByName("lbl_txt")
            .getComponent("cc.Label").string = mtp3 + "倍";
        this.btnPlayerMtp4.node
            .getChildByName("lbl_txt")
            .getComponent("cc.Label").string = mtp4 + "倍";
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

        this.btnXiazhuang.node.active = false;
        this.btnShangzhuang.node.active = false;
        this.btnBuShangzhuang.node.active = false;
    },
    refreshOptions() {
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
            let noBanker = th.getBankerPlayer() == null ? true : false;
            const banker_mode = th.room.banker_mode;
            const isZYQZ = banker_mode == 1;
            const isMPQZ = banker_mode == 2;
            const isGDZJ = banker_mode == 5;

            let player = th.getMyselfPlayer();
            //准备按钮
            let isShowBtnReady =
                (player.account_status == 0 || player.account_status == 1) &&
                th.room.room_status == 1;
            this.btnReady.node.active = isShowBtnReady;
            this.sprReady.node.active = isShowBtnReady;

            this.btnXiazhuang.node.active =
                isShowBtnReady &&
                isGDZJ &&
                th.room.room_status == 1 &&
                !noBanker &&
                player.is_banker == 1 &&
                th.room.game_num >= 3;

            //抢庄按钮
            let isShowQiangBrank =
                player.account_status == 3 &&
                (th.room.room_status == 1 || th.room.room_status == 2);
            this.btnBankerMtp1.node.active = isShowQiangBrank && isMPQZ;
            this.btnBankerMtp2.node.active = isShowQiangBrank && isMPQZ;
            this.btnBankerMtp4.node.active = isShowQiangBrank && isMPQZ;
            this.btnQiang.node.active = isShowQiangBrank && isZYQZ;
            this.btnBuqiang.node.active =
                isShowQiangBrank && (isZYQZ || isMPQZ);
            this.sprQiangzhuang.node.active = isShowQiangBrank;
            //闲加倍数选择
            let isShowSelectMultiples =
                player.is_banker == 0 &&
                player.account_status == 6 &&
                (th.room.room_status == 1 || th.room.room_status == 2) &&
                player.multiples == 0;
            this.btnPlayerMtp1.node.active = isShowSelectMultiples;
            this.btnPlayerMtp2.node.active = isShowSelectMultiples;
            this.btnPlayerMtp3.node.active = isShowSelectMultiples;
            this.btnPlayerMtp4.node.active = isShowSelectMultiples;
            this.sprWaitPlayerBet.node.active = isShowSelectMultiples;
            //摊牌按钮
            let isShowText =
                player.account_status == 7 &&
                (th.room.room_status == 1 || th.room.room_status == 2) &&
                th.myself.needLookCount <= 0;
            this.btnShow.node.active = isShowText;

            let isShowClickLookPai =
                player.account_status == 7 &&
                (th.room.room_status == 1 || th.room.room_status == 2) &&
                th.myself.needLookCount > 0;
            this.spriteClickLookPai.node.active = isShowClickLookPai;
            this.sprWaitShow.node.active = isShowClickLookPai || isShowText;

            //上状不上庄按钮

            this.btnShangzhuang.node.active =
                isShowQiangBrank && isGDZJ && noBanker; //&&player.account_score>=th.room.bankerscore
            this.btnBuShangzhuang.node.active =
                isShowQiangBrank && isGDZJ && noBanker;
        }
    },
    initRoomInfo() {
        this.lblRoomInfo.string = `${th.room.game_num}/${
            th.room.total_num
        }局 底分：${th.room.base_score}分`;
    },
    initSeat() {
        const seatsxy = th.getSeatXY();
        for (let i = 0; i < seatsxy.length; i++) {
            let [x, y] = seatsxy[i];
            let seat = cc.instantiate(this.seatPrefab);
            seat.x = x;
            seat.y = y;
            seat.seatIndex = i; //为座位编号
            this.baseNode.addChild(seat);
            this.nodeSeats.push(seat);
            this.componentSeats.push(seat.getComponent("Seat"));
            this.nodePokers.push(
                seat.getChildByName("info").getChildByName("pokers")
            );
        }
        const players = th.room.players;
        for (let i = 0; i < players.length; ++i) {
            cc.log(`name:${players[i].nickname}`);
            this.initSingleSeat(players[i]);
        }
    },
    initSingleSeat: function(player) {
        const index = th.getLocalIndex(player.serial_num - 1);
        this.componentSeats[index].setInfo(
            player.account_id,
            player.nickname,
            player.account_score,
            player.headimgurl,
            player.sex
        );
        this.componentSeats[index].setOffline(
            player.online_status == 1 ? false : true
        );
        /*
        this.componentSeats[index].setBanker(
            player.is_banker == 1 ? true : false
        );
        */
        this.componentSeats[index].setScore(player.account_score);
        this.componentSeats[index].setReady(player.account_status == 2);
        if (th.room.banker_mode == 4) {
            //通比牛牛没有庄
            this.componentSeats[index].setMultiples(null);
        } else {
            if (player.account_status == 4) {
                //不抢
                this.componentSeats[index].setMultiples("n");
            } else if (player.account_status == 5) {
                //抢庄
                let mtp = player.multiples != 0 ? "x" + player.multiples : "";
                this.componentSeats[index].setMultiples("y" + mtp);
            } else if (player.account_status == 6) {
                this.componentSeats[index].setMultiples(
                    player.multiples != 0 ? "x" + player.multiples : ""
                );
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
                this.componentSeats[index].setMultiples(
                    player.is_banker == 1 ? null : "x" + player.multiples
                );
            } else {
                this.componentSeats[index].setMultiples(null);
            }
        }
    },
    onCopyCliecked: function(targer, data) {
        /*
        let address = `${th.href}?roomId=${th.room.room_number}&type=${
            th.gametype
        }`;
        */
        let result = th.webCopyString(th.room.copyurl);
        cc.log("address:", th.room.copyurl);
        th.msg.show(result ? "复制成功！" : "复制失败");
    },
    onBankerMultiplesClicked: function(targer, value) {
        let multiples = 1;
        if (Number(value) == 0) {
            multiples = 1;
            th.audioManager.playSFX(`robbanker.m4a`);
        } else {
            multiples = Number(value);
            th.audioManager.playSFX(`multiples${multiples}.m4a`);
        }
        const params = {
            operation: "GrabBanker",
            account_id: th.myself.account_id,
            session: th.sign,
            data: {
                room_id: th.room.room_id,
                is_grab: 1,
                multiples: Number(multiples)
            }
        };
        cc.log("===>>>[GrabBanker] GameNN:", params);
        th.ws.send(JSON.stringify(params));
    },
    onBuqiangClicked: function() {
        th.audioManager.playSFX("nobanker.m4a");
        const params = {
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
    onReadyClicked: function() {
        cc.log("onReadyClicked");
        const params = {
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
    onPlayerMultiplesClicked: function(targer, value) {
        let multiples = targer.target.multiples;
        th.audioManager.playSFX(`multiples${multiples}.m4a`);
        const params = {
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
    onShowClicked: function(targer) {
        cc.log("onPlayerMultiplesClicked:");
        const params = {
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
    onBackClicked: function(targer) {
        th.wc.show("正在加载。。。");
        cc.director.loadScene("Hall", () => {
            th.wc.hide();
        });
    },
    onChatClicked(targer) {
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
    onMoreClicked(targer) {
        let seat = this.componentSeats[0];
        seat.setChat("伙右伙历伙");
        seat.setReady(true);
        seat.setOffline(true);
        seat.setScore("-8888");
        seat.setUserName("我的名字");
        seat.setCountdown(10);
    },
    onThemeClicked(targer) {
        let seat = this.componentSeats[0];
        seat.setChat("伙右伙历伙伙右伙历伙");
        seat.setReady(false);
        seat.setOffline(true);
        seat.setScore("+8888");
        seat.setCountdown(0);
    },
    onLookClicked(targer) {
        cc.log("onLookClickedonLookClickedonLookClickedonLookClicked");
        let result = th.webCopyString(
            "onLookClickedonLookClickedonLookClickedonLookClickedCopy"
        );
        th.msg.show(result ? "复制成功！" : "复制失败");
    },
    onPokerClicked(targer, value) {
        cc.log("Poker", targer.target.pokerId, value);
        let pokerId = targer.target.pokerId;
        if (pokerId != -1) {
            this.showOpenPokerAnim(targer.target);
            th.myself.needLookCount = th.myself.needLookCount - 1;
            this.refreshOptions();
        }
    },
    onXiazhuang(targer) {
        th.alert.show(
            "下庄提示",
            "下庄之后，将当前战绩进行结算。是否确定下庄？",
            () => {
                cc.log("下庄");
                const params = {
                    operation: "GameOver",
                    account_id: th.myself.account_id,
                    session: th.sign,
                    data: {
                        room_id: th.room.room_id
                    }
                };
                cc.log("===>>>[GameOver] GameNN:", params);
                th.ws.send(JSON.stringify(params));
            },
            true
        );
    },
    showOpenPokerAnim(poker) {
        let pokerId = poker.pokerId;
        if (pokerId != -1) {
            poker.runAction(
                cc.sequence(
                    cc.scaleTo(0.3, 0, 1),
                    cc.callFunc(target => {
                        target.addChild(
                            th.pokerManager.getPokerSpriteById(pokerId)
                        );
                    }),
                    cc.scaleTo(0.3, 1, 1),
                    cc.callFunc(traget => {
                        traget.pokerId = -1;
                    })
                )
            );
        }
    },
    showPokers() {
        //找到坐位上有人，且准备的发牌
        let seatIndexs = [];
        let players = [];
        th.room.players.forEach(player => {
            cc.log("showPokers:", player.account_status);
            if (player.account_status > 1) {
                const index = th.getLocalIndex(player.serial_num - 1);
                seatIndexs.push(index);
                players.push(player);
            }
        });
        let myLocalIndex = th.getMyselfLocalIndex();
        for (let i = 0; i < seatIndexs.length; i++) {
            let player = players[i];
            let pokerIds = player.cards;
            let isMyself = seatIndexs[i] == myLocalIndex;
            if (player.account_status == 8) {
                //摊牌
                pokerIds = player.cards;
            } else if (player.account_status == 7) {
                //没摊牌
                if (isMyself) {
                    pokerIds = new Array(5).fill(-1);
                    for (let j = 0; j < 5 - th.myself.needLookCount; j++) {
                        pokerIds[j] = player.cards[j];
                    }
                } else {
                    pokerIds = new Array(5).fill(-1);
                }
            } else {
                //其他
                pokerIds = new Array(5).fill(-1);
            }
            cc.log(player.nickname + " 发牌：", pokerIds, player.cards);
            let basePoker = this.nodePokers[seatIndexs[i]];
            basePoker.removeAllChildren();
            let realPokersIds = player.cards;
            for (let pi = 0; pi < pokerIds.length; pi++) {
                let pokerId = pokerIds[pi];
                let realPokerId = realPokersIds[pi] || -1;
                let poker = th.pokerManager.getPokerSpriteById(
                    isMyself ? -1 : pokerId
                ); //pokerId
                poker.pokerId = isMyself ? realPokerId : -1; //-1 防止其他玩家牌可以点
                poker.scale = 0.65;
                //poker.x = (seat.x > 0 ? -250 : 45) + basePoker.y + pi * 30;
                poker.position = basePoker.convertToNodeSpaceAR(
                    cc.v2(375, 603 + 60)
                );
                if (pokerId == -1) {
                    let clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                    clickEventHandler.component = "GameNN"; //这个是代码文件名
                    clickEventHandler.handler = "onPokerClicked";
                    clickEventHandler.customEventData = realPokerId;
                    poker
                        .getComponent(cc.Button)
                        .clickEvents.push(clickEventHandler);
                }
                basePoker.addChild(poker);
            }
        }
        //发牌效果
        th.audioManager.playSFX("fapai.m4a");
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < seatIndexs.length; j++) {
                let seatIndex = seatIndexs[j];
                let seat = this.nodeSeats[seatIndex];
                let basePokers = this.nodePokers[seatIndex];
                let pokers = basePokers.children;
                let poker = pokers[i];
                let isMyself = seatIndex == myLocalIndex;
                let player = players[j];
                let showCard =
                    player.account_status == 8
                        ? true
                        : i < 5 - th.myself.needLookCount;
                //cc.log(seatIndex, myLocalIndex, seatIndex == myLocalIndex);
                ((poker, delay, x, y, isMyself, showCard) => {
                    //cc.log("delay:", delay, x, y, isMyself);
                    if (isMyself) {
                        poker.runAction(
                            cc.sequence(
                                cc.delayTime(delay),
                                cc.spawn(
                                    cc.moveTo(0.2, cc.v2(x, y)),
                                    cc.scaleTo(0.2, 1)
                                ),
                                cc.callFunc(target => {
                                    if (showCard) {
                                        this.showOpenPokerAnim(target);
                                    }
                                })
                            )
                        );
                    } else {
                        poker.runAction(
                            cc.sequence(
                                cc.delayTime(delay),
                                cc.moveTo(0.2, cc.v2(x, y))
                            )
                        );
                    }
                })(
                    poker,
                    0.1 + i * 0.04 * seatIndexs.length + j * 0.04,
                    (isMyself ? 100 : seat.x > 0 ? -210 : 90) +
                        basePokers.y +
                        i * (isMyself ? 110 : 30),
                    isMyself ? -25 : 0,
                    isMyself,
                    showCard
                );
            }
        }

        //如果玩家已经 摊牌，显示牛
        for (let i = 0; i < seatIndexs.length; i++) {
            let player = players[i];
            if (player.account_status == 8) {
                this.showNiuType(player);
            }
        }
    },
    setCountdown(val, content) {
        let num = Number(val);
        this.nodeCountdown.active = num > 0 ? true : false;
        if (content) {
            this.nodeCountdown
                .getChildByName("lbl_title")
                .getComponent("cc.Label").string = content;
        } else {
            this.nodeCountdown.getChildByName("lbl_title").node.active = false;
        }
        this._countdownEndTime = Date.now() + num * 1000;
        this._alertStartTime = Date.now() + (num - 3) * 1000;
        this._isPlay = false;

        this.scheduleOnce(() => {
            if (this._countdownEndTime <= Date.now()) {
                this.nodeCountdown.active = false;
            }
        }, num + 0.1);
    },
    update: function(dt) {
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
    toConnectApi: function(targer) {
        cc.log("onCreateClicked:", this.createFrom);
        //断开大厅连接连接游戏websocket
        th.webSocketManager.connectGameServer(
            {
                ip: "47.96.177.207",
                port: 10000,
                namespace: "api"
            },
            () => {
                th.wc.show("正在获取结果...");
                const params = {
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
            }
        );
    }
});
