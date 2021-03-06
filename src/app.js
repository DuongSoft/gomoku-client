var SocketIO = SocketIO || window.io;
var socketIOClient = null;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    playerName: null,
    roomId: null,

    ctor:function () {
        this._super();

        this.playerName = Math.random().toString(36).substr(2, 5);

        var url = Constants.SOCKET_URL;
        socketIOClient = SocketIO.connect(url);

        socketIOClient.on('connect', this.onConnect.bind(this)); 
        socketIOClient.on('hello', this.onHello.bind(this));

        socketIOClient.on('joinGameSucceeded', this.onJoinGameSucceeded.bind(this));

        this.roomId = window.sessionStorage.getItem("roomId");
    },

    onConnect: function() {
        socketIOClient.emit('hello', this.playerName);
    },

    onHello: function(data) {       
        cc.log('Server: ' + data.message);
        cc.log('My id: ' + data.id);
        
        var boardNode = new BoardNode(this.roomId, data.id);
        boardNode.x = cc.winSize.width / 2;
        boardNode.y = cc.winSize.height / 2;
        this.addChild(boardNode);

        if (!this.roomId) {
            socketIOClient.emit('createGame', {
                name: this.playerName
            });
        } else {
            socketIOClient.emit('joinGame', {
                gameId: this.roomId,
                name: this.playerName
            });
        }
    },

    onJoinGameSucceeded: function(data) {
        cc.log('Server: ' + data.message);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});