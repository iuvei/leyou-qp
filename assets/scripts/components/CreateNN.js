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
        createFrom: null
    },
    onLoad: function() {
        if (th == null) {
            return;
        }
        this.dropdown.active = false;
        this.showGhost(false);
        this.showBankScore(false);
        this.createFrom = {
            banker_mode: 1, // 2转庄牛牛 3 = 明牌抢庄 5 = 固定庄家 1 = 自由抢庄 4 = 通比牛牛
            theme: 1,
            score_type: 1, //底分 1=1分 2=2分如此类推
            ghost: 2,
            people: 6,
            rule_type: 1,

            is_cardfour: 1, //四花牛4倍
            is_cardfourtiny: 1, //四小牛4倍
            is_cardfive: 1, //五花牛5倍
            is_straight: 1, //顺子牛6倍
            is_flush: 1, //同花牛6倍
            is_calabash: 1, //葫芦牛7倍
            is_cardbomb: 1, //炸弹牛八倍
            is_sequence: 1, //同花顺牛九倍
            is_cardtiny: 1, //五小牛十倍

            bankScore: 0,
            bet_type: 1,

            ready_time: 3, //准备时间
            grab_time: 5, //抢庄时间
            bet_time: 5, //下注时间
            show_time: 3, //摊牌时间
            fangka: 1,
            auto: 0
        };
    },
    show(type) {
        cc.log("CreateNN:", type);
        switch (type) {
            case "jdnn":
                this.createFrom.people = 6;
                this.showPeoples(true, 6, 3);
                this.showGhost(false);
                //this.showMode(5);
                break;
            case "12rnn":
                this.createFrom.people = 12;
                this.showPeoples(false, 12, 5);
                this.showGhost(false);
                //this.showMode(5);
                break;
            case "13rnn":
                this.createFrom.people = 13;
                this.showPeoples(false, 13, 5);
                this.showGhost(false);
                //this.showMode(5);
                break;
            case "lznn":
                this.createFrom.people = 6;
                this.showPeoples(true, 6, 5);
                this.showGhost(true);
                this.showMode(2);
                break;
        }
        this.node.active = true;
    },
    showGhost(show) {
        this.ghost.active = show;
        this.ghostLine.node.active = show;
    },
    showBankScore(show) {
        this.bankScore.active = show;
        this.bankScoreLine.node.active = show;
    },
    showPeoples(show, people, max) {
        this.people.active = show;
        this.peopleLine.node.active = show;

        this.people
            .getChildByName("toggle")
            .getComponent("cc.ToggleContainer").allowSwitchOff = true;

        this.people.getChildByName("toggle").children.forEach((toggle, idx) => {
            toggle.active = idx < max;
            if (toggle.name === `btn_${people}ren`) {
                toggle.getComponent("cc.Toggle").check();
            } else {
                toggle.getComponent("cc.Toggle").uncheck();
            }
        });
        this.people
            .getChildByName("toggle")
            .getComponent("cc.ToggleContainer").allowSwitchOff = false;
    },
    showMode(max) {
        this.mode.getComponent("cc.ToggleContainer").allowSwitchOff = true;
        this.mode.children.forEach((toggle, idx) => {
            toggle.active = idx < max;
            if (idx === 0) {
                toggle.getComponent("cc.Toggle").check();
            } else {
                toggle.getComponent("cc.Toggle").uncheck();
            }
        });
        this.mode.getComponent("cc.ToggleContainer").allowSwitchOff = false;
    },
    onBankerModeGroupClicked: function(targer, type) {
        th.audioManager.playSFX("click.mp3");
    },
    onBankerModeClicked: function(targer, type) {
        if (targer.isChecked) {
            switch (type) {
                case "mpqz":
                    this.createFrom.banker_mode = 3;
                    this.showBankScore(false);
                    break;
                case "zjqz":
                    this.createFrom.banker_mode = 1;
                    this.showBankScore(false);
                    break;
                case "zznn":
                    this.createFrom.banker_mode = 2;
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
    onThemeClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.theme = Number(value);
    },
    onDifengClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.score_type = Number(value);
    },
    onGhostClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.ghost = Number(value);
    },
    onPeopleGrouplicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
    },
    onPeopleClicked: function(targer, value) {
        if (targer.isChecked) {
            this.createFrom.people = Number(value);
        }
    },
    onRuleClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.rule_type = Number(value);
    },
    onPaixingClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom[value] = targer.isChecked ? 1 : 0;
    },
    onBankScoreClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.bankScore = Number(value);
    },
    onBetTypeClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.bet_type = Number(value);
    },
    onShijianClicked: function(targer) {
        cc.log("onCreateClicked:", this.createFrom);
    },
    onFangkaClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.fangka = Number(value);
    },
    onAutoClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        cc.log("onAutoClicked:", targer.isChecked);
        this.createFrom.auto = targer.isChecked ? 1 : 0;
    },
    onCreateClicked: function(targer) {
        cc.log("onCreateClicked:", this.createFrom);
    },
    onShowDropDown: function(targer, val) {
        this.dropdownContent.removeAllChildren();
        this.dropdownContent.target = targer.target;
        this.dropdownContent.type = val;
        let minMax = [0, 0];
        let suffix = "秒";
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
        let [min, max] = minMax;
        for (let i = min; i <= max; i++) {
            let item = cc.instantiate(this.dropdownPrefab);
            item.val = i;
            item
                .getChildByName("lbl_remark")
                .getComponent("cc.Label").string = `${i}${suffix}`;
            if (i === min) {
                item.getComponent("cc.Toggle").check();
            } else {
                item.getComponent("cc.Toggle").uncheck();
            }
            this.dropdownContent.addChild(item);
        }
        this.dropdown.active = true;
    },
    onDropDownClicked: function(targer, val) {
        this.dropdownContent.target
            .getChildByName("lbl_value")
            .getComponent("cc.Label").string = `${targer.target.val}${
            this.dropdownContent.suffix
        }`;
        let type = this.dropdownContent.type;
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
    onDropDownCloseClicked: function(targer, val) {
        this.dropdown.active = false;
    },
    onCloseClicked: function(targer) {
        this.node.active = false;
    }
});
