"use strict";
cc._RF.push(module, '773fdxZFshNqYWrF+ZWmpkp', 'Hall');
// scripts/components/Hall.js

"use strict";

var _cc$Class;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

cc.Class((_cc$Class = {
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
        fangzuobiWin: cc.Node,
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

    onLoad: function onLoad() {
        //cc.log("Hall onload.");
        if (th == null) {
            return;
        }
        this.initEventHandlers();
        this.initUserInfo();
        this.createNNComponent = this.node.getChildByName("CreateNN").getComponent("CreateNN");
        this.createZJHComponent = this.node.getChildByName("CreateZJH").getComponent("CreateZJH");
        cc.log("args:", th.args);
        if (th.args.roomId && th.args.type) {
            cc.log("\u76F4\u63A5\u8FDB\u5165\u623F\u95F4\uFF1A" + th.args.type + "==" + th.args.roomId);
            th.room.room_number = th.args.roomId;
            th.wc.show("正在加入游戏...");
            if (th.args.type == "nn") {
                th.webSocketManager.connectGameServer({
                    ip: "47.96.177.207",
                    port: 10000,
                    namespace: "gamebdn"
                }, function () {
                    var params = {
                        operation: "PrepareJoinRoom",
                        account_id: th.myself.account_id, //用户id};
                        session: th.sign,
                        data: {
                            room_number: th.args.roomId
                        }
                    };
                    cc.log("===>>>[PrepareJoinRoom] Hall:", params);
                    th.ws.send(JSON.stringify(params));
                });
            } else {
                cc.err("游戏类型错误：" + th.args.type);
            }
        }
    },
    onEnable: function onEnable() {
        cc.log("Hall onEnable");
    },
    start: function start() {
        cc.log("Hall start");
    },
    initEventHandlers: function initEventHandlers() {
        var _this = this;

        cc.log("Hall initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;

        this.node.on("game_connect_success", function () {
            //分发给子节点
            if (_this.createGame) {
                _this.createGame.emit("game_connect_success");
            }
        });

        this.node.on("CreateRoom", function () {
            cc.log("<<<===[CreateRoom] Hall");
            _this.createGame.active = false;
            _this.selectGame.active = false;
            _this.topToBottomAnim(_this.selectGame);
        });
        this.node.on("PrepareJoinRoom", function (data) {
            cc.log("<<<===[PrepareJoinRoom],Hall");
            if (data.room_status == 4) {
                th.alert.show("提示", "房间已经关闭");
                return;
            }
            th.wc.hide();
            _this.joinOrLook.getComponent("JoinOrLook").show(th.gametype);
        });
    },
    initUserInfo: function initUserInfo() {
        var _this2 = this;

        this.lblId.string = th.myself.account_id;
        this.lblName.string = th.myself.nickname;
        this.lblFangka.string = "x" + th.myself.account_ticket;
        this.lblPhone.string = th.myself.phone;

        if (!th.myself.headSpriteFrame && th.myself.headimgurl) {
            cc.loader.load({ url: th.myself.headimgurl, type: "jpg" }, function (err, texture) {
                if (!err) {
                    cc.log(th.myself.nickname + " 下载头像成功：" + th.myself.headimgurl);
                    var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                    th.myself.headSpriteFrame = headSpriteFrame;
                    _this2.headImg.spriteFrame = headSpriteFrame;
                    _this2.headImg.node.setScale(2 - texture.width / 105);
                }
            });
        }
    }
}, _defineProperty(_cc$Class, "onEnable", function onEnable() {
    //cc.log("Hall onEnable.");
    var bgm = cc.sys.localStorage.getItem("bgmVolume");
    if (bgm != "0") {
        th.audioManager.setBGMVolume(bgm);
        this.voiceToggle.isChecked = false;
    } else {
        this.voiceToggle.isChecked = true;
    }
}), _defineProperty(_cc$Class, "start", function start() {
    //cc.log("Hall start.");
}), _defineProperty(_cc$Class, "update", function update(dt) {}), _defineProperty(_cc$Class, "onFangkaChecked", function onFangkaChecked(trager) {}), _defineProperty(_cc$Class, "onFzbChecked", function onFzbChecked(trager) {
    /*
    th.audioManager.playSFX("click.mp3");
    this.fangzuobi.x = 0;
    this.fangzuobi.y = 0;
    this.fangzuobi.active = true;
    */
    th.audioManager.playSFX("click.mp3");
    this.fangzuobiWin.getComponent("Fangzuobi").show();
}), _defineProperty(_cc$Class, "onFzbCloseChecked", function onFzbCloseChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.fangzuobi.active = false;
}), _defineProperty(_cc$Class, "onFzbYesChecked", function onFzbYesChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.fangzuobi.active = false;
    //TODO
}), _defineProperty(_cc$Class, "onBdsjChecked", function onBdsjChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.bangdingshouji.x = 0;
    this.bangdingshouji.y = 0;
    this.bangdingshouji.active = true;
}), _defineProperty(_cc$Class, "onBdsjCloseChecked", function onBdsjCloseChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.bangdingshouji.active = false;
}), _defineProperty(_cc$Class, "onBdsjYesChecked", function onBdsjYesChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.bangdingshouji.active = false;
    //TODO
}), _defineProperty(_cc$Class, "onZhanjiChecked", function onZhanjiChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.dating.active = false;
    this.yuleting.active = false;
    this.zhanji.active = true;
    this.gerenzhongxin.active = false;

    this.dock.getChildByName("toogle_menu").getComponent("cc.ToggleContainer").allowSwitchOff = true;

    this.dock.getChildByName("toogle_menu").children.forEach(function (toggle, idx) {
        if (toggle.name === "btn_zhanji") {
            toggle.getComponent("cc.Toggle").check();
        } else {
            toggle.getComponent("cc.Toggle").uncheck();
        }
    });
    this.dock.getChildByName("toogle_menu").getComponent("cc.ToggleContainer").allowSwitchOff = false;
}), _defineProperty(_cc$Class, "onZhanjitongjiChecked", function onZhanjitongjiChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.zhanjitongji.x = 0;
    this.zhanjitongji.y = 0;
    this.zhanjitongji.active = true;
}), _defineProperty(_cc$Class, "onZhanjitongjiCloseChecked", function onZhanjitongjiCloseChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.zhanjitongji.active = false;
}), _defineProperty(_cc$Class, "onSendFangkaChecked", function onSendFangkaChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.sendfangka.x = 0;
    this.sendfangka.y = 0;
    this.sendfangka.active = true;
}), _defineProperty(_cc$Class, "onSendFangkaCloseChecked", function onSendFangkaCloseChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.sendfangka.active = false;
}), _defineProperty(_cc$Class, "onShimingrenzhengChecked", function onShimingrenzhengChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.shimingrenzheng.x = 0;
    this.shimingrenzheng.y = 0;
    this.shimingrenzheng.active = true;
}), _defineProperty(_cc$Class, "onShimingrenzhengCloseChecked", function onShimingrenzhengCloseChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    this.shimingrenzheng.active = false;
}), _defineProperty(_cc$Class, "onVoiceChecked", function onVoiceChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    cc.log("开关声音", trager.isChecked);
    if (trager.isChecked) {
        th.audioManager.setBGMVolume(0);
    } else {
        th.audioManager.setBGMVolume(0.5);
    }
}), _defineProperty(_cc$Class, "onCopyIdChecked", function onCopyIdChecked(trager) {
    th.audioManager.playSFX("click.mp3");
    cc.log("复制ID");
    //TODO
}), _defineProperty(_cc$Class, "onDockChecked", function onDockChecked(targer, type) {
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
}), _defineProperty(_cc$Class, "onHallGameChecked", function onHallGameChecked(targer, type) {
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
}), _defineProperty(_cc$Class, "onSelectGameCloseClicked", function onSelectGameCloseClicked(targer, type) {
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
}), _defineProperty(_cc$Class, "bottomToTopAnim", function bottomToTopAnim(node) {
    if (node.isRun) return;
    node.position = cc.v2(0, -th.height);
    node.runAction(cc.sequence(cc.callFunc(function () {
        node.isRun = true;
    }), cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn()), cc.callFunc(function () {
        node.isRun = false;
    })));
}), _defineProperty(_cc$Class, "topToBottomAnim", function topToBottomAnim(node) {
    if (node.isRun) return;
    node.runAction(cc.sequence(cc.callFunc(function () {
        node.isRun = true;
    }), cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()), cc.callFunc(function () {
        node.isRun = false;
    })));
}), _defineProperty(_cc$Class, "onSelectNNChecked", function onSelectNNChecked(targer, type) {
    //cc.log("牛牛选择类别:", type);
    th.audioManager.playSFX("click.mp3");
    this.createNN.x = 0;
    this.createNN.y = 0;
    this.createNNComponent.show(type);
    this.createGame = this.createNN;
}), _defineProperty(_cc$Class, "onSelectZJHChecked", function onSelectZJHChecked(targer, type) {
    //cc.log("炸金花选择类别:", type);
    th.audioManager.playSFX("click.mp3");
    this.createZJH.x = 0;
    this.createZJH.y = 0;
    this.createZJHComponent.show(type);
    this.createGame = this.createZJH;
}), _cc$Class));

cc._RF.pop();