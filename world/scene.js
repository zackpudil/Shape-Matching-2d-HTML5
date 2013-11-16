define(['Collision', 'Math2d', 'world/renderer', 'world/bounds'], function(Collision, Math2d, Renderer, Bounds) {

	/*------------------------------------------
	The current scene.  contains all the actors, and handles the update process.
	------------------------------------------*/
	var Scene = function (canvas, width, height) {
		this.actors = [];
		this.renderer = new Renderer(canvas.getContext('2d'));
		this.bounds = new Bounds(0, 0, width, height);
		this.detector = new Collision.Detector();
	};

	Scene.TIMESTEP = 1/60;
	Scene.GRAVITY = new Math2d.Vector(0, 8);

	Scene.prototype.checkBounds = function () {
		var self = this;
		
		this.actors.each(function(a) { 		
			var boundOffenders = a.body.particles.where(function(p) { return self.bounds.check(p.newPosition); });
			boundOffenders.each(function(p) { 
				p.updatePositionDueToBounds(self.bounds.getPassiveCoord(p.newPosition));
				self.bounds.clamp(p.newPosition);
			});
		});
	};

	Scene.prototype.checkCollisions = function () {
		var self = this;
		if(this.actors.length <= 1)
			return;

		var collidingGroups = this.detector.broadPhaseDetection(this.actors.select(function(a) { return a.body; }));
		collidingGroups.each(function(cg) {
			cg.permutate(function(a, b) { self.detector.narrowPhaseDetection(a, b); });
		});
	};

	Scene.prototype.updatePositions = function () {
		this.actors.each(function(a) { a.act(); });
	};

	Scene.prototype.renderScene = function () {
		var self = this;
		this.renderer.clear();
		this.actors.each(function (a) { a.render(self.renderer); });
	};

	Scene.prototype.getParticlesInRange = function(v, r) {
		//a quick and dirty way of finding the particles within a certain radius at a certain position.
		var particles = this.actors.selectMany(function(a) { return a.body.particles; });
		return particles.where(function(p) {
			return p.position.subtract(v).magnitude() <= r;
		});
	};

	Scene.prototype.tick = function () {
		this.actors.each(function(a) { a.prepare(); });
		this.checkBounds();
		this.checkCollisions();
		this.updatePositions();
		this.renderScene();
	};

return Scene;
});