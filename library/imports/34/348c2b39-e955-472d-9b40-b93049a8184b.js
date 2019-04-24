"use strict";
cc._RF.push(module, '348c2s56VVHLZtAuTBJqBhL', 'Chat');
// scripts/components/Chat.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        queckChatNode: cc.Node,
        emojiNode: cc.Node
    },

    onLoad: function onLoad() {
        if (th == null) {
            return;
        }
        this.node.active = false;
    },

    // update: function (dt) {

    // },

    onEnable: function onEnable() {},

    onCloseClicked: function onCloseClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.node.active = false;
    },

    onQuickChatToggleClicked: function onQuickChatToggleClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.queckChatNode.active = true;
        this.emojiNode.active = false;
    },

    onEmojiToggleClicked: function onEmojiToggleClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.queckChatNode.active = false;
        this.emojiNode.active = true;
    },

    onQuickChatClicked: function onQuickChatClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.queckChatNode.active = true;
        this.emojiNode.active = false;
        this.node.active = false;
        cc.log("value:", value);

        var params = {
            operation: "BroadcastVoice", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                room_id: th.room.room_id,
                voice_num: "q" + value
            }
        };
        cc.log("===>>>[BroadcastVoice] Chat:", params);
        th.ws.send(JSON.stringify(params));
        this.node.parent.emit("BroadcastVoice", {
            account_id: th.myself.account_id,
            voice_num: "q" + value
        });
    },

    onEmojiClicked: function onEmojiClicked(targer, value) {
        th.audioManager.playSFX("click.mp3");
        this.queckChatNode.active = false;
        this.emojiNode.active = true;
        this.node.active = false;
        cc.log("value:", value);

        var params = {
            operation: "BroadcastVoice", //操作标志
            account_id: th.myself.account_id, //用户id};
            session: th.sign,
            data: {
                room_id: th.room.room_id,
                voice_num: "e" + value
            }
        };
        cc.log("===>>>[BroadcastVoice] Chat:", params);
        th.ws.send(JSON.stringify(params));
        this.node.parent.emit("BroadcastVoice", {
            account_id: th.myself.account_id,
            voice_num: "e" + value
        });
    }
});

cc._RF.pop();