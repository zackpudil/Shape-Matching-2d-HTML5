define(['Math2d'], function(Math2d) {

	// A body house a group of particles that move in semi-unison.
	// 	 p - an array of Particls.
	//   s - a scale factor for shape matching.
	//			Between 0.1 - 1, with 1 being the stiffest and 0.1 being the most jello like.
	var Body = function (p, s) {
		var self = this;
		
		this.stiffness = s;
		this.particles = p;
	};

	Body.prototype.externalForces = function() {
		this.particles.each(function(p) { p.externalForces(); });
	};

	Body.prototype.integrate = function () {
		this.particles.each(function(p) { p.integrate(); });
	};

	Body.prototype.projectPositions = function () {
		//this method is the meat of the shape matching algoritm, which can be expressed as an equation:
		//	g = R(i - icm) + xcm
		//		g: goal position based on the shape.
		//		R = A / sqrt(A_transpose*A), R and A are 2x2 matrixes where:
		//			A = Sum of m * (p outer product q) where:
		//				p: x - xcm, relative coordinates of current position.
		//				q: i - icm, relative coordinates of initial position.
		//
		//		i: initial position.
		//		icm: initial center of mass, (Sum of m * i)/(Sum of m)
		//		xcm: current center of mass, (Sum of m * x)/(Sum of m)
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

	Body.prototype.centerOfMass = function (tm, pos) {
		//gets the center of mass, for either inital, projected, or current position.
		return this.particles
			.sumV(function(p) { return p[pos].scale(p.fixed ? p.mass*100 : p.mass)})
			.scale(1/tm);
	};

	Body.prototype.center = function (pos) {
		//get the centroid of the pologon that is not based on the mass of the individual particles.
		return this.particles
			.sumV(function(p) { return p[pos]; })
			.scale(1/this.particles.length);
	}

	Body.prototype.relativeCoords = function (com, pos) {
		return this.particles.select(function(p) { return p[pos].subtract(com); });
	};

	Body.prototype.rotation = function (c, ic) {
		//retrives the rotation from the c: [current relative coords], and ic: [initial relative coords]
		var self = this;
		return Array.enumerate(c.length)
			.select(function(i) { return Math2d.Matrix.cartesianProduct(c[i], ic[i]).scale(self.particles[i].mass) })
			.sumM(function(m) { return m; })
			.polarDecomposition()
			.rotation;
	};

	return Body;
});