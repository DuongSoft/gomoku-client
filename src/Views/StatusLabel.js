var StatusLabel = cc.LabelTTF.extend({
	animationDistance: 0,

	ctor: function(text, fontName, fontSize) {
		this._super(text, fontName, fontSize);
		this.setFontFillColor(cc.color.WHITE);
		this.enableStroke(cc.color.BLACK, 2);
		this.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
	},

	enableTextAnim: function(distance, repeat, endCallback) {
		var sequence = [];
		// sequence.push(
		// 	cc.callFunc(function(){
		// 		this.setString(this.getString());
		// 	}.bind(this))
		// );
		for (var i = 3; i < arguments.length; i++) {
			sequence.push(cc.delayTime(distance));
			sequence.push(
				cc.callFunc(
					function(sender, str) {
						this.setString(str);
					}, 
					this, 
					arguments[i]
				)				
			);
		}

		if (repeat) {
			this.runAction(cc.repeatForever(cc.sequence(sequence)));
		} else {
			sequence.push(cc.delayTime(distance));
			sequence.push(cc.callFunc(endCallback));
			this.runAction(cc.sequence(sequence));
		}
	}
});