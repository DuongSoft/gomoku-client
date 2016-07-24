var Stone = cc.Sprite.extend({
	ctor: function(stoneType) {
		var spriteName;
		cc.assert(stoneType == Constants.StoneType.WHITE || Constants.StoneType.BLACK, 
					"[Stone.ctor]: stoneType is not valid");
		if (stoneType == Constants.StoneType.WHITE) {
			spriteName = res.White_png;
		} else {
			spriteName = res.Black_png;
		}
		this._super(spriteName);
	}
});