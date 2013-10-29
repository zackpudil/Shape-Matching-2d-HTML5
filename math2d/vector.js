Math2d = window.Math2d || {};

// <x, y>

Math2d.Vector = function(x, y) {
	this.x = x;
	this.y = y;
};

Math2d.Vector.prototype.add = function (v) {
	return new Math2d.Vector(this.x + v.x, this.y + v.y);
};

Math2d.Vector.prototype.subtract = function (v) {
	return new Math2d.Vector(this.x - v.x, this.y - v.y);;
};

Math2d.Vector.prototype.scale = function (s) {
	return new Math2d.Vector(this.x*s, this.y*s);
};

Math2d.Vector.prototype.squaredMagnitude = function () {
	return this.x*this.x + this.y*this.y;
};

Math2d.Vector.prototype.min = function (v) {
	return new Math2d.Vector(Math.min(v.x, this.x), Math.min(v.y, this.y));
};

Math2d.Vector.prototype.max = function (v) {
	return new Math2d.Vector(Math.max(v.x, this.x), Math.max(v.y, this.y));
}

Math2d.Vector.prototype.magnitude = function () {
	return Math.sqrt(this.squaredMagnitude());
};

Math2d.Vector.prototype.multiplyMatrix = function (m) {
	return new Math2d.Vector(this.x*m.a+this.y*m.c, this.x*m.b+this.y*m.d);
}

Math2d.Vector.prototype.cartesianProduct = function (v) {
	return new Math2d.Matrix(this.x*v.x, this.x*v.y, this.y*v.x, this.y*v.y);
};

(function() {
	
	for(var method in Math2d.Vector.prototype) {
		if(!/new Math2d\.Vector/g.test(Math2d.Vector.prototype[method])) continue;
		
		(function(name) {
			Math2d.Vector.prototype[name+'_'] = function (arg) {
				var v = this[name](arg);
				this.x = v.x; this.y = v.y;
			}
		})(method);
	}
	
})();