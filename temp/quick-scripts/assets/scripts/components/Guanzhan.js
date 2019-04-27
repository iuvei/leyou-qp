(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Guanzhan.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7313a5+8h5Kr4SI4JvGPqjF', 'Guanzhan', __filename);
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
        th.audioManager.playSFX("click.mp3");
        cc.log("onJoinClicked");
        cc.log("onJoinClicked");
        th.wc.show("正在加入房间...");
        var params = {
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
    onLookClicked: function onLookClicked(targer) {
        th.audioManager.playSFX("click.mp3");
        cc.log("onLookClicked");
        th.wc.show("正在加入房间...");
        var params = {
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

    onEnable: function onEnable() {}
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
        //# sourceMappingURL=Guanzhan.js.map
        