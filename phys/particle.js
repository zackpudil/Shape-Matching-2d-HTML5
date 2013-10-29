Phys = window.Phys || { };

Phys.Particle = function (m, x) {
	this.mass = m;
	this.position = x;
	
	this.newPosition = new Math2d.Vector(x.x, x.y);
	this.initialPosition = new Math2d.Vector(x.x, x.y);
	
	this.velocity = new Math2d.Vector(0, 0);
	
	this.fixed = false;
};

Phys.Particle.prototype.externalForces = function() {
	if(this.fixed) {
		this.newPosition = new Math2d.Vector(this.position.x, this.position.y);
		return;
	}
	
	this.velocity.add_(World.Scene.GRAVITY.scale(World.Scene.TIMESTEP));
	this.newPosition = this.position.add(this.velocity);
};

Phys.Particle.prototype.updatePositionDueToBounds = function (passiveCoord) {
	this.newPosition = this.position.subtract(this.velocity.scale(World.Bounds.RESTITUTION));
	this.newPosition[passiveCoord] = this.position[passiveCoord];
};

Phys.Particle.prototype.integrate = function() {
	this.velocity = this.newPosition.subtract(this.position);
	this.position = new Math2d.Vector(this.newPosition.x, this.newPosition.y);
};