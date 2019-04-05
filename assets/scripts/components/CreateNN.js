cc.Class({
    extends: cc.Component,

    properties: {
        ghost: cc.Node,
        ghostLine: cc.Sprite,
        bankScore: cc.Node,
        bankScoreLine: cc.Sprite,
        people: cc.Node,
        peopleLine: cc.Sprite,
        createFrom: null
    },
    onLoad: function() {
        if (th == null) {
            return;
        }
        this.showGhost(false);
        this.showBankScore(false);
        this.createFrom = {
            mode: 1,
            theme: 1,
            difeng: 1,
            ghost: 2,
            people: 6,
            rule: 1,
            paixing: {
                shn: "shn",
                sxn: "sxn",
                whn: "whn",
                szn: "szn",
                thn: "thn",
                hln: "hln",
                zdn: "zdn",
                thsn: "thsn",
                wxn: "wxn"
            },
            bankScore: 0,
            beishu: 1,
            time: {
                ready: 3,
                qiangzhuang: 5,
                bet: 5,
                tangpai: 3
            },
            fangka: 1,
            auto: 0
        };
    },
    show(type) {
        cc.log("CreateNN:", type);
        switch (type) {
            case "jdnn":
                this.showPeoples(true, 6);
                this.showGhost(false);
                break;
            case "12rnn":
                this.showPeoples(true, 12);
                this.showGhost(false);
                break;
            case "13rnn":
                this.showPeoples(true, 13);
                this.showGhost(false);
                break;
            case "lznn":
                this.showPeoples(true, 6);
                this.showGhost(true);
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
    showPeoples(show, people) {
        this.people.active = show;
        this.peopleLine.node.active = show;
        cc.log(this.people.getChildByName("toggle").children[3]);
        this.people
            .getChildByName("toggle")
            .getChildByName(`btn_${people}ren`).isChecked = true;

        //cc.log(this.people.getChildByName("toggle"));
    },
    onModeClicked: function(targer, type) {
        th.audioManager.playSFX("click.mp3");
        switch (type) {
            case "mpqz":
                this.createFrom.mode = 1;
                this.showBankScore(false);
                break;
            case "zjqz":
                this.createFrom.mode = 2;
                this.showBankScore(false);
                break;
            case "zznn":
                this.createFrom.mode = 3;
                this.showBankScore(false);
                break;
            case "tbnn":
                this.createFrom.mode = 4;
                this.showBankScore(false);
                break;
            case "gdzj":
                this.createFrom.mode = 5;
                this.showBankScore(true);
                break;
        }
    },
    onThemeClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.theme = Number(value);
    },
    onDifengClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.difeng = Number(value);
    },
    onGhostClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.ghost = Number(value);
    },
    onPeopleClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.people = Number(value);
    },
    onRuleClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.rule = Number(value);
    },
    onPaixingClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        if (targer.isChecked) {
            this.createFrom.paixing[value] = value;
        } else {
            Reflect.deleteProperty(this.createFrom.paixing, value);
        }
    },
    onBankScoreClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.bankScore = Number(value);
    },
    onBeishuClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.createFrom.beishu = Number(value);
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
    onCloseClicked: function(targer) {
        this.node.active = false;
    }
});
