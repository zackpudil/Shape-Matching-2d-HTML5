World = window.World || { };

if(typeof(Math2d) == 'undefined') throw new error('need Math2d');

World.Scene = function (canvas) {
	this.actors = [];
	this.renderer = new World.Renderer(canvas.getContext('2d'));
};

World.Scene.TIMESTEP = 1/60;

World.Scene.BOUND_MIN = new Math2d.Vector(10, 10);
World.Scene.BOUND_MAX = new Math2d.Vector(490, 490);

World.Scene.GRAVITY = new Math2d.Vector(0, 8);

World.Scene.prototype.addActor = function(b) {
	this.actors.push(b);
};

World.Scene.prototype.updatePositions = function () {
	this.actors.each(function(a) { a.act(); });
};

World.Scene.prototype.renderScene = function () {
	var self = this;
	this.renderer.clear();
	this.actors.each(function (a) { a.render(self.renderer); });
};

World.Scene.prototype.tick = function () {
	this.updatePositions();
	this.renderScene();
};

