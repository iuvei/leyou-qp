"use strict";
cc._RF.push(module, 'e12c4RB1GBDZoKMb7DwPJUA', 'Zhanji');
// scripts/components/Zhanji.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onTypeClicked: function onTypeClicked(target, type) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩类别选择:", type);
        //TODO
        switch (type) {
            case "join":
                break;
            case "create":
                break;
        }
    },
    onGameClicked: function onGameClicked(traget, type) {
        th.audioManager.playSFX("click.mp3");
        cc.log("战绩游戏选择:", type);
        //TODO
        switch (type) {
            case "nn":
                break;
            case "zjh":
                break;
        }
    }
});

cc._RF.pop();