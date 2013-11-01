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
}

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

Phys.Body.prototype.minMaxProjections = function (axis) {
	var sortedByProjects = this.particles.sortBy(function(p) { return p.newPosition.dot(axis); }),
		minPart = sortedByProjects[0];
		maxPart = sortedByProjects[sortedByProjects.length-1];

	return {
		min: { part: minPart, proj: minPart.newPosition.dot(axis) },
		max: { part: maxPart, proj: maxPart.newPosition.dot(axis) },
	};
};

Phys.Body.prototype.collisionAxises = function () {
	var self = this;
	return Array
		.enumerate(this.particles.length)
		.select(function(i) {
			var p1 = self.particles[i].newPosition,
				p2 = self.particles[i + 1 == self.particles.length ? 0 : i + 1].newPosition;
			return p1.subtract(p2).norm().unit();
		});
};