"use strict";
cc._RF.push(module, 'b2baaa/XkdKv5ET39gDTU6S', 'PokerManager');
// scripts/PokerManager.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

    onLoad: function onLoad() {
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
    getPokerSpriteById: function getPokerSpriteById(id) {
        if (Reflect.has(this.normalIds, id)) {
            var _normalIds$id = _slicedToArray(this.normalIds[id], 3),
                small = _normalIds$id[0],
                num = _normalIds$id[1],
                big = _normalIds$id[2];

            var poker = cc.instantiate(this.pokerNormal);
            var numSprite = poker.getChildByName("num").getComponent("cc.Sprite");
            numSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(num);
            var smallSprite = poker.getChildByName("flower_small").getComponent("cc.Sprite");
            smallSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(small);
            var bigSprite = poker.getChildByName("flower_big").getComponent("cc.Sprite");
            bigSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(big);
            return poker;
        } else if (Reflect.has(this.flowerIds, id)) {
            var flower = id;
            var _poker = cc.instantiate(this.pokerFlower);
            var flowerSprite = _poker.getChildByName("flower").getComponent("cc.Sprite");
            flowerSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(flower);
            return _poker;
        } else if (Reflect.has(this.ghostIds, id)) {
            var _ghostIds$id = _slicedToArray(this.ghostIds[id], 2),
                _num = _ghostIds$id[0],
                _flower = _ghostIds$id[1];

            var _poker2 = cc.instantiate(this.pokerGhost);
            var _numSprite = _poker2.getChildByName("num").getComponent("cc.Sprite");
            cc.log("ghost", _poker2, _numSprite);
            _numSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(_num);
            var _bigSprite = _poker2.getChildByName("flower_big").getComponent("cc.Sprite");
            _bigSprite.spriteFrame = this.pokerAtlas.getSpriteFrame(_flower);
            return _poker2;
        }
    },

    start: function start() {}

    // update (dt) {},

});

cc._RF.pop();