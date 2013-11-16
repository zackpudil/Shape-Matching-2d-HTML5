define(['Math2d'], function(Math2d) {

	/*------------------------------------------
	Since bounds collision is the most common collision and the most trivial response,
		we want to handle this as effitiently as possible.
	------------------------------------------*/
	var Bounds = function (minx, miny, maxx, maxy) {
		this.min = new Math2d.Vector(minx, miny);
		this.max = new Math2d.Vector(maxx, maxy);
	};

	Bounds.RESTITUTION = 0.3;

	Bounds.prototype.checkMin = function (v) {
		return v.x <= this.min.x || v.y <= this.min.y;
	};

	Bounds.prototype.checkMax = function (v) {
		return v.x >= this.max.x || v.y >= this.max.y;
	};

	Bounds.prototype.getPassiveCoord = function (v) {
		if(!this.check(v)) return false;
		
		return v.x >= this.max.x || v.x <= this.min.x ? 'y' : 'x';
	}

	Bounds.prototype.check = function (v) {
		return this.checkMax(v) || this.checkMin(v);
	};

	Bounds.prototype.clamp = function (v) {
		v.max_(this.min);
		v.min_(this.max);
	};

	return Bounds;
});