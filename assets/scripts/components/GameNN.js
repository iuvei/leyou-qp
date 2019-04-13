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

    onLoad: function() {
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
    onEnable() {
        cc.log("GameNN onEnable");
    },
    start() {
        cc.log("GameNN start");
    },
    initEventHandlers() {
        cc.log("GameNN initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;

        this.node.on("CreateRoom", () => {
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
            cc.log("<<<===[UpdateAccountStatus] GmaeNN");
            this.initSingleSeat(player);
        });
    },
    initView() {
        cc.log("GameNN initView");
        this.nodeCountdown.active = false;
        this.initRoomInfo();
        this.initSeat();
        this.refreshOptions();
    },
    intiPoker() {
        let pokers = ["A1"];

        for (let i = 0; i < pokers.length; i++) {
            let poker = th.pokerManager.getPokerSpriteById(pokers[i]);
            this.pokersNode.addChild(poker);
        }
    },
    refreshOptions() {
        if (!th.myself.isPlayer) {
            //游客直接不显示
            this.nodeOptions.active = false;
        } else {
            //准备按钮
            let player = th.getMyselfPlayer();
            let showBtnReady =
                (player.account_status == 1 || player.account_status == 2) &&
                th.room.can_break == 1 &&
                th.room.game_num != th.room.total_num &&
                th.room.banker_mode == 5 &&
                player.is_banker == 1;
            this.btnReady.node.acitve = showBtnReady;
            //1倍
            //2倍
            //4倍
            //不抢
            let showBtnMtp = th.room.banker_mode == 2;
            this.btnMtp1.node.acitve = showBtnMtp;
            this.btnMtp2.node.acitve = showBtnMtp;
            this.btnMtp3.node.acitve = showBtnMtp;
            this.btnBuqiang.node.acitve = showBtnMtp;

            cc.log(showBtnReady, showBtnMtp);
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
            this.node.addChild(seat);
            this.nodeSeats.push(seat);
            this.componentSeats.push(seat.getComponent("Seat"));
            this.nodePokers.push(
                seat.getChildByName("info").getChildByName("pokers")
            );
        }
        const players = th.room.players;
        for (var i = 0; i < players.length; ++i) {
            this.initSingleSeat(players[i]);
        }
    },
    initSingleSeat: function(player) {
        const index = th.getLocalIndex(player.serial_num - 1);
        cc.log(
            `${
                player.nickname
            } local index = ${index}  serial_num=${player.serial_num - 1}`
        );
        this.componentSeats[index].setInfo(
            player.account_id,
            player.nickname,
            player.account_score,
            player.headimgurl,
            player.sex
        );
        this.componentSeats[index].setOffline(
            player.online_status == "1" ? false : true
        );
        this.componentSeats[index].setBanker(
            player.is_banker == "1" ? true : false
        );
        this.componentSeats[index].setScore(player.account_score);
    },
    onReadyClicked: function() {
        cc.log("onReadyClicked");
    },
    onMultiplesClicked: function(target, value) {
        cc.log("onMultiplesClicked");
    },
    onBackClicked: function(targer) {
        th.wc.show("正在加载。。。");
        cc.director.loadScene("Hall", () => {
            th.wc.hide();
        });
    },

    onChatClicked(targer) {
        this.setCountdown(10);
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
    onLookClicked(targer) {},
    showPokers(pokerIds) {
        //let pokerIds = ["-A9", "-A10", "-A11", "-A12", "-A13"];
        //生成牌
        for (let i = 0; i < this.nodePokers.length; i++) {
            let basePokers = this.nodePokers[i];
            basePokers.removeAllChildren();

            let pokers = [];
            for (let pi = 0; pi < pokerIds.length; pi++) {
                let poker = th.pokerManager.getPokerSpriteById(pokerIds[pi]);
                poker.scale = 0.65;
                //poker.x = (seat.x > 0 ? -250 : 45) + basePoker.y + pi * 30;
                poker.position = basePokers.convertToNodeSpaceAR(
                    cc.v2(375, 603 + 60)
                );
                basePokers.addChild(poker);
                pokers.push(poker);
            }
        }
        //发牌效果
        for (let i = 0; i < pokerIds.length; i++) {
            for (let j = 0; j < this.nodeSeats.length; j++) {
                let seat = this.nodeSeats[j];
                let basePokers = this.nodePokers[j];
                let pokers = basePokers.children;
                let poker = pokers[i];
                let isMyself = j == this.nodeSeats.length - 1;
                ((poker, delay, x, y, isMyself) => {
                    //cc.log("delay:", delay, x, y, isMyself);
                    if (isMyself) {
                        poker.runAction(
                            cc.sequence(
                                cc.delayTime(delay),
                                cc.spawn(
                                    cc.moveTo(0.2, cc.v2(x, y)),
                                    cc.scaleTo(0.2, 1)
                                )
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
                    0.1 + i * 0.04 * this.nodeSeats.length + j * 0.04,
                    (isMyself ? 100 : seat.x > 0 ? -210 : 90) +
                        basePokers.y +
                        i * (isMyself ? 110 : 30),
                    isMyself ? -25 : 0,
                    isMyself
                );
            }
        }
    },
    setCountdown(val) {
        let num = Number(val);
        cc.log("countdown num:", num > 0);
        this.nodeCountdown.active = num > 0 ? true : false;
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
            th.audioManager.playSFX("timeup_alarm.mp3");
        }
    }
});
