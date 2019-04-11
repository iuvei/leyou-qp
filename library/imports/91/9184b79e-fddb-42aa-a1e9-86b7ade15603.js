"use strict";
cc._RF.push(module, '9184bee/dtCqqHphret4VYD', 'Seat');
// scripts/components/Seat.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        headImg: cc.Sprite,
        //headwho: cc.Sprite,
        lblName: cc.Label,
        lblWinScore: cc.Label,
        lblLoseScore: cc.Label,
        offline: cc.Sprite,
        fangzhu: cc.Sprite,
        ready: cc.Sprite,
        banker: cc.Sprite,
        emoji: cc.Sprite,
        countdown: cc.Sprite,
        chat: cc.Label,
        btnNull: cc.Button,
        userNode: cc.Node,

        _userId: null,
        _userName: "--",
        _headImgUrl: null,
        _sex: 0,
        _score: 0,
        _countdown: 0,
        _isOffline: false,
        _isReady: false,
        _isFangzhu: false,
        _isbanker: false,
        _lastChatTime: -1,
        _lastCountdownTime: -1
    },

    onLoad: function onLoad() {
        if (this.chat) {
            this.chat.node.active = false;
        }
        if (this.emoji) {
            this.emoji.node.active = false;
        }
        this.refresh();
    },
    start: function start() {},


    refresh: function refresh() {
        if (this._userName) {
            this.lblName.string = this._userName;
        }
        if (this._score) {
            if (this._score >= 0) {
                this.lblWinScore.string = this._score;
                this.lblWinScore.node.active = true;
                this.lblLoseScore.node.active = false;
            } else {
                this.lblLoseScore.string = this._score;
                this.lblLoseScore.node.active = true;
                this.lblWinScore.node.active = false;
            }
        }
        if (this.offline) {
            this.offline.node.active = this._isOffline && this._userId != null;
        }

        if (this.ready) {
            this.ready.node.active = this._isReady && th.socketIOManager.status == "idle";
        }
        if (this.fangzhu) {
            this.fangzhu.node.active = this._isFangzhu;
        }
        if (this.banker) {
            this.banker.node.active = this._isbanker;
        }
        if (this.countdown) {
            this.countdown.node.active = this._countdown > 0 ? true : false;
        }
        if (this.btnNull) {
            this.btnNull.node.active = this._userId ? false : true;
        }
        if (this.userNode) {
            this.userNode.active = this._userId ? true : false;
        }

        //this.node.active = this._userId!=null;
    },

    setUserID: function setUserID(id) {
        this._userId = id;
    },

    setUserName: function setUserName(name) {
        this._userName = name;
        if (this.lblName) {
            this.lblName.string = this._userName;
        }
    },

    setSex: function setSex(sex) {
        this._sex = sex;
    },

    setHeadImgUrl: function setHeadImgUrl(headImgUrl) {
        var self = this;
        this._headImgUrl = headImgUrl;
        if (this._headImgUrl && this.headImg) {
            this.headwho.node.active = false;
            this.headImg.node.active = true;
            cc.loader.load({ url: this._headImgUrl, type: "jpg" }, function (err, texture) {
                if (!err) {
                    var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                    self.headImg.spriteFrame = headSpriteFrame;
                    self.headImg.node.setScale(2 - texture.width / 94);
                }
            });
        } else if (!this._headImgUrl && self.headImg) {
            this.headwho.node.active = true;
            this.headImg.node.active = false;
        }
    },

    setScore: function setScore(score) {
        this._score = score;
        if (this.lblLoseScore && this.lblWinScore) {
            if (this._score >= 0) {
                this.lblWinScore.string = this._score;
                this.lblWinScore.node.active = true;
                this.lblLoseScore.node.active = false;
            } else {
                this.lblLoseScore.string = this._score;
                this.lblLoseScore.node.active = true;
                this.lblWinScore.node.active = false;
            }
        }
    },

    setFangzhu: function setFangzhu(isFangzhu) {
        this._isFangzhu = isFangzhu;
        if (this.fangzhu) {
            this.fangzhu.node.active = this._isFangzhu;
        }
    },

    setReady: function setReady(isReady) {
        this._isReady = isReady;
        if (this.ready) {
            var x = this.node.x;

            this.ready.node.x = x > 0 ? -88 : 88;
            this.ready.node.active = this._isReady; //&& th.socketIOManager.status == "idle";
        }
    },

    setBanker: function setBanker(isbanker) {
        this._isbanker = isbanker;
        if (this.banker) {
            this.banker.node.active = this._isbanker;
        }
    },

    setOffline: function setOffline(isOffline) {
        this._isOffline = isOffline;
        if (this.offline) {
            this.offline.node.active = this._isOffline && this._userId != null;
        }
    },

    setChat: function setChat(content) {
        if (this.chat) {
            var x = this.node.x;

            if (x > 0) {
                this.chat.node.x = -75;
                this.chat.node.anchorX = 1;
                this.chat.node.getChildByName("lbl_msg").anchorX = 1;
                this.chat.node.getChildByName("bg_left").active = false;
                this.chat.node.getChildByName("bg_right").active = true;
            } else {
                this.chat.node.x = 75;
                this.chat.node.anchorX = 0;
                this.chat.node.getChildByName("lbl_msg").anchorX = 0;
                this.chat.node.getChildByName("bg_left").active = true;
                this.chat.node.getChildByName("bg_right").active = false;
            }

            this.emoji.node.active = false;
            this.chat.node.active = true;
            this.chat.getComponent(cc.Label).string = content;
            cc.log("content:", this.chat.node.getContentSize());
            this.chat.node.getChildByName("lbl_msg").getComponent(cc.Label).string = content;
            this._lastChatTime = 3;
        }
    },

    setQuickVoice: function setQuickVoice(fileName) {
        if (this._sex == 1) {
            th.audioManager.playSFX("chat/man/Speak/M_" + fileName);
        } else {
            th.audioManager.playSFX("chat/women/Speak/W_" + fileName);
        }
    },

    setEmoji: function setEmoji(idx) {
        if (this.emoji) {
            this.chat.node.active = false;
            this.emoji.node.active = true;
            var texture = cc.textureCache.addImage(cc.url.raw("resources/images/emoji/emoji" + idx + ".png"));
            //cc.log(texture);
            //cc.log(this.emoji.node.getComponent(cc.Sprite));
            //cc.log(this.emoji.spriteFrame);
            this.emoji.node.getComponent(cc.Sprite).spriteFrame.setTexture(texture);
            /*
            cc.loader.loadRes("emoji"+idx,cc.SpriteFrame,function (err,spriteFrame) {
                this.emoji.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }.bind(this));
            */
            this._lastChatTime = 3;
        }
    },

    setInfo: function setInfo(id, name, score, headImgUrl, sex) {
        this.setUserID(id);
        this._sex = sex;
        if (id) {
            this.setUserName(name);
            this.setScore(score);
            this.setHeadImgUrl(headImgUrl);
        } else {
            this.setUserName("--");
            this.setScore("--");
            this.setHeadImgUrl(null);
        }
    },

    setCountdown: function setCountdown(countdown) {
        this._countdown = Math.max(0, countdown);
        this._lastCountdownTime = this._countdown;
        this.countdown.node.active = countdown > 0 ? true : false;
    },

    update: function update(dt) {
        if (this._lastChatTime > 0) {
            this._lastChatTime -= dt;
            if (this._lastChatTime < 0) {
                this.chat.node.active = false;
                this.emoji.node.active = false;
            }
        }
        if (this._lastCountdownTime > 0) {
            this._lastCountdownTime -= dt;
            this.countdown.fillRange = this._lastCountdownTime / this._countdown;
            if (this._lastCountdownTime < 0) {
                this._lastCountdownTime = 0;
                this._countdown = 0;
                this.countdown.active = false;
            }
        }
    }
});

cc._RF.pop();