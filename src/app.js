var SocketIO = SocketIO || window.io;
var socketIOClient = null;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    id: null,
    playerName: null,
    boardNode: null,

    ctor:function () {
        this._super();

        this.playerName = Math.random().toString(36).substr(2, 5);

        var url = Constants.SOCKET_URL;
        socketIOClient = SocketIO.connect(url);

        socketIOClient.on('connect', this.onConnect.bind(this)); 
        socketIOClient.on('hello', this.onHello.bind(this));

        socketIOClient.on('joinGameSucceeded', this.onJoinGameSucceeded.bind(this));
        socketIOClient.on('joinGameFailed', this.onJoinGameFailed.bind(this));

        var boardNode = new BoardNode();
        boardNode.x = cc.winSize.width / 2;
        boardNode.y = cc.winSize.height / 2;
        this.addChild(boardNode);

        this.boardNode = boardNode;
    },

    onConnect: function() {
        socketIOClient.emit('hello', this.playerName);
    },

    onHello: function(data) {       
        cc.log('Server: ' + data.message);
        cc.log('My id: ' + data.id);

        this.boardNode.setPlayerId(data.id);
        socketIOClient.emit('joinGame', {
            name: this.playerName,
            id: data.id
        });
    },

    onJoinGameSucceeded: function(data) {
        cc.log('Server: ' + data.message);

    },

    onJoinGameFailed: function(data) {
        cc.log('Server: ' + data.message)
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});