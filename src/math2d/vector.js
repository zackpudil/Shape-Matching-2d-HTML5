// <x, y>

/*-------------------------------------------------------
A Vector, which is a component that consists of an x and y coordinate,
	that repesents a spot on the 2d canvas
-------------------------------------------------------*/

export default class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(v) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	subtract(v) {
		return new Vector(this.x - v.x, this.y - v.y);;
	}

	scale(s) {
		return new Vector(this.x*s, this.y*s);
	}

	dot(v) {
		return this.x*v.x + this.y*v.y;
	}

	min(v) {
		return new Vector(Math.min(v.x, this.x), Math.min(v.y, this.y));
	}

	max(v) {
		return new Vector(Math.max(v.x, this.x), Math.max(v.y, this.y));
	}

	unit() {
		//unit vector is a vector's components divided by the magnitude.
		var mag = this.magnitude();
		return new Vector(this.x/mag, this.y/mag);
	}

	norm() {
		//left handed norm.
		return new Vector(this.y, -this.x);
	}

	magnitude() {
		return Math.sqrt(this.dot(this));
	}

	multiplyMatrix(m) {
		return new Vector(this.x*m.a+this.y*m.c, this.x*m.b+this.y*m.d);
	};

	maximumDirection() {
		if(Math.abs(this.x) > Math.abs(this.y))
			return this.x;

		return this.y;
	}

	update(v) {
		this.x = v.x;
		this.y = v.y;
	}
}