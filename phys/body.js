Phys = window.Phys || { };

Phys.Body = function (p, s) {
	var self = this;
	
	this.stiffness = s;
	this.particles = p;
};

Phys.Body.prototype.externalForces = function() {
	this.particles.each(function(p) { p.externalForces(); });
};

Phys.Body.prototype.integrate = function () {
	this.particles.each(function(p) { p.integrate(); });
};

Phys.Body.prototype.projectPositions = function () {
	var self = this;
	
	var totalMass = this.particles.sum(function(p) { return p.fixed ? p.mass*100 : p.mass });
	
	var centerOfMass = this.centerOfMass(totalMass, 'newPosition');
	var initialCenterOfMass = this.centerOfMass(totalMass, 'initialPosition');
	
	var relativeCoords = this.relativeCoords(centerOfMass, 'newPosition');
	var initialRelativeCoords = this.relativeCoords(initialCenterOfMass, 'initialPosition');
	
	var rotation = this.rotation(relativeCoords, initialRelativeCoords);
	
	this.particles.each(function(p) {
		if(p.fixed) return;
		
		var goal = rotation.multiplyVector(p.initialPosition.subtract(initialCenterOfMass)).add(centerOfMass);
		p.newPosition.add_(goal.subtract(p.newPosition).scale(self.stiffness));
	});
};

Phys.Body.prototype.centerOfMass = function (tm, pos) {
	return this.particles
		.sumV(function(p) { return p[pos].scale(p.fixed ? p.mass*100 : p.mass)})
		.scale(1/tm);
};

Phys.Body.prototype.center = function (pos) {
	return this.particles
		.sumV(function(p) { return p[pos]; })
		.scale(1/this.particles.length);
}

Phys.Body.prototype.relativeCoords = function (com, pos) {
	return this.particles.select(function(p) { return p[pos].subtract(com); });
};

Phys.Body.prototype.rotation = function (c, ic) {
	var self = this;
	return Array.enumerate(c.length)
		.select(function(i) { return c[i].cartesianProduct(ic[i]).scale(self.particles[i].mass) })
		.sumM(function(m) { return m; })
		.polarDecomposition()
		.rotation;
};