World = window.World || { };

World.Bounds = function (minx, miny, maxx, maxy) {
	this.min = new Math2d.Vector(minx, miny);
	this.max = new Math2d.Vector(maxx, maxy);
};

World.Bounds.RESTITUTION = 0.3;

World.Bounds.prototype.checkMin = function (v) {
	return v.x <= this.min.x || v.y <= this.min.y;
};

World.Bounds.prototype.checkMax = function (v) {
	return v.x >= this.max.x || v.y >= this.max.y;
};

World.Bounds.prototype.getPassiveCoord = function (v) {
	if(!this.check(v)) return false;
	
	return v.x >= this.max.x || v.x <= this.min.x ? 'y' : 'x';
}

World.Bounds.prototype.check = function (v) {
	return this.checkMax(v) || this.checkMin(v);
};

World.Bounds.prototype.clamp = function (v) {
	v.max_(this.min);
	v.min_(this.max);
};