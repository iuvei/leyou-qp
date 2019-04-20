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
        blink: cc.Sprite,
        chat: cc.Label,
        btnNull: cc.Button,
        userNode: cc.Node,
        multiples: cc.Label,

        nodePokers: cc.Node,

        animWinScore: cc.Label,
        animLoseScore: cc.Label,

        _userId: null,
        _userName: "--",
        _headImgUrl: null,
        _headSpriteFrame: null,
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

    onLoad() {
        if (this.chat) {
            this.chat.node.active = false;
        }
        if (this.emoji) {
            this.emoji.node.active = false;
        }
        if (this.blink) {
            this.blink.node.active = false;
        }
        if (this.animWinScore) {
            this.animWinScore.node.active = false;
        }
        if (this.animLoseScore) {
            this.animLoseScore.node.active = false;
        }
        if (this.multiples) {
            this.multiples.node.active = false;
        }
        this.refresh();
    },
    start() {},

    refresh: function() {
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
            this.ready.node.active =
                this._isReady && th.socketIOManager.status == "idle";
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

    setUserID: function(id) {
        this._userId = id;
    },

    setUserName: function(name) {
        this._userName = name;
        if (this.lblName) {
            this.lblName.string = this._userName;
        }
    },

    setSex: function(sex) {
        this._sex = sex;
    },

    setHeadImgUrl: function(headImgUrl) {
        this._headImgUrl = headImgUrl;
        if (this._headImgUrl && this.headImg) {
            //this.headwho.node.active = false;
            this.headImg.node.active = true;
            if (!this._headSpriteFrame) {
                cc.loader.load(
                    { url: this._headImgUrl, type: "jpg" },
                    (err, texture) => {
                        if (!err) {
                            cc.log(
                                this._userName + " 下载头像成功：" + headImgUrl
                            );
                            let headSpriteFrame = new cc.SpriteFrame(
                                texture,
                                cc.Rect(0, 0, texture.width, texture.height)
                            );
                            this._headSpriteFrame = headSpriteFrame;
                            this.headImg.spriteFrame = headSpriteFrame;
                            this.headImg.node.setScale(2 - texture.width / 105);
                        }
                    }
                );
            }
        } else if (!this._headImgUrl && this.headImg) {
            //this.headwho.node.active = true;
            this.headImg.node.active = false;
            this._headSpriteFrame = null;
        }
    },
    setScoreAnim: function(score) {
        let diff = Number(score) - this._score;
        if (diff == 0) return;
        let anim = diff >= 0 ? this.animWinScore : this.animLoseScore;
        anim.string = diff >= 0 ? "+" + diff : diff;
        anim.node.active = true;
        anim.node.y = 0;
        anim.node.scale = 0.5;
        anim.node.runAction(
            cc.sequence(
                cc.fadeIn(0),
                cc.spawn(cc.moveBy(1, cc.v2(0, 100)), cc.scaleTo(1, 2.5)),
                cc.fadeOut(0),
                cc.callFunc(() => {
                    this.setScore(score);
                })
            )
        );
        this._score = Number(score);
    },
    setScore: function(score) {
        if (this.lblLoseScore && this.lblWinScore) {
            this._score = Number(score);
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

    setFangzhu: function(isFangzhu) {
        this._isFangzhu = isFangzhu;
        if (this.fangzhu) {
            this.fangzhu.node.active = this._isFangzhu;
        }
    },

    setReady: function(isReady) {
        //cc.log("read:",this.node.seatIndex )
        this._isReady = isReady;
        if (this.ready) {
            let { x } = this.node;
            this.ready.node.x = x > 0 ? -100 : 100;
            if (this._isReady == true) {
                this.ready.node.scale = 0.1;
                this.ready.node.active = true;
                this.ready.node.runAction(cc.scaleTo(0.3, 1.3));
            } else {
                this.ready.node.active = false; //&& th.socketIOManager.status == "idle";
            }
        }
    },

    setBanker: function(isbanker) {
        cc.log(
            `name: ${this._userName} , this._isbanker:${
                this._isbanker
            } , isbanker:${isbanker} , result:${this._isbanker != isbanker}`
        );
        if (this._isbanker != isbanker) {
            cc.log("XXXXXXXXXXXXXXXXXXXXXXXthis._isbanker != isbanker");
            if (isbanker) {
                cc.log("YYYYYYYYYYYYYYYYYYYYthiisbanker");
                this.blink.node.active = true;
                this.blink.node.scaleX = 1;
                this.blink.node.scaleY = 0.9;
                this.blink.node.stopAllActions();
                this.blink.node.runAction(
                    cc.sequence(
                        cc.fadeIn(0),
                        cc.spawn(cc.scaleTo(0.5, 1.3), cc.fadeOut(0.5)),
                        cc.callFunc(target => {
                            cc.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZ");
                            this.banker.node.scale = 0.1;
                            this.banker.node.active = true;
                            this.banker.node.runAction(cc.scaleTo(0.3, 1));
                            target.active = false;
                        })
                    )
                );
                this.scheduleOnce(() => {
                    cc.log("WWWWWWWWWWWWWWWWWWWWWWWWWW");
                    this.banker.node.active = true;
                    this.banker.node.scale = 0.1;
                    this.banker.node.runAction(cc.scaleTo(0.3, 1));
                }, 0.5);
            } else {
                this.banker.node.scale = 1;
                this.banker.node.active = false;
            }
        }
        this._isbanker = isbanker;
    },

    setOffline: function(isOffline) {
        this._isOffline = isOffline;
        if (this.offline) {
            this.offline.node.active = this._isOffline && this._userId != null;
        }
    },

    setChat: function(content) {
        if (this.chat) {
            let { x } = this.node;
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
            this.chat.node
                .getChildByName("lbl_msg")
                .getComponent(cc.Label).string = content;
            this._lastChatTime = 3;
        }
    },

    setMultiples: function(content) {
        if (!content) {
            this.multiples.getComponent(cc.Label).string = "";
            this.multiples.node.active = false;
            return;
        }
        cc.log(`${this._userName}, multiples: ${content}`);
        this.multiples.node.active = true;
        if (this.multiples) {
            let { x } = this.node;
            if (x > 0) {
                this.multiples.node.x = -100;
                this.multiples.node.anchorX = 1;
            } else {
                this.multiples.node.x = 100;
                this.multiples.node.anchorX = 0;
            }
            this.multiples.getComponent(cc.Label).string = content;
            this.multiples.node.scale = 0.1;
            this.multiples.node.active = true;
            this.multiples.node.runAction(cc.scaleTo(0.3, 1.5));
        }
    },

    setQuickVoice: function(fileName) {
        if (this._sex == 1) {
            th.audioManager.playSFX("chat/man/Speak/M_" + fileName);
        } else {
            th.audioManager.playSFX("chat/women/Speak/W_" + fileName);
        }
    },

    setEmoji: function(idx) {
        if (this.emoji) {
            this.chat.node.active = false;
            this.emoji.node.active = true;
            var texture = cc.textureCache.addImage(
                cc.url.raw("resources/images/emoji/emoji" + idx + ".png")
            );
            //cc.log(texture);
            //cc.log(this.emoji.node.getComponent(cc.Sprite));
            //cc.log(this.emoji.spriteFrame);
            this.emoji.node
                .getComponent(cc.Sprite)
                .spriteFrame.setTexture(texture);
            /*
            cc.loader.loadRes("emoji"+idx,cc.SpriteFrame,function (err,spriteFrame) {
                this.emoji.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }.bind(this));
            */
            this._lastChatTime = 3;
        }
    },

    setInfo: function(id, name, score, headImgUrl, sex) {
        this.setUserID(id);
        this._sex = sex;
        if (id) {
            this.setUserName(name);
            this.setScore(score);
            this.setHeadImgUrl(headImgUrl);
            this.userNode.active = true;
            this.btnNull.node.active = false;
        } else {
            this.setUserName("--");
            this.setScore("--");
            this.setHeadImgUrl(null);
            this.userNode.active = false;
            this.btnNull.node.active = true;
        }
    },

    setCountdown: function(countdown) {
        this._countdown = Math.max(0, countdown);
        this._lastCountdownTime = this._countdown;
        this.countdown.node.active = countdown > 0 ? true : false;
    },

    doBlink: function() {
        this.blink.node.active = true;
        this.blink.node.scaleX = 1;
        this.blink.node.scaleY = 0.9;
        this.blink.node.runAction(
            cc.sequence(
                cc.blink(0.5, 2),
                cc.callFunc(target => {
                    target.active = false;
                })
            )
        );
    },

    update: function(dt) {
        if (this._lastChatTime > 0) {
            this._lastChatTime -= dt;
            if (this._lastChatTime < 0) {
                this.chat.node.active = false;
                this.emoji.node.active = false;
            }
        }
        if (this._lastCountdownTime > 0) {
            this._lastCountdownTime -= dt;
            this.countdown.fillRange =
                this._lastCountdownTime / this._countdown;
            if (this._lastCountdownTime < 0) {
                this._lastCountdownTime = 0;
                this._countdown = 0;
                this.countdown.active = false;
            }
        }
    }
});
