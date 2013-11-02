Collision = window.Collision || { };

Collision.Detector = function () { };

Collision.Detector.prototype.narrowPhaseDetection = function (b1, b2) {
	var self = this;

	var axises = this.collisionAxises(b1);
	axises.pushRange(this.collisionAxises(b2));

	var renderer = new World.Renderer(document.getElementById('canvas').getContext('2d'));
	var center = new Math2d.Vector(250, 250);

	var isSeperated = false;
	axises.each(function(axis) {
		var b1MinMax = self.minMaxProjections(b1, axis),
			b2MinMax = self.minMaxProjections(b2, axis);
			
		isSeperated = b2MinMax.max.proj < b1MinMax.min.proj || b1MinMax.max.proj < b2MinMax.min.proj;

		if(isSeperated) return false;
	});

	return !isSeperated;	
};

Collision.Detector.prototype.minMaxProjections = function (body, axis) {
	var sortedByProjects = body.particles.sortBy(function(p) { return axis.scale(p.newPosition.dot(axis)).magnitude(); }),
		minPart = sortedByProjects[0],
		maxPart = sortedByProjects[sortedByProjects.length-1];

	return {
		min: { part: minPart, proj: axis.scale(minPart.newPosition.dot(axis)).magnitude() },
		max: { part: maxPart, proj: axis.scale(maxPart.newPosition.dot(axis)).magnitude() }
	};
};

Collision.Detector.prototype.collisionAxises = function (body) {
	return Array
		.range(1, body.particles.length+1)
		.select(function(i) {
			var p1 = body.particles[i == body.particles.length ? 0 : i].newPosition,
				p2 = body.particles[i - 1].newPosition;
			return p1.subtract(p2).norm().unit();
		});
};