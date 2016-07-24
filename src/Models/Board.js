var NUMBER_TO_WIN = 5;

var BoardConstants = {
	kNull: 0,
	kWhite: 1,
	kBlack: 2
}

var Board = cc.Class.extends({
	tiles: null,
	numRows: 0,
	numCols: 0,

	ctor: function(numRows, numCols) {
		this.numRows = numRows;
		this.numCols = numCols;
		this.reset();
	},

	reset: function() {
		this.tiles = [];
		for (var i = 0; i < this.numRows; i++) {
			this.tiles[i] = [];
			for (var j = 0; j < this.numCols; i++) {
				this.tiles[i][j] = BoardConstants.kNull;
			}
		}
	},

	checkWin: function(row, column) {
		// No winner if tile is 0
		var currentTile = this.tiles[row][column] 
		if (this.tiles[row][column] == BoardConstants.kNull) {
			return BoardConstants.kNull;
		}

		var maxOffset = NUMBER_TO_WIN - 1;
		var count, iMin, iMax, jMin, jMax;

		// Check horizontal sequence
		count = 0;
		iMin = column - maxOffset;
		iMin = iMin > -1 ? iMin : 0;
		iMax = column + maxOffset;
		iMax = iMax < this.numCols ? iMax : this.numCols - 1;

		for (var i = iMin; i <= iMax; i++) {
			if (this.tiles[row][i] == currentTile) {
				count++;
				if (count == NUMBER_TO_WIN) {
					return currentTile;
				}
			} else {
				break;
			}
		}

		// Check vertical sequence
		count = 0;
		jMin = row - maxOffset;
		jMin = jMin > -1 ? jMin : 0;
		jMax = row + maxOffset;
		jMax = jMax < this.numRows ? jMax : this.numRows - 1;

		for (var j = jMin; j <= jMax; j++) {
			if (this.tiles[j][column] == currentTile) {
				count++;
				if (count == NUMBER_TO_WIN) {
					return currentTile;
				}
			} else {
				break;
			}
		}

		// Check diagonal sequence (/)
		count = 0;
		iMin = column - maxOffset;
		iMin = iMin > -1 ? iMin : 0;
		iMax = column + maxOffset;
		iMax = iMax < this.numCols ? iMax : this.numCols - 1;		
		jMin = row - maxOffset;
		jMin = jMin > -1 ? jMin : 0;
		jMax = row + maxOffset;
		jMax = jMax < this.numRows ? jMax : this.numRows - 1;
		
		for (var i = iMin, j = jMax; i <= iMax; i++, j--) {
			if (this.tiles[i][j] == currentTile) {
				count++;
				if (count == NUMBER_TO_WIN) {
					return currentTile;
				}
			} else {
				break;
			}
		}

		// Check back diagonal sequence (\)
		count = 0;
		iMin = column - maxOffset;
		iMin = iMin > -1 ? iMin : 0;
		iMax = column + maxOffset;
		iMax = iMax < this.numCols ? iMax : this.numCols - 1;		
		jMin = row - maxOffset;
		jMin = jMin > -1 ? jMin : 0;
		jMax = row + maxOffset;
		jMax = jMax < this.numRows ? jMax : this.numRows - 1;
		
		for (var i = iMin, j = jMin; i <= iMax; i++, j++) {
			if (this.tiles[i][j] == currentTile) {
				count++;
				if (count == NUMBER_TO_WIN) {
					return currentTile;
				}
			} else {
				break;
			}
		}

		return BoardConstants.kNull;
	},

	setTileIndex: function(row, col, index) {
		cc.assert(row >= 0 && row < this.numRows, "Invalid row index");
		cc.assert(col >= 0 && row < this.numCols, "Invalid col index");
		cc.assert(index == BoardConstants.kBlack || index == BoardConstants.kWhite, "Invalid tile index");

		this.tiles[row][col] = index;
	},

	isEmptyTile: function(row, col) {
		cc.assert(row >= 0 && row < this.numRows, "Invalid row index");
		cc.assert(col >= 0 && row < this.numCols, "Invalid col index");

		return this.tiles[row][col] == BoardConstants.kNull;
	}
});