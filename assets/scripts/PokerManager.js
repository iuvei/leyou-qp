cc.Class({
    extends: cc.Component,

    properties: {
        pokerAtlas: cc.SpriteAtlas,
        pokerNormal: cc.Prefab,
        pokerGhost: cc.Prefab,
        pokerFlower: cc.Prefab,
        normalIds: null,
        ghostIds: null,
        flowerIds: null
    },

    onLoad() {
        if (th == null) {
            return;
        }
        th.pokerManager = this;
        this.normalIds = {
            A1: ["A", "1", "A"],
            A2: ["A", "2", "A"],
            A3: ["A", "3", "A"],
            A4: ["A", "4", "A"],
            A5: ["A", "5", "A"],
            A6: ["A", "6", "A"],
            A7: ["A", "7", "A"],
            A8: ["A", "8", "A"],
            A9: ["A", "9", "A"],
            A10: ["A", "10", "A"],
            A11: ["A", "11", "11F"],
            A12: ["A", "12", "12F"],
            A13: ["A", "13", "13F"],
            B1: ["B", "1", "B"],
            B2: ["B", "2", "B"],
            B3: ["B", "3", "B"],
            B4: ["B", "4", "B"],
            B5: ["B", "5", "B"],
            B6: ["B", "6", "B"],
            B7: ["B", "7", "B"],
            B8: ["B", "8", "B"],
            B9: ["B", "9", "B"],
            B10: ["B", "10", "B"],
            B11: ["B", "11", "11F"],
            B12: ["B", "12", "12F"],
            B13: ["B", "13", "13F"],
            C1: ["C", "1", "C"],
            C2: ["C", "2", "C"],
            C3: ["C", "3", "C"],
            C4: ["C", "4", "C"],
            C5: ["C", "5", "C"],
            C6: ["C", "6", "C"],
            C7: ["C", "7", "C"],
            C8: ["C", "8", "C"],
            C9: ["C", "9", "C"],
            C10: ["C", "10", "C"],
            C11: ["C", "11", "11F"],
            C12: ["C", "12", "12F"],
            C13: ["C", "13", "13F"],
            D1: ["D", "1", "D"],
            D2: ["D", "2", "D"],
            D3: ["D", "3", "D"],
            D4: ["D", "4", "D"],
            D5: ["D", "5", "D"],
            D6: ["D", "6", "D"],
            D7: ["D", "7", "D"],
            D8: ["D", "8", "D"],
            D9: ["D", "9", "D"],
            D10: ["D", "10", "D"],
            D11: ["D", "11", "11F"],
            D12: ["D", "12", "12F"],
            D13: ["D", "13", "13F"]
        };
        this.ghostIds = {
            D0: ["14", "D0"],
            E0: ["15", "E0"]
        };
        this.flowerIds = {
            A0: null,
            B0: null,
            C0: null,
            N0: null,
            M0: null,
            F0: null,
            G0: null,
            H0: null
        };
        cc.log("PokerManager onload........");
    },

    /*
        "A1","A2","A3","A4","A5","A6","A7","A8","A9","A10","A11","A12","A13",
        "B1","B2","B3","B4","B5","B6","B7","B8","B9","B10","B11","B12","B13",
        "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C12","C13",
        "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","D11","D12","D13"
        A 方块
        B 梅花
        C 红桃
        D 黑桃
        11 J
        12 Q
        13 K
        D0 小鬼
        E0 大鬼
        A0 春
        B0 夏
        C0 秋
        N0 冬
        M0 梅
        F0 兰
        G0 竹
        H0 菊
        */
    getPokerSpriteById: function(id) {
        if (Reflect.has(this.normalIds, id)) {
            let [small, num, big] = this.normalIds[id];
            let poker = cc.instantiate(this.pokerNormal);
            let numSprite = poker
                .getChildByName("num")
                .getComponent("cc.Sprite");
            numSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(num);
            let smallSprite = poker
                .getChildByName("flower_small")
                .getComponent("cc.Sprite");
            smallSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(small);
            let bigSprite = poker
                .getChildByName("flower_big")
                .getComponent("cc.Sprite");
            bigSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(big);
            return poker;
        } else if (Reflect.has(this.flowerIds, id)) {
            let flower = id;
            let poker = cc.instantiate(this.pokerFlower);
            let flowerSprite = poker
                .getChildByName("flower")
                .getComponent("cc.Sprite");
            flowerSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(flower);
            return poker;
        } else if (Reflect.has(this.ghostIds, id)) {
            let [num, flower] = this.ghostIds[id];
            let poker = cc.instantiate(this.pokerGhost);
            let numSprite = poker
                .getChildByName("num")
                .getComponent("cc.Sprite");
            cc.log("ghost", poker, numSprite);
            numSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(num);
            let bigSprite = poker
                .getChildByName("flower_big")
                .getComponent("cc.Sprite");
            bigSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(flower);
            return poker;
        }
    },

    start() {}

    // update (dt) {},
});
