Collision = window.Collision || { };

Collision.AABB = function (l, w, p) {
	this.length = l;
	this.width = w;
	this.position = p;
};

Collision.AABB.prototype.check = function (aabb) {
	var distance = this.position.subtract(aabb.position);

	return this.width + aabb.width > Math.abs(distance.x)
		&& this.length + aabb.length > Math.abs(distance.y);
};