import Vector from '../math2d/vector';
import Scene from '../world/scene';
import Bounds from '../world/bounds';

export default class Particle {
	constructor(m, x) {
		this.mass = m;
		this.position = x;

		this.newPosition = new Vector(x.x, x.y);
		this.initialPosition = new Vector(x.x, x.y);

		this.velocity = new Vector(0, 0);

		this.fixed = false;
	}

	externalForces() {
		if(this.fixed) {
			this.newPosition = new Vector(this.position.x, this.position.y);
			return;
		}

		this.velocity.update(this.velocity.add(Scene.GRAVITY.scale(Scene.TIMESTEP)));
		this.newPosition = this.position.add(this.velocity);
	}

	updatePositionDueToBounds(passiveCoord) {
		this.newPosition = this.position.subtract(this.velocity.scale(Bounds.RESTITUTION));
		this.newPosition[passiveCoord] = this.position[passiveCoord];
	}

	integrate() {
		this.velocity = this.newPosition.subtract(this.position);
		this.position = new Vector(this.newPosition.x, this.newPosition.y);
	}
}