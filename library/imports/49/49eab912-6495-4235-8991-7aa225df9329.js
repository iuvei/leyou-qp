"use strict";
cc._RF.push(module, '49eabkSZJVCNYmReqIl35Mp', 'AudioManager');
// Script/AudioManager.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume: 0.5,
        sfxVolume: 0.5,
        bgmAudioID: -1,
        sfxAudioID: -1,
        _pauseBgm: true
    },

    onLoad: function onLoad() {},

    init: function init() {
        var bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm) {
            this.bgmVolume = parseFloat(bgm);
        } else {
            cc.sys.localStorage.setItem("bgmVolume", this.bgmVolume);
        }

        var sfx = cc.sys.localStorage.getItem("sfxVolume");
        if (sfx) {
            this.sfxVolume = parseFloat(sfx);
        } else {
            cc.sys.localStorage.setItem("sfxVolume", this.sfxVolume);
        }

        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    getUrl: function getUrl(url) {
        var idx = url.lastIndexOf(".");
        var logic = idx > -1 ? url.substr(0, idx) : url;
        return "sounds/" + logic;
    },

    playBGM: function playBGM(url) {
        var _this = this;

        var audioUrl = this.getUrl(url);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this._pauseBgm = true;
        cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, clip) {
            if (!err) {
                _this.bgmAudioID = cc.audioEngine.play(clip, true, _this.bgmVolume);
            }
        });
    },
    playSFX: function playSFX(url) {
        var _this2 = this;

        var audioUrl = this.getUrl(url);
        /*
        if(this.sfxAudioID>=0){
            cc.audioEngine.stop(this.sfxAudioID);
        }
        */
        if (this.sfxVolume > 0) {
            cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, clip) {
                if (!err) {
                    _this2.sfxAudioID = cc.audioEngine.play(clip, false, _this2.sfxVolume);
                }
            });
        }
    },


    setSFXVolume: function setSFXVolume(v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    },

    setBGMVolume: function setBGMVolume(v) {
        if (this.bgmAudioID >= 0) {
            if (this._pauseBgm && v > 0) {
                this._pauseBgm = false;
                cc.audioEngine.resume(this.bgmAudioID);
            } else if (!this._pauseBgm && v == 0) {
                this._pauseBgm = true;
                cc.audioEngine.pause(this.bgmAudioID);
            }
        }
        if (this.bgmVolume != v) {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function resumeAll() {
        cc.audioEngine.resumeAll();
    }
});

cc._RF.pop();