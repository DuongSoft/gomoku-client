var Cursor = cc.Node.extend({
	whiteRenderer: null,
	blackRenderer: null,

	ctor: function(cursorType) {
		this._super();

		var whiteRenderer = new cc.Sprite(res.WhiteHover_png);
		this.addChild(whiteRenderer);
		this.whiteRenderer = whiteRenderer;

		var blackRenderer = new cc.Sprite(res.BlackHover_png);
		this.addChild(blackRenderer);
		this.blackRenderer = blackRenderer;

		if (!cursorType) {
			cursorType = Constants.CursorType.NULL;
		}

		this.setType(cursorType);
	},

	setType: function(cursorType) {
		switch (cursorType) {
			case Constants.CursorType.WHITE:
				this.whiteRenderer.setVisible(true);
				this.blackRenderer.setVisible(false);
				return;
			case Constants.CursorType.BLACK:
				this.whiteRenderer.setVisible(false);
				this.blackRenderer.setVisible(true);
				return;
			case Constants.CursorType.NULL:
				this.whiteRenderer.setVisible(false);
				this.blackRenderer.setVisible(false);
				return;
		}

		Utils.assert(false, "[Cursor.setType]: invalid cursorType");
	},

	getType: function() {
		if (this.whiteRenderer.isVisible() && this.blackRenderer.isVisible()) {
			Utils.assert(false, "[Cursor.getType]: cursorType is both WHITE and BLACK");
		}
		if (this.whiteRenderer.isVisible()) {
			return Constants.CursorType.WHITE;
		} else if (this.blackRenderer.isVisible()) {
			return Constants.CursorType.BLACK;
		} else {
			return Constants.CursorType.NULL;
		}
	},

	switchType: function() {
		var cursorType = this.getType();
		Utils.assert(cursorType != Constants.CursorType.NULL, 
					"[Cursor.switchType]: current cursorType is NULL");
		if (cursorType == Constants.CursorType.WHITE) {
			this.setType(Constants.CursorType.BLACK);
		} else {
			this.setType(Constants.CursorType.WHITE);
		}
	}
});