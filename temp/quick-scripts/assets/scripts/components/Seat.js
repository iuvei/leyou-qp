(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Seat.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9184bee/dtCqqHphret4VYD', 'Seat', __filename);
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
        _lastCountdownTime: -1,
        _multiples: null
    },

    onLoad: function onLoad() {
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
        var _this = this;

        this._headImgUrl = headImgUrl;
        if (this._headImgUrl && this.headImg) {
            //this.headwho.node.active = false;
            this.headImg.node.active = true;
            if (!this._headSpriteFrame) {
                cc.loader.load({ url: this._headImgUrl, type: "jpg" }, function (err, texture) {
                    if (!err) {
                        cc.log(_this._userName + " 下载头像成功：" + headImgUrl);
                        var headSpriteFrame = new cc.SpriteFrame(texture, cc.Rect(0, 0, texture.width, texture.height));
                        _this._headSpriteFrame = headSpriteFrame;
                        _this.headImg.spriteFrame = headSpriteFrame;
                        _this.headImg.node.setScale(2 - texture.width / 105);
                    }
                });
            }
        } else if (!this._headImgUrl && this.headImg) {
            //this.headwho.node.active = true;
            this.headImg.node.active = false;
            this._headSpriteFrame = null;
        }
    },
    setScoreAnim: function setScoreAnim(score) {
        var _this2 = this;

        var diff = Number(score) - this._score;
        if (diff == 0) return;
        var anim = diff >= 0 ? this.animWinScore : this.animLoseScore;
        anim.string = diff >= 0 ? "+" + diff : diff;
        anim.node.active = true;
        anim.node.y = 0;
        anim.node.scale = 0.5;
        anim.node.runAction(cc.sequence(cc.fadeIn(0), cc.spawn(cc.moveBy(1, cc.v2(0, 100)), cc.scaleTo(1, 2.5)), cc.fadeOut(0), cc.callFunc(function () {
            _this2.setScore(score);
        })));
        this._score = Number(score);
    },
    setScore: function setScore(score) {
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

    setFangzhu: function setFangzhu(isFangzhu) {
        this._isFangzhu = isFangzhu;
        if (this.fangzhu) {
            this.fangzhu.node.active = this._isFangzhu;
        }
    },

    setReady: function setReady(isReady) {
        //cc.log("read:",this.node.seatIndex )
        this._isReady = isReady;
        if (this.ready) {
            var x = this.node.x;

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

    setBanker: function setBanker(isbanker) {
        var _this3 = this;

        if (this._isbanker != isbanker) {
            if (isbanker) {
                this.blink.node.active = true;
                this.blink.node.scaleX = 1;
                this.blink.node.scaleY = 0.9;
                this.blink.node.stopAllActions();
                this.blink.node.runAction(cc.sequence(cc.fadeIn(0), cc.spawn(cc.scaleTo(0.5, 1.3), cc.fadeOut(0.5))));
                this.scheduleOnce(function () {
                    _this3.banker.node.active = true;
                    _this3.banker.node.scale = 0.1;
                    _this3.banker.node.runAction(cc.scaleTo(0.3, 1));
                }, 0.5);
            } else {
                this.banker.node.scale = 1;
                this.banker.node.active = false;
            }
        }
        this._isbanker = isbanker;
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
            this.chat.node.getChildByName("lbl_msg").getComponent(cc.Label).string = content;
            this._lastChatTime = 3;
        }
    },

    setMultiples: function setMultiples(content) {
        if (this._multiples == content) {
            return;
        }
        if (!content) {
            this.multiples.getComponent(cc.Label).string = "";
            this.multiples.node.active = false;
            return;
        }
        cc.log(this._userName + ", multiples: " + content);
        this._multiples = content;
        this.multiples.node.active = true;
        if (this.multiples) {
            var x = this.node.x;

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
            this.multiples.node.runAction(cc.scaleTo(0.3, 1.3));
        }
    },

    setQuickVoice: function setQuickVoice(idx) {
        if (this._sex == 1) {
            th.audioManager.playSFX("qc/qc" + idx);
        } else {
            th.audioManager.playSFX("qc/qc" + idx);
        }
    },

    setEmoji: function setEmoji(idx) {
        var _this4 = this;

        if (this.emoji) {
            this.emoji.node.active = true;

            this.emoji.getComponent("cc.Animation").play("emoji" + idx, function () {
                _this4.emoji.node.active = false;
            });
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
            this.userNode.active = true;
            this.btnNull.node.active = false;
        } else {
            this.setUserName("--");
            this.setScore(0);
            this.setHeadImgUrl(null);
            this.userNode.active = false;
            this.btnNull.node.active = true;
        }
    },

    setCountdown: function setCountdown(countdown) {
        this._countdown = Math.max(0, countdown);
        this._lastCountdownTime = this._countdown;
        this.countdown.node.active = countdown > 0 ? true : false;
    },

    doBlink: function doBlink() {
        this.blink.node.active = true;
        this.blink.node.scaleX = 1;
        this.blink.node.scaleY = 0.9;
        this.blink.node.runAction(cc.sequence(cc.blink(0.5, 2), cc.callFunc(function (target) {
            target.active = false;
        })));
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
        //# sourceMappingURL=Seat.js.map
        