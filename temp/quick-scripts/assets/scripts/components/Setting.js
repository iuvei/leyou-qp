(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/components/Setting.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f332wjD4xIkJ2X82q3MR3t', 'Setting', __filename);
// scripts/components/Setting.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        effectSlider: cc.Slider,
        musicSlider: cc.Slider,
        effectProgressBar: cc.ProgressBar,
        musicProgressBar: cc.ProgressBar
    },

    onLoad: function onLoad() {
        if (th == null) {
            return null;
        }
        this.node.active = false;
    },

    // update: function (dt) {

    // },

    onEnable: function onEnable() {
        var bgm = cc.sys.localStorage.getItem("bgmVolume");
        if (bgm) {
            th.audioManager.setBGMVolume(parseFloat(bgm));
            this.musicSlider.progress = parseFloat(bgm);
            this.musicProgressBar.progress = parseFloat(bgm);
        }
        var sfx = cc.sys.localStorage.getItem("sfxVolume");
        if (sfx) {
            th.audioManager.setSFXVolume(parseFloat(sfx));
            this.effectSlider.progress = parseFloat(sfx);
            this.effectProgressBar.progress = parseFloat(sfx);
        }
        cc.log("bgm:", bgm, "sfx:", sfx);
    },

    onCloseClicked: function onCloseClicked() {
        th.audioManager.playSFX("click.mp3");
        this.node.active = false;
    },

    onEffectSlide: function onEffectSlide(target) {
        th.audioManager.setSFXVolume(target.progress);
        this.effectProgressBar.progress = target.progress;
    },

    onMusicSlide: function onMusicSlide(target) {
        th.audioManager.setBGMVolume(target.progress);
        this.musicProgressBar.progress = target.progress;
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
        //# sourceMappingURL=Setting.js.map
        