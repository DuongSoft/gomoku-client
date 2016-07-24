var Utils = {};

Utils.assert = function(exp, msg) {
	if (Configs.ASSERT) {
		cc.assert(exp, msg);
	}
}