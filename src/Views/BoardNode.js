var BoardNode = cc.Node.extend({
	board: null,
	background: null,
	cursor: null,
	
	player: null,

	mouseDownTile: null,

	gameEnded: false,

	stones: null,

	ctor: function() {
		this._super();

		this.initNewGame();

		this.addBoardModel();
		this.addBackground();
		this.addCursor();
		this.addMouseEventHandler();
	},

	addBoardModel: function() {
		this.board = new Board(Constants.BoardSize.ROW, Constants.BoardSize.COL);
	},

	addBackground: function() {
		var background = new cc.Sprite(res.Grid_png);
		this.addChild(background, -1);
		this.background = background;
	},

	addCursor: function() {
		var cursor = new Cursor(Constants.CursorType.WHITE);
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

	initNewGame: function() {
		this.player = Constants.Player.WHITE;
		this.gameEnded = false;
		this.stones = [];
	},

	switchPlayer: function() {
		if (this.player == Constants.Player.WHITE) {
			this.player = Constants.Player.BLACK;
		} else {
			this.player = Constants.Player.WHITE;
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

	/*	pragma - callback	*/

	_onMouseDown: function(event) {
		if (this.gameEnded) return;
		var touchedPos = this.convertToNodeSpace(event.getLocation());
		var touchedTile = this.s2t(touchedPos);
		this.mouseDownTile = touchedTile;
	},

	_onMouseMove: function(event) {
		if (this.gameEnded) return;
		var touchedPos = this.convertToNodeSpace(event.getLocation());
		var touchedTile = this.s2t(touchedPos);
		if (this.board.checkInside(touchedTile)) {
			if (this.board.isEmptyTile(touchedTile.row, touchedTile.col)) {
				this.cursor.setType(this.player);
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
		if (this.gameEnded) return;
		var touchedPos = this.convertToNodeSpace(event.getLocation());
		var touchedTile = this.s2t(touchedPos);

		if (this.mouseDownTile.row == touchedTile.row && this.mouseDownTile.col == touchedTile.col) {
			if (this.board.checkInside(touchedTile)) {
				if (this.board.isEmptyTile(touchedTile.row, touchedTile.col)) {
					this.board.setTileIndex(touchedTile.row, touchedTile.col, 
											this.player);
					var sc = this.t2s(touchedTile);
					var newStone = new Stone(this.player);
					newStone.setPosition(sc);
					newStone.setName(touchedTile.row + ";" + touchedTile.col);
					this.addChild(newStone);
					this.stones.push(newStone);
					this._onEndTurn();
				}
			}
		}
	},

	_onEndTurn: function() {
		// this.board.toString();
		if (this.board.checkWin()) {
			this._onWinGame();
		} else {
			this.cursor.switchType()
			this.switchPlayer();
		}
	},

	_onWinGame: function() {
		this.gameEnded = true;
		var winSeq = this.board.getWinSequence();
		for (var i = 0; i < this.stones.length; i++) {
			this.stones[i].setOpacity(64);
		}
		for (var i = 0; i < winSeq.length; i++) {
			cc.log(winSeq[i].row + "; " + winSeq[i].col);
			var stone = this.getChildByName(winSeq[i].row + ";" + winSeq[i].col);
			stone.setOpacity(255);
			// stone.runAction(
			// 	cc.sequence(
			// 		cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255), cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255), 
			// 		cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255), cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255), 
			// 		cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255), cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255),
			// 		cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255), cc.fadeTo(0.3, 0), cc.fadeTo(0.3, 255)
			// 	)
			// );
		}

		this.scheduleOnce(function() {
			cc.director.runScene(new cc.TransitionFade(1, new HelloWorldScene()));
		}, 2);
	}
})