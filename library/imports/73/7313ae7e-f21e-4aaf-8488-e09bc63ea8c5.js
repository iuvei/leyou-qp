"use strict";
cc._RF.push(module, '7313a5+8h5Kr4SI4JvGPqjF', 'Guanzhan');
// scripts/components/Guanzhan.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        btnJoin: cc.Button,
        btnLook: cc.Button,
        guestPrefab: cc.Prefab,
        guestsNode: cc.Node
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        this.node.active = false;
    },

    // update: function (dt) {

    // },
    show: function show() {
        var _this = this;

        this.node.active = true;
        var isPlayer = th.myself.isPlayer;
        this.btnJoin.node.active = !isPlayer;
        this.btnLook.node.active = isPlayer;
        this.guestsNode.removeAllChildren();
        //初始化观战人员
        var guests = th.room.guests;
        guests.forEach(function (guest) {
            var guestItem = cc.instantiate(_this.guestPrefab);
            guestItem.getChildByName("lbl_name").getComponent("cc.Label").string = guest.nickname;

            var headImg = guestItem.getChildByName("headImg").getComponent("cc.Sprite");
            cc.loader.load({
                url: guest.headimgurl,
                type: "jpg"
            }, function (err, texture) {
                if (!err) {
                    var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                    headImg.spriteFrame = headSpriteFrame;
                    headImg.node.setScale(2 - texture.width / 120);
                }
            });
            _this.guestsNode.addChild(guestItem);
        });
    },


    onCloseClicked: function onCloseClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.node.active = false;
    },

    onJoinClicked: function onJoinClicked(targer) {
        cc.log("onJoinClicked");
    },
    onLookClicked: function onLookClicked(targer) {
        cc.log("onLookClicked");
    },
    onEnable: function onEnable() {}
});

cc._RF.pop();