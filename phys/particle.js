define(['Math2d', 'World'], function (Math2d, World) {

	/*-------------------------------------------------------
	A point like object that has mass and position.
	-------------------------------------------------------*/
	var Particle = function (m, x) {
		this.mass = m;
		this.position = x;
		
		//'new' position is the result of certain calculations, shape matching, gravity, bounds, collision detection.
		this.newPosition = new Math2d.Vector(x.x, x.y);
		this.initialPosition = new Math2d.Vector(x.x, x.y);
		
		this.velocity = new Math2d.Vector(0, 0);
		
		//fixed means it's mass get's times'd by 100 in the shape-matching algorithm, 
		//	and does not get affected by external forces.
		this.fixed = false;
	};

	Particle.prototype.externalForces = function() {
		if(this.fixed) {
			this.newPosition = new Math2d.Vector(this.position.x, this.position.y);
			return;
		}

		this.velocity.add_(World.Scene.GRAVITY.scale(World.Scene.TIMESTEP));
		this.newPosition = this.position.add(this.velocity);
	};

	Particle.prototype.updatePositionDueToBounds = function (passiveCoord) {
		this.newPosition = this.position.subtract(this.velocity.scale(World.Bounds.RESTITUTION));
		this.newPosition[passiveCoord] = this.position[passiveCoord];
	};

	//this is Verlet intergration.
	Particle.prototype.integrate = function() {
		this.velocity = this.newPosition.subtract(this.position);
		this.position = new Math2d.Vector(this.newPosition.x, this.newPosition.y);
	};

	return Particle;

});