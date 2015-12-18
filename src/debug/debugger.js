import Vector from '../math2d/vector';

export default class Debugger {
	constructor(scene) {
		this.renderer = scene.renderer;
	}

	drawCircle(p, c, a) {
		this.renderer.reset();
		this.renderer.updatePallet({ stroke: c, fill: c });
		this.renderer.context.globalAlpha = a || 1;

		this.renderer.circle(p, 10);
		this.renderer.draw();
	}

	drawVect(s, p, c) {
		this.renderer.reset();
		this.renderer.updatePallet({ stroke: c, fill: c });
		this.renderer.context.globalAlpha = 1;

		this.renderer.moveTo(s);
		this.renderer.lineTo(s.add(p));
		this.renderer.draw();
	}

	drawAABB(aabb, c) {
		let w = new Vector(aabb.width, 0);
		let l = new Vector(0, aabb.length);

		this.renderer.reset();
		this.renderer.updatePallet({ stroke: c, fill: 'none' });
		this.renderer.context.globalAlpha = 1;

		this.renderer.moveTo(aabb.position.subtract(w).subtract(l));
		this.renderer.lineTo(aabb.position.add(w).subtract(l));
		this.renderer.lineTo(aabb.position.add(w).add(l));
		this.renderer.lineTo(aabb.position.subtract(w).add(l));
		this.renderer.lineTo(aabb.position.subtract(w).subtract(l));

		this.renderer.draw();
	}
}