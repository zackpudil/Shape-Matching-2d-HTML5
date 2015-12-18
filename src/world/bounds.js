import Vector from '../math2d/vector';

export default class Bounds {
	constructor(minx, miny, maxx, maxy) {
		this.min = new Vector(minx, miny);
		this.max = new Vector(maxx, maxy);
	}

	static get RESTITUTION() { return 0.3 }

	checkMin(v) {
		return v.x <= this.min.x || v.y <= this.min.y;
	}

	checkMax(v) {
		return v.x >= this.max.x || v.y >= this.max.y;
	}

	getPassiveCoord(v) {
		if(!this.check(v)) return false;

		return v.x >= this.max.x || v.x <= this.min.x ? 'y' : 'x';
	}

	check(v) {
		return this.checkMax(v) || this.checkMin(v);
	}

	clamp(v) {
		v.update(v.max(this.min));
		v.update(v.min(this.max));
	}
}