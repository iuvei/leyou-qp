cc.Class({
    extends: cc.Component,

    properties: {
        btnJoin: cc.Button,
        btnLook: cc.Button,
        guestPrefab: cc.Prefab,
        guestsNode: cc.Node
    },

    onLoad: function() {
        if (th == null) {
            return;
        }
        this.node.active = false;
    },

    // update: function (dt) {

    // },
    show() {
        this.node.active = true;
        let isPlayer = th.myself.isPlayer;
        this.btnJoin.node.active = !isPlayer;
        this.btnLook.node.active = isPlayer;
        this.guestsNode.removeAllChildren();
        //初始化观战人员
        let guests = th.room.guests;
        guests.forEach(guest => {
            let guestItem = cc.instantiate(this.guestPrefab);
            guestItem
                .getChildByName("lbl_name")
                .getComponent("cc.Label").string = guest.nickname;

            let headImg = guestItem
                .getChildByName("headImg")
                .getComponent("cc.Sprite");
            cc.loader.load(
                {
                    url: guest.headimgurl,
                    type: "jpg"
                },
                (err, texture) => {
                    if (!err) {
                        let headSpriteFrame = new cc.SpriteFrame(
                            texture,
                            cc.Rect(0, 0, texture.width, texture.height)
                        );
                        headImg.spriteFrame = headSpriteFrame;
                        headImg.node.setScale(2 - texture.width / 120);
                    }
                }
            );
            this.guestsNode.addChild(guestItem);
        });
    },

    onCloseClicked: function(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.node.active = false;
    },

    onJoinClicked: function(targer) {
        cc.log("onJoinClicked");
    },
    onLookClicked: function(targer) {
        cc.log("onLookClicked");
    },
    onEnable: function() {}
});
