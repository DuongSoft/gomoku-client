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

	checkWin: function(row, column) {
		if (row == undefined) {
			row = this.lastRowIdx;
			column = this.lastColIdx;
		}

		// No winner if tile is 0
		var currentTile = this.tiles[row][column] 
		if (currentTile == Constants.TileType.NULL) {
			return Constants.TileType.NULL;
		}

		var maxOffset = Constants.NUMBER_TO_WIN - 1;
		var count, iMin, iMax, jMin, jMax;

		// Check horizontal sequence
		this.winSequence = [];
		count = 0;
		jMin = column - maxOffset;
		jMin = jMin > -1 ? jMin : 0;
		jMax = column + maxOffset;
		jMax = jMax < this.numCols ? jMax : this.numCols - 1;
		
		for (var j = jMin; j <= jMax; j++) {
			if (this.tiles[row][j] == currentTile) {
				this.winSequence.push({row: row, col: j});
				count++;
			} else if (count > 0) {
				break;
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}

		// Check vertical sequence
		this.winSequence = [];
		count = 0;
		iMin = row - maxOffset;
		iMin = iMin > -1 ? iMin : 0;
		iMax = row + maxOffset;
		iMax = iMax < this.numRows ? iMax : this.numRows - 1;

		for (var i = iMin; i <= iMax; i++) {
			if (this.tiles[i][column] == currentTile) {
				this.winSequence.push({row: i, col: column});
				count++;
			} else if (count > 0) {
				break;
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}

		// Check diagonal sequence (/)
		this.winSequence = [];
		count = 0;
		jMin = column - maxOffset;
		jMin = jMin > -1 ? jMin : 0;
		jMax = column + maxOffset;
		jMax = jMax < this.numCols ? jMax : this.numCols - 1;		
		iMin = row - maxOffset;
		iMin = iMin > -1 ? iMin : 0;
		iMax = row + maxOffset;
		iMax = iMax < this.numRows ? iMax : this.numRows - 1;
		
		for (var i = iMin, j = jMax; i <= iMax; i++, j--) {
			if (this.tiles[i][j] == currentTile) {
				this.winSequence.push({row: i, col: j});
				count++;
			} else if (count > 0) {
				break;
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}

		// Check diagonal sequence (\)
		this.winSequence = [];
		count = 0;
		jMin = column - maxOffset;
		jMin = jMin > -1 ? jMin : 0;
		jMax = column + maxOffset;
		jMax = jMax < this.numCols ? jMax : this.numCols - 1;		
		iMin = row - maxOffset;
		iMin = iMin > -1 ? iMin : 0;
		iMax = row + maxOffset;
		iMax = iMax < this.numRows ? iMax : this.numRows - 1;
		
		for (var i = iMin, j = jMin; i <= iMax; i++, j++) {
			if (this.tiles[i][j] == currentTile) {
				this.winSequence.push({row: i, col: j});
				count++;
			} else if (count > 0) {
				break;
			}
		}

		if (count >= Constants.NUMBER_TO_WIN) {
			return currentTile;
		}

		this.winSequence = [];
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