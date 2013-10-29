Phys = window.Phys || { };

if(!Math2d) throw new error('Need me some Math2d');

Phys.Particle = function (m, x) {
	this.mass = m;
	this.position = x;
	
	this.newPosition = new Math2d.Vector(x.x, x.y);
	this.initialPosition = new Math2d.Vector(x.x, x.y);
	
	this.velocity = new Math2d.Vector(0, 0);
	
	this.fixed = false;
};

Phys.Particle.RESTITUTION = 0.3;

Phys.Particle.prototype.externalForces = function() {
	if(this.fixed) {
		this.newPosition = new Math2d.Vector(this.position.x, this.position.y);
		return;
	}
	
	this.velocity.add_(World.Scene.GRAVITY.scale(World.Scene.TIMESTEP));
	this.newPosition = this.position.add(this.velocity);
	
	this.applyBounds();
};

Phys.Particle.prototype.applyBounds = function() {
	if(this.newPosition.x < World.Scene.BOUND_MIN.x || this.newPosition.x > World.Scene.BOUND_MAX.x) {
		this.newPosition.x = this.position.x - this.velocity.x * World.Scene.TIMESTEP * Phys.Particle.RESTITUTION;
		this.newPosition.y = this.position.y;
	}

	if(this.newPosition.y < World.Scene.BOUND_MIN.y || this.newPosition.y > World.Scene.BOUND_MAX.y) {
		this.newPosition.y = this.position.y - this.velocity.y * World.Scene.TIMESTEP * Phys.Particle.RESTITUTION;
		this.newPosition.x = this.position.x;
	}

	this.newPosition.x = Math.min(Math.max(World.Scene.BOUND_MIN.x, this.newPosition.x), World.Scene.BOUND_MAX.x);
	this.newPosition.y = Math.min(Math.max(World.Scene.BOUND_MIN.y, this.newPosition.y), World.Scene.BOUND_MAX.y);
};

Phys.Particle.prototype.integrate = function() {
	this.velocity = this.newPosition.subtract(this.position);
	this.position = new Math2d.Vector(this.newPosition.x, this.newPosition.y);
};

Phys.Particle.prototype.applyForce = function (f) {
	this.forces.add_(f);
};