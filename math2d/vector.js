define([], function() {

	// <x, y>

	/*-------------------------------------------------------
	A Vector, which is a component that consists of an x and y coordinate,
		that repesents a spot on the 2d canvas
	-------------------------------------------------------*/
	var Vector = function(x, y) {
		this.x = x;
		this.y = y;
	};

	Vector.prototype.add = function (v) {
		return new Vector(this.x + v.x, this.y + v.y);
	};

	Vector.prototype.subtract = function (v) {
		return new Vector(this.x - v.x, this.y - v.y);;
	};

	Vector.prototype.scale = function (s) {
		return new Vector(this.x*s, this.y*s);
	};

	Vector.prototype.dot = function (v) {
		return this.x*v.x + this.y*v.y;
	};

	Vector.prototype.min = function (v) {
		return new Vector(Math.min(v.x, this.x), Math.min(v.y, this.y));
	};

	Vector.prototype.max = function (v) {
		return new Vector(Math.max(v.x, this.x), Math.max(v.y, this.y));
	};

	Vector.prototype.unit = function () {
		//unit vector is a vector's components divided by the magnitude.
		var mag = this.magnitude();
		return new Vector(this.x/mag, this.y/mag);
	};

	Vector.prototype.norm = function () {
		//left handed norm.
		return new Vector(this.y, -this.x);
	};

	Vector.prototype.magnitude = function () {
		return Math.sqrt(this.dot(this));
	};

	Vector.prototype.multiplyMatrix = function (m) {
		return new Vector(this.x*m.a+this.y*m.c, this.x*m.b+this.y*m.d);
	};

	Vector.prototype.maximumDirection = function () {
		if(Math.abs(this.x) > Math.abs(this.y))
			return this.x;

		return this.y;
	};

	(function() {
		//this block of code will run through the methods in the prototype where the code contains "new Vector". and
		// create a new one with an attached underscore, which will modifiy the current vector instead of returning a new one.
		for(var method in Vector.prototype) {
			if(!/new Vector/g.test(Vector.prototype[method])) continue;
			
			(function(name) {
				Vector.prototype[name+'_'] = function (arg) {
					var v = this[name](arg);
					this.x = v.x; this.y = v.y;
				}
			})(method);
		}
		
	})();

	return Vector;
});