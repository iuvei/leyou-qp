cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function() {
        window.th = window.th || {};

        const AudioManager = require("AudioManager");
        th.audioManager = new AudioManager();
        th.audioManager.init();

        const { width, height } = this.node.getContentSize();
        cc.log(`可视窗口 width: ${width} , height: ${height}`);
        th.width = width;
        th.height = height;
    }
});
