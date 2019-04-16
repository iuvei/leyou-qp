"use strict";
cc._RF.push(module, 'f9be6OCtzFFjb+Jw0VMXcmZ', 'CreateNN');
// scripts/components/CreateNN.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

cc.Class({
    extends: cc.Component,

    properties: {
        mode: cc.Node,
        ghost: cc.Node,
        ghostLine: cc.Sprite,
        bankScore: cc.Node,
        bankScoreLine: cc.Sprite,
        people: cc.Node,
        peopleLine: cc.Sprite,
        dropdown: cc.Node,
        dropdownContent: cc.Node,
        dropdownPrefab: cc.Prefab,
        lblTicketRemark1: cc.Label,
        lblTicketRemark2: cc.Label,

        createFrom: null //创建房间有参数
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }

        this.dropdown.active = false;
        this.showGhost(false);
        this.showBankScore(false);
        //创建房间初始参数
        this.createFrom = {
            banker_mode: 1, // 3=转庄牛牛, 2 = 明牌抢庄 5 = 固定庄家 1 = 自由抢庄 4 = 通比牛牛
            theme: 1,
            score_type: 1, //底分：1=1分 2=2分如此类推
            is_laizi: 0, //赖子：0，2，4，6
            max_count_type: 1, //人数：1=6人 2=9人 3=10人 4=12人 5=13人
            rule_type: 1, //规则：1=牛牛*3，牛九*2，牛八*2   2=牛牛*4，牛九*3，牛八*2，牛七*2

            is_cardfour: 1, //四花牛4倍
            is_cardfourtiny: 1, //四小牛4倍
            is_cardfive: 1, //五花牛5倍
            is_straight: 1, //顺子牛6倍
            is_flush: 1, //同花牛6倍
            is_calabash: 1, //葫芦牛7倍
            is_cardbomb: 1, //炸弹牛八倍
            is_sequence: 1, //同花顺牛九倍
            is_cardtiny: 1, //五小牛十倍

            banker_score_type: 1, //上庄分数：1=0分，2=300分，3=500分，4=1000分，
            bet_type: 1, //倍数 1=1，2，4，5  ， 2=1，3，5，8 ， 3=2，4，5，10 ， 4=2，6，10，15

            ready_time: 3, //准备时间
            grab_time: 5, //抢庄时间
            bet_time: 5, //下注时间
            show_time: 3, //摊牌时间
            ticket_type: 1, //房卡：1=10局,2=20局
            auto: 0
        };
        this.initEventHandlers();
    },
    initEventHandlers: function initEventHandlers() {
        cc.log("CreateNN initEventHandlers()");
        this.node.on("game_connect_success", function () {
            cc.log("<<<===[game_connect_success] CreateNN");
        });
    },
    show: function show(type) {
        cc.log("CreateNN:", type);
        cc.log("createFrom:", this.createFrom);
        switch (type) {
            case "jdnn":
                this.createFrom.is_laizi = 0;
                this.createFrom.max_count_type = 1;
                this.showPeoples(true, 6, 3);
                this.showGhost(false);
                //this.showMode(5);
                break;
            case "12rnn":
                this.createFrom.is_laizi = 0;
                this.createFrom.max_count_type = 4;
                this.showPeoples(false, 12, 5);
                this.showGhost(false);
                //this.showMode(5);
                break;
            case "13rnn":
                this.createFrom.is_laizi = 0;
                this.createFrom.max_count_type = 5;
                this.showPeoples(false, 13, 5);
                this.showGhost(false);
                //this.showMode(5);
                break;
            case "lznn":
                this.createFrom.is_laizi = 2;
                this.createFrom.max_count_type = 1;
                this.showPeoples(true, 6, 5);
                this.showGhost(true);
                this.showMode(2);
                break;
        }
        this.node.active = true;
    },
    showGhost: function showGhost(show) {
        this.ghost.active = show;
        this.ghostLine.node.active = show;
    },
    showBankScore: function showBankScore(show) {
        this.bankScore.active = show;
        this.bankScoreLine.node.active = show;
    },
    showPeoples: function showPeoples(show, people, max) {
        this.people.active = show;
        this.peopleLine.node.active = show;

        this.people.getChildByName("toggle").getComponent("cc.ToggleContainer").allowSwitchOff = true;

        this.people.getChildByName("toggle").children.forEach(function (toggle, idx) {
            toggle.active = idx < max;
            if (toggle.name === "btn_" + people + "ren") {
                toggle.getComponent("cc.Toggle").check();
            } else {
                toggle.getComponent("cc.Toggle").uncheck();
            }
        });
        this.people.getChildByName("toggle").getComponent("cc.ToggleContainer").allowSwitchOff = false;
    },
    showMode: function showMode(max) {
        this.mode.getComponent("cc.ToggleContainer").allowSwitchOff = true;
        this.mode.children.forEach(function (toggle, idx) {
            toggle.active = idx < max;
            if (idx === 0) {
                toggle.getComponent("cc.Toggle").check();
            } else {
                toggle.getComponent("cc.Toggle").uncheck();
            }
        });
        this.mode.getComponent("cc.ToggleContainer").allowSwitchOff = false;
    },

    onBankerModeGroupClicked: function onBankerModeGroupClicked(targer, type) {
        th.audioManager.playSFX("click.mp3");
    },
    onBankerModeClicked: function onBankerModeClicked(targer, type) {
        if (targer.isChecked) {
            switch (type) {
                case "mpqz":
                    this.createFrom.banker_mode = 2;
                    this.showBankScore(false);
                    break;
                case "zjqz":
                    this.createFrom.banker_mode = 1;
                    this.showBankScore(false);
                    break;
                case "zznn":
                    this.createFrom.banker_mode = 3;
                    this.showBankScore(false);
                    break;
                case "tbnn":
                    this.createFrom.banker_mode = 4;
                    this.showBankScore(false);
                    break;
                case "gdzj":
                    this.createFrom.banker_mode = 5;
                    this.showBankScore(true);
                    break;
            }
        }
    },
    onThemeClicked: function onThemeClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.theme = Number(value);
    },
    onDifengClicked: function onDifengClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.score_type = Number(value);
    },
    onGhostClicked: function onGhostClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.is_laizi = Number(value);
    },
    onPeopleGrouplicked: function onPeopleGrouplicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
    },
    onPeopleClicked: function onPeopleClicked(targer, value) {
        if (targer.isChecked) {
            var num = Number(value);
            this.createFrom.max_count_type = num;
            if (num == 1) {
                this.lblTicketRemark1.string = "10局X1房卡";
                this.lblTicketRemark2.string = "20局X2房卡";
            } else if (num == 2 || num == 3) {
                this.lblTicketRemark1.string = "10局X2房卡";
                this.lblTicketRemark2.string = "20局X4房卡";
            } else if (num == 4 || num == 5) {
                this.lblTicketRemark1.string = "10局X3房卡";
                this.lblTicketRemark2.string = "20局X6房卡";
            }
        }
    },
    onRuleClicked: function onRuleClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.rule_type = Number(value);
    },
    onPaixingClicked: function onPaixingClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom[value] = targer.isChecked ? 1 : 0;
    },
    onBankScoreClicked: function onBankScoreClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.banker_score_type = Number(value);
    },
    onBetTypeClicked: function onBetTypeClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.bet_type = Number(value);
    },
    onShijianClicked: function onShijianClicked(targer) {
        cc.log("onCreateClicked:", this.createFrom);
    },
    onFangkaClicked: function onFangkaClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.ticket_type = Number(value);
    },
    onAutoClicked: function onAutoClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        cc.log("onAutoClicked:", targer.isChecked);
        this.createFrom.auto = targer.isChecked ? 1 : 0;
    },
    onShowDropDown: function onShowDropDown(targer, val) {
        this.dropdownContent.removeAllChildren();
        this.dropdownContent.target = targer.target;
        this.dropdownContent.type = val;
        var minMax = [0, 0];
        var suffix = "秒";
        switch (val) {
            case "score_type":
                minMax = [6, 100];
                suffix = "分";
                break;
            case "ready_time":
                minMax = [3, 6];
                break;
            case "grab_time":
                minMax = [5, 10];
                break;
            case "bet_time":
                minMax = [5, 10];
                break;
            case "show_time":
                minMax = [3, 6];
                break;
        }
        this.dropdownContent.suffix = suffix;

        var _minMax = minMax,
            _minMax2 = _slicedToArray(_minMax, 2),
            min = _minMax2[0],
            max = _minMax2[1];

        for (var i = min; i <= max; i++) {
            var item = cc.instantiate(this.dropdownPrefab);
            item.val = i;
            item.getChildByName("lbl_remark").getComponent("cc.Label").string = "" + i + suffix;
            if (i === min) {
                item.getComponent("cc.Toggle").check();
            } else {
                item.getComponent("cc.Toggle").uncheck();
            }
            this.dropdownContent.addChild(item);
        }
        this.dropdown.active = true;
    },
    onDropDownClicked: function onDropDownClicked(targer, val) {
        this.dropdownContent.target.getChildByName("lbl_value").getComponent("cc.Label").string = "" + targer.target.val + this.dropdownContent.suffix;
        var type = this.dropdownContent.type;
        switch (type) {
            case "score_type":
                this.createFrom.score_type = targer.target.val;
                break;
            case "ready_time":
                this.createFrom.ready_time = targer.target.val;
                break;
            case "grab_time":
                this.createFrom.grab_time = targer.target.val;
                break;
            case "bet_time":
                this.createFrom.bet_time = targer.target.val;
                break;
            case "show_time":
                this.createFrom.show_time = targer.target.val;
                break;
        }
        this.dropdown.active = false;
    },
    onDropDownCloseClicked: function onDropDownCloseClicked(targer, val) {
        this.dropdown.active = false;
    },
    onCloseClicked: function onCloseClicked(targer) {
        this.node.active = false;
    },
    randomString: function randomString(e) {
        e = e || 32;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
            a = t.length,
            n = "";
        for (var i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n;
    },

    onCreateClicked: function onCreateClicked(targer) {
        var _this = this;

        cc.log("onCreateClicked:", this.createFrom);
        //断开大厅连接连接游戏websocket
        th.webSocketManager.connectGameServer({
            ip: "47.96.177.207",
            port: 10000,
            namespace: "gamebdn"
        }, function () {
            th.wc.show("正在创建房间...");
            var roomInfo = Object.assign({}, _this.createFrom);
            roomInfo.data_key = Date.parse(new Date()) + _this.randomString(5);
            var params = {
                operation: "CreateRoom", //操作标志
                account_id: th.myself.account_id, //用户id};
                session: th.sign,
                data: roomInfo
            };
            Object.assign(th.room, roomInfo);
            cc.log("===>>>[CreateRoom] CreateNN:", params);
            th.ws.send(JSON.stringify(params));
        });
    }
});

cc._RF.pop();