"use strict";
cc._RF.push(module, 'a6e34fDC+BAcpoXQQTJsDLe', 'GameNN');
// scripts/components/GameNN.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

cc.Class({
    extends: cc.Component,

    properties: {
        seatPrefab: cc.Prefab
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

        this.initSeat();
    },
    initSeat: function initSeat() {
        var seatsxy = th.getSeatXY();
        for (var i = 0; i < seatsxy.length; i++) {
            var _seatsxy$i = _slicedToArray(seatsxy[i], 2),
                x = _seatsxy$i[0],
                y = _seatsxy$i[1];

            var seat = cc.instantiate(this.seatPrefab);
            seat.x = x;
            seat.y = y;
            this.node.addChild(seat);
        }
    },

    onBackClicked: function onBackClicked(targer) {
        th.wc.show("正在加载。。。");
        cc.director.loadScene("Hall", function () {
            th.wc.hide();
        });
    },

    update: function update(dt) {}
});

cc._RF.pop();