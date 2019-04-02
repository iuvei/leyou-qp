cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume: 0.5,
        sfxVolume: 0.5,
        bgmAudioID: -1,
        sfxAudioID: -1,
        _pauseBgm: true
    },

    onLoad: function() {
        cc.log("AudioManager OnLoad.....");
    },

    init: function() {
        const bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm) {
            this.bgmVolume = parseFloat(bgm);
        } else {
            cc.sys.localStorage.setItem("bgmVolume", this.bgmVolume);
        }

        const sfx = cc.sys.localStorage.getItem("sfxVolume");
        if (sfx) {
            this.sfxVolume = parseFloat(sfx);
        } else {
            cc.sys.localStorage.setItem("sfxVolume", this.sfxVolume);
        }

        cc.game.on(cc.game.EVENT_HIDE, function() {
            cc.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function() {
            cc.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    getUrl: function(url) {
        const idx = url.lastIndexOf(".");
        const logic = idx > -1 ? url.substr(0, idx) : url;
        return `sounds\/${logic}`;
    },

    playBGM(url) {
        const audioUrl = this.getUrl(url);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this._pauseBgm = true;
        cc.loader.loadRes(audioUrl, cc.AudioClip, (err, clip) => {
            if (!err) {
                this.bgmAudioID = cc.audioEngine.play(
                    clip,
                    true,
                    this.bgmVolume
                );
            }
        });
    },

    playSFX(url) {
        const audioUrl = this.getUrl(url);
        /*
        if(this.sfxAudioID>=0){
            cc.audioEngine.stop(this.sfxAudioID);
        }
        */
        if (this.sfxVolume > 0) {
            cc.loader.loadRes(audioUrl, cc.AudioClip, (err, clip) => {
                if (!err) {
                    this.sfxAudioID = cc.audioEngine.play(
                        clip,
                        false,
                        this.sfxVolume
                    );
                }
            });
        }
    },

    setSFXVolume: function(v) {
        if (this.sfxVolume != v) {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    },

    setBGMVolume: function(v) {
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

    pauseAll: function() {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function() {
        cc.audioEngine.resumeAll();
    }
});
