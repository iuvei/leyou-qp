cc.Class({
    extends: cc.Component,

    properties: {
        dock: cc.Node,
        dating: cc.Node,
        yuleting: cc.Node,
        zhanji: cc.Node,
        gerenzhongxin: cc.Node,
        selectNN: cc.Node,
        selectZJH: cc.Node,
        voiceToggle: cc.Toggle,
        fangzuobi: cc.Node,
        bangdingshouji: cc.Node,
        sendfangka: cc.Node,
        zhanjitongji: cc.Node,
        shimingrenzheng: cc.Node,

        //用户信息
        lblId: cc.Label,
        lblName: cc.Label,
        lblFangka: cc.Label,
        lblPhone: cc.Label,
        headImg: cc.Sprite,

        //
        createNN: cc.Node,
        createZJH: cc.Node,
        createNNComponent: cc.Class,
        createZJHComponent: cc.Class,

        //当前选择游戏的node
        selectGame: cc.Node,
        //当前创建游戏的node
        createGame: cc.Node,

        //观战或者加拉游戏
        joinOrLook: cc.Node
    },

    onLoad: function() {
        //cc.log("Hall onload.");
        if (th == null) {
            return;
        }
        this.initEventHandlers();
        this.initUserInfo();
        this.createNNComponent = this.node
            .getChildByName("CreateNN")
            .getComponent("CreateNN");
        this.createZJHComponent = this.node
            .getChildByName("CreateZJH")
            .getComponent("CreateZJH");
        cc.log("args:", th.args);
        if (th.args.roomId && th.args.type) {
            cc.log(`直接进入房间：${th.args.type}==${th.args.roomId}`);
            th.room.room_number = th.args.roomId;
            th.wc.show("正在加入游戏...");
            if (th.args.type == "nn") {
                th.webSocketManager.connectGameServer(
                    {
                        ip: "47.96.177.207",
                        port: 10000,
                        namespace: "gamebdn"
                    },
                    () => {
                        let params = {
                            operation: "PrepareJoinRoom",
                            account_id: th.myself.account_id, //用户id};
                            session: th.sign,
                            data: {
                                room_number: th.args.roomId
                            }
                        };
                        cc.log("===>>>[PrepareJoinRoom] Hall:", params);
                        th.ws.send(JSON.stringify(params));
                    }
                );
            } else {
                cc.err("游戏类型错误：" + th.args.type);
            }
        }
    },
    onEnable() {
        cc.log("Hall onEnable");
    },
    start() {
        cc.log("Hall start");
    },
    initEventHandlers() {
        cc.log("Hall initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;

        this.node.on("game_connect_success", () => {
            //分发给子节点
            if (this.createGame) {
                this.createGame.emit("game_connect_success");
            }
        });

        this.node.on("CreateRoom", () => {
            cc.log("<<<===[CreateRoom] Hall");
            this.createGame.active = false;
            this.selectGame.active = false;
            this.topToBottomAnim(this.selectGame);
        });
        this.node.on("PrepareJoinRoom", data => {
            cc.log("<<<===[PrepareJoinRoom],Hall");
            if (data.room_status == 4) {
                th.alert.show("提示", "房间已经关闭");
                return;
            }
            th.wc.hide();
            this.joinOrLook.getComponent("JoinOrLook").show(th.gametype);
        });
    },
    initUserInfo() {
        this.lblId.string = th.myself.account_id;
        this.lblName.string = th.myself.nickname;
        this.lblFangka.string = "x" + th.myself.account_ticket;
        this.lblPhone.string = th.myself.phone;

        if (!th.myself.headSpriteFrame && th.myself.headimgurl) {
            cc.loader.load(
                { url: th.myself.headimgurl, type: "jpg" },
                (err, texture) => {
                    if (!err) {
                        cc.log(
                            th.myself.nickname +
                                " 下载头像成功：" +
                                th.myself.headimgurl
                        );
                        let headSpriteFrame = new cc.SpriteFrame(
                            texture,
                            cc.Rect(0, 0, texture.width, texture.height)
                        );
                        th.myself.headSpriteFrame = headSpriteFrame;
                        this.headImg.spriteFrame = headSpriteFrame;
                        this.headImg.node.setScale(2 - texture.width / 105);
                    }
                }
            );
        }
    },
    onEnable() {
        //cc.log("Hall onEnable.");
        const bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm != "0") {
            th.audioManager.setBGMVolume(bgm);
            this.voiceToggle.isChecked = false;
        } else {
            this.voiceToggle.isChecked = true;
        }
    },
    start: function() {
        //cc.log("Hall start.");
    },

    update: function(dt) {},
    //房卡
    onFangkaChecked: function(trager) {
        /*
        th.ws.send(
            JSON.stringify({
                operation: "getUserInfo",
                session: "YWQ4MTBlOGM1NzcxZjNmNTJiMTY3ZTMzZmRiZmY4YjI=",
                data: {
                    token: ""
                }
            })
        );
        return;
        */
        th.wc.show("正在加载。。。");
        cc.director.loadScene("GameNN", () => {
            th.wc.hide();
        });
    },
    //防作弊
    onFzbChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.x = 0;
        this.fangzuobi.y = 0;
        this.fangzuobi.active = true;
    },
    //防作弊关闭
    onFzbCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
    },
    //防作弊提交
    onFzbYesChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
        //TODO
    },
    //绑定手机
    onBdsjChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.x = 0;
        this.bangdingshouji.y = 0;
        this.bangdingshouji.active = true;
    },
    //绑定手机关闭
    onBdsjCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
    },
    //绑定手机提交
    onBdsjYesChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
        //TODO
    },
    //历史战绩
    onZhanjiChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.dating.active = false;
        this.yuleting.active = false;
        this.zhanji.active = true;
        this.gerenzhongxin.active = false;

        this.dock
            .getChildByName("toogle_menu")
            .getComponent("cc.ToggleContainer").allowSwitchOff = true;

        this.dock
            .getChildByName("toogle_menu")
            .children.forEach((toggle, idx) => {
                if (toggle.name === "btn_zhanji") {
                    toggle.getComponent("cc.Toggle").check();
                } else {
                    toggle.getComponent("cc.Toggle").uncheck();
                }
            });
        this.dock
            .getChildByName("toogle_menu")
            .getComponent("cc.ToggleContainer").allowSwitchOff = false;
    },
    //战绩统计
    onZhanjitongjiChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.zhanjitongji.x = 0;
        this.zhanjitongji.y = 0;
        this.zhanjitongji.active = true;
    },
    //战绩统计关闭
    onZhanjitongjiCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.zhanjitongji.active = false;
    },
    //发送房卡
    onSendFangkaChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.sendfangka.x = 0;
        this.sendfangka.y = 0;
        this.sendfangka.active = true;
    },
    //发送房卡关闭
    onSendFangkaCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.sendfangka.active = false;
    },
    //实名认证房卡
    onShimingrenzhengChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.shimingrenzheng.x = 0;
        this.shimingrenzheng.y = 0;
        this.shimingrenzheng.active = true;
    },
    //实名认证关闭
    onShimingrenzhengCloseChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        this.shimingrenzheng.active = false;
    },
    //开关声音
    onVoiceChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("开关声音", trager.isChecked);
        if (trager.isChecked) {
            th.audioManager.setBGMVolume(0);
        } else {
            th.audioManager.setBGMVolume(0.5);
        }
    },
    //复制ID
    onCopyIdChecked: function(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("复制ID");
        //TODO
    },

    //大厅dock按钮点击事件
    onDockChecked: function(targer, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "dating":
                this.dating.active = true;
                this.yuleting.active = false;
                this.zhanji.active = false;
                this.gerenzhongxin.active = false;
                break;
            case "yuleting":
                this.dating.active = false;
                this.yuleting.active = true;
                this.zhanji.active = false;
                this.gerenzhongxin.active = false;
                break;
            case "zhanji":
                this.dating.active = false;
                this.yuleting.active = false;
                this.zhanji.active = true;
                this.gerenzhongxin.active = false;
                break;
            case "gerenzhongxin":
                this.dating.active = false;
                this.yuleting.active = false;
                this.zhanji.active = false;
                this.gerenzhongxin.active = true;
                break;
        }
    },
    //大厅游戏按钮点击
    onHallGameChecked: function(targer, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "nn":
                this.selectGame = this.selectNN;
                this.bottomToTopAnim(this.selectNN);
                break;
            case "zjh":
                this.selectGame = this.selectZJH;
                this.bottomToTopAnim(this.selectZJH);
                break;
        }
    },
    //选择游戏界面关闭按钮点击
    onSelectGameCloseClicked: function(targer, type) {
        th.audioManager.playSFX("click.mp3");
        this.selectGame = null;
        switch (type) {
            case "nn":
                this.topToBottomAnim(this.selectNN);
                break;
            case "zjh":
                this.topToBottomAnim(this.selectZJH);
                break;
        }
    },
    bottomToTopAnim: function(node) {
        if (node.isRun) return;
        node.position = cc.v2(0, -th.height);
        node.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    node.isRun = true;
                }),
                cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn()),
                cc.callFunc(() => {
                    node.isRun = false;
                })
            )
        );
    },
    topToBottomAnim: function(node) {
        if (node.isRun) return;
        node.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    node.isRun = true;
                }),
                cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()),
                cc.callFunc(() => {
                    node.isRun = false;
                })
            )
        );
    },
    //选择牛牛子分类
    onSelectNNChecked: function(targer, type) {
        //cc.log("牛牛选择类别:", type);
        th.audioManager.playSFX("click.mp3");
        this.createNN.x = 0;
        this.createNN.y = 0;
        this.createNNComponent.show(type);
        this.createGame = this.createNN;
    },
    //选择炸金花子分类
    onSelectZJHChecked: function(targer, type) {
        //cc.log("炸金花选择类别:", type);
        th.audioManager.playSFX("click.mp3");
        this.createZJH.x = 0;
        this.createZJH.y = 0;
        this.createZJHComponent.show(type);
        this.createGame = this.createZJH;
    }
});
