cc.Class({
    extends: cc.Component,

    properties: {
        gameNN: cc.Node,
        gameZJH: cc.Node,
        btnJoin: cc.Button,
        btnLook: cc.Button
    },

    onLoad: function() {
        if (th == null) {
            return;
        }
        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
    },
    start() {
        this.node.active = false;
    },
    show(type) {
        cc.log("===JoinOrLook===", type);
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
    initGameNN() {
        let lblId = this.node.getChildByName("lbl_id").getComponent("cc.Label");
        lblId.string = "您的天珠ID：" + th.myself.account_id;
        let lblMode = this.gameNN
            .getChildByName("lbl_mode")
            .getComponent("cc.Label");
        lblMode.string =
            th.room.banker_mode == 1
                ? "自由抢庄"
                : th.room.banker_mode == 2
                ? "明牌抢庄"
                : th.room.banker_mode == 3
                ? "转庄牛牛"
                : th.room.banker_mode == 4
                ? "通比牛牛"
                : th.room.banker_mode == 5
                ? "固定庄家"
                : "未知";
        let lblDifeng = this.gameNN
            .getChildByName("lbl_difeng")
            .getComponent("cc.Label");
        lblDifeng.string = th.room.score_type + "";
        let lblRenshu = this.gameNN
            .getChildByName("lbl_renshu")
            .getComponent("cc.Label");
        lblRenshu.string = th.room.max_count + "";
        /*
            th.room.max_count_type == 1
                ? "6"
                : th.room.max_count_type == 2
                ? "9"
                : th.room.max_count_type == 3
                ? "10"
                : th.room.max_count_type == 4
                ? "12"
                : th.room.max_count_type == 5
                ? "13"
                : "未知";
        */
        let lblGuize = this.gameNN
            .getChildByName("lbl_guize")
            .getComponent("cc.Label");
        lblGuize.string =
            th.room.rule_type == 1
                ? "牛牛*3，牛九*2 ，牛八*2"
                : th.room.rule_type == 2
                ? "牛牛*4，牛九*3，牛八*2，牛七*2"
                : "未知";
        let lblPaixing = this.gameNN
            .getChildByName("lbl_paixing")
            .getComponent("cc.Label");
        let paixings = [];
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
        let lblJushu = this.gameNN
            .getChildByName("lbl_jushu")
            .getComponent("cc.Label");
        let mtp =
            th.room.max_count == 6
                ? 1
                : th.room.max_count == 9 || th.room.max_count == 10
                ? 2
                : th.room.max_count == 12 || th.room.max_count == 13
                ? 3
                : 0;
        lblJushu.string =
            th.room.ticket_type * 10 +
            "局X" +
            th.room.ticket_type * mtp +
            "房卡";
        let lblBeishu = this.gameNN
            .getChildByName("lbl_beishu")
            .getComponent("cc.Label");
        lblBeishu.string =
            th.room.bet_type == 0
                ? "1，2，4，5 倍"
                : th.room.bet_type == 1
                ? "1，3，5，8 倍"
                : th.room.bet_type == 2
                ? "2，4，5，10 倍"
                : th.room.bet_type == 3
                ? "2，6，10，15 倍"
                : "未知";

        this.btnJoin.node.active = th.room.can_join == 1;
        this.btnLook.node.active = th.room.can_guest == 1;
    },
    initGameZJH() {},
    onJoinClicked: function(traget) {
        cc.log("onJoinClicked");
        th.wc.show("正在加入房间...");
        const params = {
            operation: "JoinRoom", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                room_number: th.room.room_number
            }
        };
        cc.log("===>>>[JoinRoom] JoinOrLook:", params);
        th.ws.send(JSON.stringify(params));
    },
    onLookClicked: function(traget) {
        return;
        cc.log("onLookClicked");
        th.wc.show("正在加入房间...");
        const params = {
            operation: "GuestRoom", //操作标志
            account_id: th.myself.account_id, //用户account_id};
            session: th.sign,
            data: {
                room_number: th.room.room_number
            }
        };
        cc.log("===>>>[GuestRoom] JoinOrLook:", params);
        th.ws.send(JSON.stringify(params));
    },
    start() {}
});
