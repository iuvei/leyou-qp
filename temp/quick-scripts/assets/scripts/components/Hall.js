(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Hall.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '773fdxZFshNqYWrF+ZWmpkp', 'Hall', __filename);
// scripts/components/Hall.js

"use strict";

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
    },
    initEventHandlers: function initEventHandlers() {
        var _this = this;

        cc.log("Hall initEventHandlers()");
        th.webSocketManager.dataEventHandler = this.node;

        this.node.on("game_connect_success", function () {
            //分发给子节点
            _this.createGame.emit("game_connect_success");
        });

        this.node.on("CreateRoom", function () {
            cc.log("<<<===Hall CreateRoom");
            th.wc.hide();
            _this.createGame.active = false;
            _this.topToBottomAnim(_this.selectGame);
        });
        this.node.on("PrepareJoinRoom", function () {
            cc.log("<<<===Hall PrepareJoinRoom");
            _this.joinOrLook.getComponent("JoinOrLook").show();
        });
    },
    initUserInfo: function initUserInfo() {
        this.lblId.string = th.myself.id;
        this.lblName.string = th.myself.name;
        this.lblFangka.string = "x" + th.myself.fangka;
        this.lblPhone.string = th.myself.phone;
    },
    onEnable: function onEnable() {
        //cc.log("Hall onEnable.");
        var bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm != "0") {
            th.audioManager.setBGMVolume(bgm);
            this.voiceToggle.isChecked = false;
        } else {
            this.voiceToggle.isChecked = true;
        }
    },

    start: function start() {
        //cc.log("Hall start.");
    },

    update: function update(dt) {},
    //房卡
    onFangkaChecked: function onFangkaChecked(trager) {
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
        /*
        th.wc.show("正在加载。。。");
                cc.director.loadScene("GameNN", () => {
            th.wc.hide();
        });
        */
    },
    //防作弊
    onFzbChecked: function onFzbChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.x = 0;
        this.fangzuobi.y = 0;
        this.fangzuobi.active = true;
    },
    //防作弊关闭
    onFzbCloseChecked: function onFzbCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
    },
    //防作弊提交
    onFzbYesChecked: function onFzbYesChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.fangzuobi.active = false;
        //TODO
    },
    //绑定手机
    onBdsjChecked: function onBdsjChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.x = 0;
        this.bangdingshouji.y = 0;
        this.bangdingshouji.active = true;
    },
    //绑定手机关闭
    onBdsjCloseChecked: function onBdsjCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
    },
    //绑定手机提交
    onBdsjYesChecked: function onBdsjYesChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.bangdingshouji.active = false;
        //TODO
    },
    //历史战绩
    onZhanjiChecked: function onZhanjiChecked(trager) {
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
    },
    //战绩统计
    onZhanjitongjiChecked: function onZhanjitongjiChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.zhanjitongji.x = 0;
        this.zhanjitongji.y = 0;
        this.zhanjitongji.active = true;
    },
    //战绩统计关闭
    onZhanjitongjiCloseChecked: function onZhanjitongjiCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.zhanjitongji.active = false;
    },
    //发送房卡
    onSendFangkaChecked: function onSendFangkaChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.sendfangka.x = 0;
        this.sendfangka.y = 0;
        this.sendfangka.active = true;
    },
    //发送房卡关闭
    onSendFangkaCloseChecked: function onSendFangkaCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.sendfangka.active = false;
    },
    //实名认证房卡
    onShimingrenzhengChecked: function onShimingrenzhengChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.shimingrenzheng.x = 0;
        this.shimingrenzheng.y = 0;
        this.shimingrenzheng.active = true;
    },
    //实名认证关闭
    onShimingrenzhengCloseChecked: function onShimingrenzhengCloseChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        this.shimingrenzheng.active = false;
    },
    //开关声音
    onVoiceChecked: function onVoiceChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("开关声音", trager.isChecked);
        if (trager.isChecked) {
            th.audioManager.setBGMVolume(0);
        } else {
            th.audioManager.setBGMVolume(0.5);
        }
    },
    //复制ID
    onCopyIdChecked: function onCopyIdChecked(trager) {
        th.audioManager.playSFX("click.mp3");
        cc.log("复制ID");
        //TODO
    },

    //大厅dock按钮点击事件
    onDockChecked: function onDockChecked(targer, type) {
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
    onHallGameChecked: function onHallGameChecked(targer, type) {
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
    onSelectGameCloseClicked: function onSelectGameCloseClicked(targer, type) {
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
    bottomToTopAnim: function bottomToTopAnim(node) {
        if (node.isRun) return;
        node.position = cc.v2(0, -th.height);
        node.runAction(cc.sequence(cc.callFunc(function () {
            node.isRun = true;
        }), cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeSineIn()), cc.callFunc(function () {
            node.isRun = false;
        })));
    },
    topToBottomAnim: function topToBottomAnim(node) {
        if (node.isRun) return;
        node.runAction(cc.sequence(cc.callFunc(function () {
            node.isRun = true;
        }), cc.moveTo(0.2, cc.v2(0, -th.height)).easing(cc.easeSineIn()), cc.callFunc(function () {
            node.isRun = false;
        })));
    },
    //选择牛牛子分类
    onSelectNNChecked: function onSelectNNChecked(targer, type) {
        //cc.log("牛牛选择类别:", type);
        th.audioManager.playSFX("click.mp3");
        this.createNN.x = 0;
        this.createNN.y = 0;
        this.createNNComponent.show(type);
        this.createGame = this.createNN;
    },
    //选择炸金花子分类
    onSelectZJHChecked: function onSelectZJHChecked(targer, type) {
        //cc.log("炸金花选择类别:", type);
        th.audioManager.playSFX("click.mp3");
        this.createZJH.x = 0;
        this.createZJH.y = 0;
        this.createZJHComponent.show(type);
        this.createGame = this.createZJH;
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
        //# sourceMappingURL=Hall.js.map
        