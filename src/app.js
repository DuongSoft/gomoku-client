
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var boardNode = new BoardNode();
        boardNode.x = cc.winSize.width / 2;
        boardNode.y = cc.winSize.height / 2;
        this.addChild(boardNode);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

