var SocketIO = SocketIO || window.io;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        var boardNode = new BoardNode();
        boardNode.x = cc.winSize.width / 2;
        boardNode.y = cc.winSize.height / 2;
        this.addChild(boardNode);

        // var url = "http://gomoku-server.herokuapp.com";
        var url = "localhost:8080";
        var socketIOClient = SocketIO.connect(url);

        socketIOClient.on("connect", function() {
            socketIOClient.emit('client-say-hello', 'Tran Hoang Duong');
        }); 

        socketIOClient.on("server-say-hello", function(data) {
            cc.log("server response: " + data);
        })
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

