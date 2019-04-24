"use strict";
cc._RF.push(module, 'c98191tmshA44JIp2wmero3', 'Guize');
// scripts/components/Guize.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        gameNN: cc.Node,
        gameZJH: cc.Node
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        this.node.active = false;
    },

    // update: function (dt) {

    // },
    show: function show(type) {
        cc.log("===Guize===", type);
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
        switch (type) {
            case "nn":
                this.initGameNN();
                break;
            case "zjh":
                this.initGameZJH();
                break;
        }
    },
    initGameNN: function initGameNN() {
        var lblMode = this.node.getChildByName("lbl_mode").getComponent("cc.Label");

        lblMode.string = "模式：" + (th.room.banker_mode == 1 ? "自由抢庄" : th.room.banker_mode == 2 ? "明牌抢庄" : th.room.banker_mode == 3 ? "转庄牛牛" : th.room.banker_mode == 4 ? "通比牛牛" : th.room.banker_mode == 5 ? "固定庄家" : "未知");
        var lblDifeng = this.gameNN.getChildByName("lbl_difeng").getComponent("cc.Label");
        lblDifeng.string = th.room.score_type + "";
        var lblRenshu = this.gameNN.getChildByName("lbl_renshu").getComponent("cc.Label");
        lblRenshu.string = th.room.max_count + "";
        var lblGuize = this.gameNN.getChildByName("lbl_guize").getComponent("cc.Label");
        lblGuize.string = th.room.rule_type == 1 ? "牛牛*3，牛九*2 ，牛八*2" : th.room.rule_type == 2 ? "牛牛*4，牛九*3，牛八*2，牛七*2" : "未知";
        var lblPaixing = this.gameNN.getChildByName("lbl_paixing").getComponent("cc.Label");
        var paixings = [];
        if (th.room.is_cardfour == 1) {
            paixings.push("四花牛(4倍)");
        }
        if (th.room.is_cardfourtiny == 1) {
            paixings.push("四小牛(4倍)");
        }
        if (th.room.is_cardfive == 1) {
            paixings.push("五花牛(5倍)");
        }
        if (th.room.is_straight == 1) {
            paixings.push("顺子牛(6倍)");
        }
        if (th.room.is_flush == 1) {
            paixings.push("同花牛(6倍)");
        }
        if (th.room.is_calabash == 1) {
            paixings.push("葫芦牛(7倍)");
        }
        if (th.room.is_cardbomb == 1) {
            paixings.push("炸弹牛(8倍)");
        }
        if (th.room.is_sequence == 1) {
            paixings.push("同花顺牛(9倍)");
        }
        if (th.room.is_cardtiny == 1) {
            paixings.push("五小牛(10倍)");
        }
        lblPaixing.string = paixings.join("   ");
        var lblBeishu = this.gameNN.getChildByName("lbl_beishu").getComponent("cc.Label");
        lblBeishu.string = th.room.bet_type == 0 ? "1，2，4，5 倍" : th.room.bet_type == 1 ? "1，3，5，8 倍" : th.room.bet_type == 2 ? "2，4，5，10 倍" : th.room.bet_type == 3 ? "2，6，10，15 倍" : "未知";
    },
    initGameZJH: function initGameZJH() {},

    onCloseClicked: function onCloseClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.node.active = false;
    }
});

cc._RF.pop();