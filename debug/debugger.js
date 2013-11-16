define(['Math2d'], function(Math2d) {
	var Debugger = function (scene) {
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

	Debugger.prototype.drawAABB = function (aabb, c) {
		var w = new Math2d.Vector(aabb.width, 0);
		var l = new Math2d.Vector(0, aabb.length);

		this.renderer.reset();
		this.renderer.updatePallet({ stroke: c, fill: 'none' });
		this.renderer.context.globalAlpha = 1;

		this.renderer.moveTo(aabb.position.subtract(w).subtract(l));
		this.renderer.lineTo(aabb.position.add(w).subtract(l));
		this.renderer.lineTo(aabb.position.add(w).add(l));
		this.renderer.lineTo(aabb.position.subtract(w).add(l));
		this.renderer.lineTo(aabb.position.subtract(w).subtract(l));

		this.renderer.draw();
	};
});