var BoardNode = cc.Node.extend({
	board: null,
	background: null,
	cursor: null,
	
	myColor: null,
	goFirst: false,
	isMyTurn: false,

	gameDidStart: false,
	gameEnded: false,

	stones: null,
	playerId: null,

	roomId: null,
	newMarker: null,

	ctor: function(roomId, playerId) {
		this._super();

		this.setupSocket();

		this.addCursor();
		this.addBackground();
		this.addMouseEventHandler();

		this.gameCount = 0;

		this.roomId = roomId || playerId;
		this.playerId = playerId;

		this.newMarker = new cc.Sprite(res.New_png);
		this.newMarker.setVisible(false);
		this.addChild(this.newMarker, 3);

		if (!roomId) {
			this.label = new StatusLabel("Waiting for other player", "Arial", 40);
			this.label.setAnchorPoint(0, 0.5);
			this.label.x -= this.label.width / 2;
			this.label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
			this.label.enableTextAnim(1, true, null,
									"Waiting for other player.", 
									"Waiting for other player..",
									"Waiting for other player...",
									"Waiting for other player....");
			this.addChild(this.label, 2);

			window.setTimeout(function() {
				window.prompt("Message this room id to play with your friend !!", this.roomId);
			}.bind(this), 1000);
			
		} else {
			this.label = new StatusLabel("Loading", "Arial", 40);
			this.label.setAnchorPoint(0, 0.5);
			this.label.x -= this.label.width / 2;
			this.label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
			this.label.enableTextAnim(1, true, null,
									"Loading.", 
									"Loading..",
									"Loading...",
									"Loading....");
			this.addChild(this.label, 2);	
		}

		this.addRoomIdLabel();
	},

	setupSocket: function() {
		socketIOClient.on('gameStarted', this.onGameStarted.bind(this));
		socketIOClient.on('turnBegan', this.onTurnBegan.bind(this));
		socketIOClient.on('turnEnded', this.onTurnEnded.bind(this));
		socketIOClient.on('setTileIndexFailed', this.onSetTileIndexFailed.bind(this));
		socketIOClient.on('opponentDisconnected', this.onOpponentDisconnected.bind(this));
		socketIOClient.on('nextGameStarted', this.onNextGameStarted.bind(this));
		socketIOClient.on('joinGameFailed', this.onJoinGameFailed.bind(this));
	},

	addBoardModel: function() {
		this.board = new Board(Constants.BoardSize.ROW, Constants.BoardSize.COL);
	},

	addBackground: function() {
		var background = new cc.Sprite(res.Grid_png);
		this.addChild(background, -1);
		this.background = background;
	},

	addRoomIdLabel: function() {
		var roomIdLabel = new cc.LabelTTF('Room ID: ' + this.roomId, 'Arial', 30);
		roomIdLabel.setFontFillColor(cc.color.WHITE);
		roomIdLabel.setOpacity(128);
		roomIdLabel.y = cc.winSize.height / 2 * 0.8;
		this.addChild(roomIdLabel);
	},

	addCursor: function() {
		var cursor = new Cursor();
		this.addChild(cursor);
		this.cursor = cursor;
	},

	addMouseEventHandler: function() {
		if (cc.sys.capabilities.hasOwnProperty('mouse')) {
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				swallowTouches: true,
				onMouseDown: this._onMouseDown.bind(this),
				onMouseUp: this._onMouseUp.bind(this),
				onMouseMove: this._onMouseMove.bind(this)
			}, this);
		}
	},

	// convert screen coordinate {x, y} to tile coordinate {row, col}
	s2t: function(x, y) {
		if (y == undefined) {
			y = x.y;
			x = x.x;
		}

		/*	@begin - temp	*/
		var bgTileWidth = this.background.width / 20;
		var bgTileHeight = this.background.height / 20;
		var tileDx = x / bgTileWidth;
		var tileDy = y / bgTileHeight;
		var col = Math.round(9 + tileDx);
		var row = Constants.BoardSize.ROW - 1 - Math.round(9 + tileDy);
		/*	@end 	*/
		Utils.assert(col >= 0 && col < this.board.numCols, "[BoardNode.s2t]: Invalid x value");
		Utils.assert(row >= 0 && row < this.board.numRows, "[BoardNode.s2t]: Invalid y value");

		return {
			row: row,
			col: col
		};
	},

	// convert tile coordinate {row, col} to screen coordinate {x, y}
	t2s: function(row, col) {
		if (col == undefined) {
			col = row.col;
			row = row.row;
		}
		Utils.assert(row >= 0 && row <= this.board.numRows, "[BoardNode.t2s]: Invalid row value");
		Utils.assert(col >= 0 && col <= this.board.numCols, "[BoardNode.t2s]: Invalid col value");


		/*	@begin - temp	*/
		var bgTileWidth = this.background.width / 20;
		var bgTileHeight = this.background.height / 20;
		var scrCoordinateDeltaX = col * bgTileWidth;
		var scrCoordinateDeltaY = (Constants.BoardSize.ROW - 1 - row) * bgTileHeight;
		var x = scrCoordinateDeltaX - 360;
		var y = scrCoordinateDeltaY - 360;
		/*	@end 	*/
		return cc.p(x, y);
	},

	addStone: function(tileCoordinate, index) {
		var newStone = new Stone(index);
		newStone.setPosition(this.t2s(tileCoordinate));
		newStone.setName(tileCoordinate.row + ";" + tileCoordinate.col);
		this.addChild(newStone);
		this.stones.push(newStone);
		this.newMarker.x = newStone.x + newStone.width / 5;
		this.newMarker.y = newStone.y + newStone.height / 5;
		this.newMarker.setVisible(true);
	},

	restartGame: function() {
		this.runAction(
			cc.sequence(
				cc.delayTime(1.0),
				cc.callFunc(function() {
					cc.log("restart...");
					this.board.reset();
					this.setOpacity(255);
					this.gameEnded = false;
					this.gameCount++;
					this.stones = [];
					this.removeAllChildren();
					socketIOClient.emit('ready');
					this.addBackground();
					this.addRoomIdLabel();
					this.addCursor();
					this.goFirst = (this.gameCount % 2 == 1) ^ (this.myColor == 1);
					this.isMyTurn = this.goFirst;

					this.label = new StatusLabel("Waiting for the other to be ready", "Arial", 36);
					this.label.setAnchorPoint(0, 0.5);
					this.label.x -= this.label.width / 2;
					this.label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
					this.label.enableTextAnim(1, true, null,
											"Waiting for the other to be ready.", 
											"Waiting for the other to be ready..",
											"Waiting for the other to be ready...",
											"Waiting for the other to be ready....");
					this.addChild(this.label, 2);					
				}.bind(this))
			)
		);
	},

	/*	pragma - mouse callback	*/

	_onMouseDown: function(event) {
		if (this.gameEnded || !this.isMyTurn || !this.gameDidStart) return;
		var touchedPos = this.convertToNodeSpace(event.getLocation());
		var touchedTile = this.s2t(touchedPos);
		this.mouseDownTile = touchedTile;
	},

	_onMouseMove: function(event) {
		if (this.gameEnded || !this.gameDidStart) return;
		var touchedPos = this.convertToNodeSpace(event.getLocation());
		var touchedTile = this.s2t(touchedPos);
		if (this.board.checkInside(touchedTile)) {
			if (this.board.isEmptyTile(touchedTile.row, touchedTile.col)) {
				this.cursor.setType(this.myColor);
				var sc = this.t2s(touchedTile);
				this.cursor.setPosition(sc);
			} else {
				this.cursor.setType(Constants.CursorType.NULL);
			}
		} else {
			this.cursor.setPosition(touchedPos);
		}	
	},

	_onMouseUp: function(event) {
		if (this.gameEnded || !this.isMyTurn || !this.gameDidStart) return;
		var touchedPos = this.convertToNodeSpace(event.getLocation());
		var touchedTile = this.s2t(touchedPos);

		if (this.mouseDownTile.row == touchedTile.row && this.mouseDownTile.col == touchedTile.col) {
			if (this.board.checkInside(touchedTile)) {
				if (this.board.isEmptyTile(touchedTile.row, touchedTile.col)) {
					socketIOClient.emit('setTileIndex', {
						row: touchedTile.row,
						col: touchedTile.col
					});
				}
			}
		}
	},

	/*	pragma - board node callback	*/
	onGameEnded: function(winSequence, win) {
		this.gameEnded = true;
		var winSeq = winSequence;
		for (var i = 0; i < this.stones.length; i++) {
			this.stones[i].setOpacity(64);
		}
		for (var i = 0; i < winSeq.length; i++) {
			cc.log(winSeq[i].row + "; " + winSeq[i].col);
			var stone = this.getChildByName(winSeq[i].row + ";" + winSeq[i].col);
			stone.setOpacity(255);
		}

		var str = win ? "YOU WIN" : "YOU LOSE";

		this.label.removeFromParent();
		this.label = new cc.LabelTTF(str, "Arial", 60);
		this.label.setFontFillColor(cc.color.WHITE);
		this.label.enableStroke(cc.color.BLACK, 2);
		this.addChild(this.label, 2);
		this.label.runAction(
			cc.sequence(
				cc.fadeTo(2.5, 0),
				cc.callFunc(function() {
					this.restartGame();
				}, this)
			)
		)
	},

	/*	pragma - socket callback	*/
	onGameStarted: function(data) {
		cc.log('onGameStarted');
		cc.log(data);

		// this.label.removeFromParent();
		// this.label = new cc.LabelTTF("READY", "Arial", 40);
		// this.label.setFontFillColor(cc.color.WHITE);
		// this.label.enableStroke(cc.color.BLACK, 2);
		// this.label.runAction(cc.fadeTo(1.0, 0));
		// this.addChild(this.label, 2);

		this.myColor = (data.color == 'WHITE' ? 1 : 2);
		if (data.goFirst) {
			this.isMyTurn = true;
			this.cursor.setType(this.myColor);

			this.label.removeFromParent();
			this.label = new cc.LabelTTF("READY", "Arial", 60);
			this.label.setFontFillColor(cc.color.WHITE);
			this.label.enableStroke(cc.color.BLACK, 2);
			this.addChild(this.label, 2);
			this.label.runAction(
				cc.sequence(
					cc.fadeTo(1.0, 0),
					cc.callFunc(function() {
						this.label.setString("YOU GO FIRST");
						this.label.setOpacity(255);
						this.label.stopAllActions();
						this.label.runAction(cc.fadeTo(2.0, 0));
					}, this)
				)
			)
		} else {
			this.isMyTurn = false;
			this.cursor.setType(Constants.CursorType.NULL);

			this.label.removeFromParent();
			this.label = new cc.LabelTTF("READY", "Arial", 60);
			this.label.setFontFillColor(cc.color.WHITE);
			this.label.enableStroke(cc.color.BLACK, 2);
			this.label.runAction(cc.fadeTo(1.0, 0));
			this.addChild(this.label, 2);	
		}

		this.addBoardModel();

		this.gameDidStart = true;
		this.gameEnded = false;

		this.stones = [];
	},

	onNextGameStarted: function() {
		cc.log('onNextGameStarted');

		if (this.goFirst) {
			this.label.removeFromParent();
			this.label = new cc.LabelTTF("READY", "Arial", 40);
			this.label.setFontFillColor(cc.color.WHITE);
			this.label.enableStroke(cc.color.BLACK, 2);
			this.addChild(this.label, 2);
			this.label.runAction(
				cc.sequence(
					cc.fadeTo(1.0, 0),
					cc.callFunc(function() {
						this.label.setString("YOU GO FIRST");
						this.label.setOpacity(255);
						this.label.stopAllActions();
						this.label.runAction(cc.fadeTo(2.0, 0));
					}, this)
				)
			)
		} else {
			this.label.removeFromParent();
			this.label = new cc.LabelTTF("READY", "Arial", 40);
			this.label.setFontFillColor(cc.color.WHITE);
			this.label.enableStroke(cc.color.BLACK, 2);
			this.label.runAction(cc.fadeTo(1.0, 0));
			this.addChild(this.label, 2);			
		}

		this.gameEnded = false;	
	},

	onTurnBegan: function(data) {
		cc.log("onTurnBegan");
		cc.log(data);
		this.isMyTurn = true;
		var opponentColor = (this.myColor == 1 ? 2 : 1);
		this.addStone({row: data.row, col: data.col}, opponentColor);
		this.board.setTileIndex(data.row, data.col, opponentColor);

		if (data.sequence) {
			console.log('You lose!!');
			this.onGameEnded(data.sequence, false);
		}
	},

	onTurnEnded: function(data) {
		cc.log("onTurnEnded");
		cc.log(data);
		this.isMyTurn = false;
		this.addStone({row: data.row, col: data.col}, this.myColor);
		this.board.setTileIndex(data.row, data.col, this.myColor);

		if (data.sequence) {
			console.log('You win!!');
			this.onGameEnded(data.sequence, true);
		}
	},

	onSetTileIndexFailed: function(data) {
		console.log('Server: ' + data.message);
	},

	onOpponentDisconnected: function(data) {
        cc.log('Your opponent disconnected.');
        cc.log(data);
		
		this.label.removeFromParent();
		this.label = new StatusLabel("Opponent disconnected. Game end in: 3", "Arial", 36);
		this.label.setFontFillColor(cc.color.WHITE);
		this.label.enableStroke(cc.color.BLACK, 2);
		this.label.enableTextAnim(1, false, function() {
										window.location.href = '/index.html';;
									}.bind(this),
									"Opponent disconnected. Game end in: 2", 
									"Opponent disconnected. Game end in: 1")
		this.addChild(this.label, 2);
	},

    onJoinGameFailed: function(data) {
    	var str;
    	cc.log(data);
    	if (data.message == "The game is already started") {
    		str = "This room is full.\nCreate new or join another room to play.";
    	} else if (data.message == "No game with such id") {
			str = "No room with such id.\nCreate new or join another room to play.";
    	} else {
    		str = "Unknown error. Please try again later.";
    	}
 		this.label.removeFromParent();
		this.label = new StatusLabel(str, "Arial", 40);
		this.label.setFontFillColor(cc.color.WHITE);
		this.label.enableStroke(cc.color.BLACK, 2);
		this.addChild(this.label, 2);
    }
})