var res = {
	Grid_png: "grid.png",
	White_png: "white.png",
	WhiteHover_png: "white_hover.png",
	Black_png: "black.png",
	BlackHover_png: "black_hover.png",
	New_png: "new.png"
};

var g_resources = [];
for (var i in res) {
	if (res[i].type == null && res[i].lastIndexOf("res/", 0) == -1)
        res[i] = "res/" + res[i];
    g_resources.push(res[i]);
}
