var Board = cc.Class.extend({
	tiles: null,

	numRows: 0,
	numCols: 0,

	lastRowIdx: 0,
	lastColIdx: 0,

	winSequence: null,

	ctor: function(numRows, numCols) {
		this.numRows = numRows;
		this.numCols = numCols;
		this.reset();
	},

	reset: function() {
		this.tiles = [];
		for (var i = 0; i < this.numRows; i++) {
			this.tiles[i] = [];
			for (var j = 0; j < this.numCols; j++) {
				this.tiles[i][j] = Constants.TileType.NULL;
			}
		}
	},

	checkWin: function() {
		var currentTile = this.tiles[this.lastRowIdx][this.lastColIdx] 

		return (this.checkHorizontal(currentTile) || this.checkVertical(currentTile) || 
				this.checkForwardDiagonal(currentTile) || this.checkForwardDiagonal(currentTile) || Constants.TileType.NULL);
	},

	checkHorizontal: function(currentTile) {
		var row = this.lastRowIdx;
		var column = this.lastColIdx;
		var maxOffset = Constants.NUMBER_TO_WIN - 1;
		var count = 0;

		var jMin = column - maxOffset;
		var jMin = jMin > -1 ? jMin : 0;
		var jMax = column + maxOffset;
		var jMax = jMax < this.numCols ? jMax : this.numCols - 1;

		this.winSequence = [];
	
		for (var j = jMin; j <= jMax; j++) {
			if (this.tiles[row][j] == currentTile) {
				this.winSequence.push({row: row, col: j});
				count++;
			} else if (count >= Constants.NUMBER_TO_WIN) {
				break;
			} else {
				count = 0;
				this.winSequence = [];
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}
		return Constants.TileType.NULL;
	},

	checkVertical: function(currentTile) {
		var row = this.lastRowIdx;
		var column = this.lastColIdx;
		var maxOffset = Constants.NUMBER_TO_WIN - 1;
		var count = 0;

		var iMin = row - maxOffset;
		var iMin = iMin > -1 ? iMin : 0;
		var iMax = row + maxOffset;
		var iMax = iMax < this.numRows ? iMax : this.numRows - 1;

		this.winSequence = [];

		for (var i = iMin; i <= iMax; i++) {
			if (this.tiles[i][column] == currentTile) {
				this.winSequence.push({row: i, col: column});
				count++;
			} else if (count >= Constants.NUMBER_TO_WIN) {
				break;
			} else {
				count = 0;
				this.winSequence = [];
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}
		return Constants.TileType.NULL;
	},

	checkBackDiagonal: function(currentTile) {
		var row = this.lastRowIdx;
		var column = this.lastColIdx;
		var maxOffset = Constants.NUMBER_TO_WIN - 1;
		var count = 0;
		
		var jMin = column - maxOffset;
		var jMin = jMin > -1 ? jMin : 0;
		var jMax = column + maxOffset;
		var jMax = jMax < this.numCols ? jMax : this.numCols - 1;		
		var iMin = row - maxOffset;
		var iMin = iMin > -1 ? iMin : 0;
		var iMax = row + maxOffset;
		var iMax = iMax < this.numRows ? iMax : this.numRows - 1;

		this.winSequence = [];
		
		for (var i = iMin, j = jMin; i <= iMax; i++, j++) {
			if (this.tiles[i][j] == currentTile) {
				this.winSequence.push({row: i, col: j});
				count++;
			} else if (count >= Constants.NUMBER_TO_WIN) {
				break;
			}  else {
				count = 0;
				this.winSequence = [];
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}
		return Constants.TileType.NULL;
	},

	checkForwardDiagonal: function(currentTile) {
		var row = this.lastRowIdx;
		var column = this.lastColIdx;
		var maxOffset = Constants.NUMBER_TO_WIN - 1;
		var count = 0;

		var count = 0;
		var jMin = column - maxOffset;
		var jMin = jMin > -1 ? jMin : 0;
		var jMax = column + maxOffset;
		var jMax = jMax < this.numCols ? jMax : this.numCols - 1;		
		var iMin = row - maxOffset;
		var iMin = iMin > -1 ? iMin : 0;
		var iMax = row + maxOffset;
		var iMax = iMax < this.numRows ? iMax : this.numRows - 1;
		
		this.winSequence = [];

		for (var i = iMin, j = jMax; i <= iMax; i++, j--) {
			if (this.tiles[i][j] == currentTile) {
				this.winSequence.push({row: i, col: j});
				count++;
			} else if (count >= Constants.NUMBER_TO_WIN) {
				break;
			} else {
				count = 0;
				this.winSequence = [];
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}
		return Constants.TileType.NULL;
	},

	setTileIndex: function(row, col, index) {
		Utils.assert(row >= 0 && row < this.numRows, "[Board.setTileIndex]: Invalid row index");
		Utils.assert(col >= 0 && row < this.numCols, "[Board.setTileIndex]: Invalid col index");
		Utils.assert(index == Constants.TileType.WHITE || index == Constants.TileType.BLACK, 
			"[Board.setTileIndex]: Invalid tile index");

		this.tiles[row][col] = index;

		this.lastRowIdx = row;
		this.lastColIdx = col;
	},

	isEmptyTile: function(row, col) {
		Utils.assert(row >= 0 && row < this.numRows, "[Board.isEmptyTile]: Invalid row index");
		Utils.assert(col >= 0 && row < this.numCols, "[Board.isEmptyTile]: Invalid col index");

		return this.tiles[row][col] == Constants.TileType.NULL;
	}, 

	checkInside: function(row, col) {
		if (col == undefined) {
			col = row.col;
			row = row.row;
		}
		return -1 < row && row < this.numRows && -1 < col && col < this.numCols;
	},

	getWinSequence: function() {
		return this.winSequence;
	},

	toString: function() {
		var str = "";
		for (var i = 0; i < this.tiles.length; i++) {
			for (var j = 0; j < this.tiles[i].length; j++) {
				str += this.tiles[i][j] + " ";
			}
			str += "\n";
		}
		cc.log(str);
	}
});