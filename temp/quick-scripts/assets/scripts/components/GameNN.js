(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/GameNN.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a6e34fDC+BAcpoXQQTJsDLe', 'GameNN', __filename);
// scripts/components/GameNN.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

cc.Class({
    extends: cc.Component,

    properties: {
        seatPrefab: cc.Prefab,
        seats: [cc.Node],
        pokersNode: cc.Node
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        cc.log("GameNN onLoad");

        /*
        const cvs = this.node.getComponent(cc.Canvas);
        const {
            width: designWidth,
            height: designHeight
        } = cc.view.getDesignResolutionSize();
        const {
            width: visibleWidth,
            height: visibleHeight
        } = cc.view.getFrameSize();
        cc.log(visibleHeight / visibleWidth, designHeight / designWidth);
        cc.log(visibleHeight / visibleWidth > designHeight / designWidth);
        if (visibleHeight / visibleWidth > designHeight / designWidth) {
            cvs.fitWidth = true;
            cvs.fitHeight = false;
            cc.log("等比拉伸宽度到全屏：FitWidth");
        } else if (visibleHeight / visibleWidth < designHeight / designWidth) {
            cvs.fitWidth = false;
            cvs.fitHeight = true;
            cc.log("等比拉伸高度到全屏：FitHeight");
        } else {
            cvs.fitWidth = true;
            cvs.fitHeight = true;
            cc.log("按比例放缩，全部展示不裁剪：ShowALl");
        }
         this.label.string = cc.view.getFrameSize();
         //cvs.fitHeight = true;
        //cvs.fitWidth = true;
        */

        //this.initSeat();
        this.intiPoker();
    },
    intiPoker: function intiPoker() {
        var pokers = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "A13", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12", "B13", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13", "D0", "E0", "A0", "B0", "C0", "N0", "M0", "F0", "G0", "H0"];

        for (var i = 0; i < pokers.length; i++) {
            var poker = th.pokerManager.getPokerSpriteById(pokers[i]);
            this.pokersNode.addChild(poker);
        }
    },
    initSeat: function initSeat() {
        var seatsxy = th.getSeatXY();
        for (var i = 50; i < seatsxy.length; i++) {
            var _seatsxy$i = _slicedToArray(seatsxy[i], 2),
                x = _seatsxy$i[0],
                y = _seatsxy$i[1];

            var seat = cc.instantiate(this.seatPrefab);
            seat.x = x;
            seat.y = y;
            this.node.addChild(seat);

            this.seats.push(seat);
        }
    },

    onBackClicked: function onBackClicked(targer) {
        th.wc.show("正在加载。。。");
        cc.director.loadScene("Hall", function () {
            th.wc.hide();
        });
    },

    onChatClicked: function onChatClicked(targer) {
        var seat = this.seats[0];
        seat.x = seat.x * -1;
    },
    onMoreClicked: function onMoreClicked(targer) {
        var seat = this.seats[0].getComponent("Seat");
        seat.setChat("伙右伙历伙");
        seat.setReady(true);
        seat.setOffline(true);
        seat.setScore("-8888");
        seat.setUserName("我的名字");
        seat.setCountdown(10);
    },
    onThemeClicked: function onThemeClicked(targer) {
        var seat = this.seats[0].getComponent("Seat");
        seat.setChat("伙右伙历伙伙右伙历伙");
        seat.setReady(false);
        seat.setOffline(true);
        seat.setScore("+8888");
        seat.setCountdown(0);
    },
    onLookClicked: function onLookClicked(targer) {
        var seat = this.seats[0].getComponent("Seat");
        seat.setCountdown(10);
    },


    update: function update(dt) {}
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
        //# sourceMappingURL=GameNN.js.map
        