export default class Actor {
	constructor(b, bc, pc) {
		this.body = b;
		this.bodyPallet = bc;
		this.particlePallet = pc;
	}

	render(renderer) {
		renderer.updatePallet(this.bodyPallet);
		renderer.moveTo(this.body.particles[0].position);

		this.body.particles.slice(1).each(p => renderer.lineTo(p.position));

		renderer.lineTo(this.body.particles[0].position);
		renderer.draw();

		renderer.updatePallet(this.particlePallet);

		this.body.particles.each(p => {
			renderer.reset();
			renderer.circle(p.position, 5);
			renderer.draw();
		});

		renderer.reset();
	}

	prepare() {
		this.body.externalForces();
	}

	act() {
		this.body.projectPositions();
		this.body.integrate();
	}
}