var Board = cc.Class.extend({
	tiles: null,

	numRows: 0,
	numCols: 0,

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

	setTileIndex: function(row, col, index) {
		Utils.assert(row >= 0 && row < this.numRows, "[Board.setTileIndex]: Invalid row index");
		Utils.assert(col >= 0 && row < this.numCols, "[Board.setTileIndex]: Invalid col index");
		Utils.assert(index == Constants.TileType.WHITE || index == Constants.TileType.BLACK, 
			"[Board.setTileIndex]: Invalid tile index");

		this.tiles[row][col] = index;
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