import Detector from '../collision/detector';
import Vector from '../math2d/vector';
import Renderer from './renderer';
import Bounds from './bounds';

window.GRAVITY = new Vector(0, 8);

export default class Scene {

	static get TIMESTEP() { return 1/60; }

	static get GRAVITY() { return window.GRAVITY; }
	static set GRAVITY(value) { window.GRAVITY = value; }

	constructor(canvas, width, height) {
		this.actors = [];
		this.renderer = new Renderer(canvas.getContext("2d"));
		this.bounds = new Bounds(0, 0, width, height);
		this.detector = new Detector();
	}

	checkBounds() {
		this.actors.each(a => {
			let boundOffenders = a.body.particles.where(p => this.bounds.check(p.newPosition));
			boundOffenders.each(p => {
				p.updatePositionDueToBounds(this.bounds.getPassiveCoord(p.newPosition));
				this.bounds.clamp(p.newPosition);
			});
		})
	}

	checkCollisions() {
		if(this.actors.length <= 1)
			return;

		let collidingGroups = this.detector.broadPhaseDetection(this.actors.select(a => a.body));
		collidingGroups.each(cg => cg.permutate((a, b) => this.detector.narrowPhaseDetection(a, b)));
	}

	updatePositions() {
		this.actors.each(a => a.act());
	}

	renderScene() {
		this.renderer.clear();
		this.actors.each(a => a.render(this.renderer));
	}

	getParticlesInRange(v, r) {
		let particles = this.actors.selectMany(a => a.body.particles);
		return particles.where(p => p.position.subtract(v).magnitude() <= r);
	}

	tick() {
		this.actors.each(a => a.prepare());
		this.checkBounds();
		this.checkCollisions();
		this.updatePositions();
		this.renderScene();
	}
}