(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Fangzuobi.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '60adfMVVlFP8YOzcPpMAsQp', 'Fangzuobi', __filename);
// scripts/components/Fangzuobi.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        nobind: cc.Node,
        yesbind: cc.Node,

        lblId: cc.Label,
        lblName: cc.Label,
        lblAnhao: cc.Label,
        lblLevel: cc.Label,
        headImg: cc.Sprite,
        expBar: cc.ProgressBar,

        inputAnhao: cc.EditBox,

        _isLoadHeadImg: false
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

        this.node.x = 0;
        this.node.y = 0;
        this.node.active = true;
        if (th.myself.individuality == "" || th.myself.individuality == null) {
            cc.log("没设置暗号");
            this.nobind.active = true;
            this.yesbind.active = false;
        } else {
            cc.log("已设置暗号");
            this.nobind.active = false;
            this.yesbind.active = true;

            this.lblId.string = "ID:" + th.myself.account_id;
            this.lblName.string = th.myself.nickname;
            this.lblAnhao.string = th.myself.individuality;
            this.lblLevel.string = th.myself.level + "级";
            this.expBar.progress = parseFloat(th.myself.exp);
            if (!this._isLoadHeadImg) {
                cc.loader.load({ url: th.myself.headimgurl, type: "jpg" }, function (err, texture) {
                    if (!err) {
                        _this._isLoadHeadImg = true;
                        cc.log(th.myself.nickname + " 下载头像成功：" + th.myself.headimgurl);
                        var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                        th.myself.headSpriteFrame = headSpriteFrame;
                        _this.headImg.spriteFrame = headSpriteFrame;
                        _this.headImg.node.setScale(2 - texture.width / 105);
                    }
                });
            }
        }
    },

    onCloseClicked: function onCloseClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.node.active = false;
    },
    onSaveAanhaoClicked: function onSaveAanhaoClicked() {
        if (this.inputAnhao.string == null || this.inputAnhao.string == "" || this.inputAnhao.string.length == 0) {
            return;
        }
        var params = {
            operation: "setIndividuality", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                account_id: th.myself.account_id,
                individuality: this.inputAnhao.string
            }
        };
        cc.log("===>>>[setIndividuality] GameNN:", params);
        th.ws.send(JSON.stringify(params));
        this.node.active = false;
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
        //# sourceMappingURL=Fangzuobi.js.map
        