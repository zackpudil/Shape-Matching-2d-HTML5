Collision = window.Collision || { };

Collision.AABB = function (l, w, p) {
	this.length = l;
	this.width = w;
	this.position = p;
};

Collision.AABB.create = function (body) {
	var center = body.center('newPosition'),
		relativeCoords = body.relativeCoords(center, 'newPosition'),
		maxRelativeCoordX = relativeCoords[0].x,
		maxRelativeCoordY = relativeCoords[0].y;

	relativeCoords.each(function(r) {
		if(Math.abs(maxRelativeCoordX) < Math.abs(r.x))
			maxRelativeCoordX = r.x;

		if(Math.abs(maxRelativeCoordY) < Math.abs(r.y))
			maxRelativeCoordY = r.y;
	});

	return new Collision.AABB(Math.abs(maxRelativeCoordY), Math.abs(maxRelativeCoordX), center);
};

Collision.AABB.prototype.check = function (aabb) {
	var distance = this.position.subtract(aabb.position);

	return this.width + aabb.width > Math.abs(distance.x)
		&& this.length + aabb.length > Math.abs(distance.y);
};