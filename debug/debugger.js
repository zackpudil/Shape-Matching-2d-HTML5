Debugger = function (scene) {
	this.renderer = scene.renderer;
};

Debugger.prototype.drawCircle = function (p, c, a) {
	this.renderer.reset();
	this.renderer.updatePallet({ stroke: c, fill: c });
	this.renderer.context.globalAlpha = a || 1;

	this.renderer.circle(p, 10);
	this.renderer.draw();
};

Debugger.prototype.drawVect = function (s, p, c) {
	this.renderer.reset();
	this.renderer.updatePallet({ stroke: c, fill: c });
	this.renderer.context.globalAlpha = 1;

	this.renderer.moveTo(s);
	this.renderer.lineTo(s.add(p));
	this.renderer.draw();
};