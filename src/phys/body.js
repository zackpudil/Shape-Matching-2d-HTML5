import Matrix from '../math2d/matrix';

export default class Body {
	constructor(p, s) {
		this.stiffness = s;
		this.particles = p;
	}

	externalForces() {
		this.particles.each(p => p.externalForces());
	}

	integrate() {
		this.particles.each(p => p.integrate());
	}

	projectPositions() {
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
		let totalMass = this.particles.sum(p => p.fixed ? p.mass : p.mass);

		let centerOfMass = this.centerOfMass(totalMass, 'newPosition');
		let initialCenterOfMass = this.centerOfMass(totalMass, 'initialPosition');

		let relativeCoords = this.relativeCoords(centerOfMass, 'newPosition');
		let initialRelativeCoords = this.relativeCoords(centerOfMass, 'initialPosition');

		let rotation = this.rotation(relativeCoords, initialRelativeCoords);

		this.particles.each(p => {
			if(p.fixed) return;

			let goal = rotation.multiplyVector(p.initialPosition.subtract(initialCenterOfMass)).add(centerOfMass);
			p.newPosition.update(p.newPosition.add(goal.subtract(p.newPosition).scale(this.stiffness)));
		});
	}

	centerOfMass(tm, pos) {
		//gets the center of mass, for either inital, projected, or current position.
		return this.particles
			.sumV(p => p[pos].scale(p.fixed ? p.mass : p.mass))
			.scale(1/tm);
	}

	center(pos) {
		//get the centroid of the pologon that is not based on the mass of the individual particles.
		return this.particles
			.sumV(p => p[pos])
			.scale(1/this.particles.length);
	}

	relativeCoords(com, pos) {
		return this.particles.select(p => p[pos].subtract(com));
	}

	rotation(c, ic) {
		//retrives the rotation from the c: [current relative coords], and ic: [initial relative coords]
		return Array.enumerate(c.length)
			.select(i => Matrix.cartesianProduct(c[i], ic[i]).scale(this.particles[i].mass))
			.sumM(m => m)
			.polarDecomposition()
			.rotation;
	}
}