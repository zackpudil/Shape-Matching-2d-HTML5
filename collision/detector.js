Collision = window.Collision || { };

Collision.Detector = function () { };

Collision.Detector.prototype.narrowPhaseDetection = function (b1, b2) {
	var self = this;

	var axises = this.collisionAxises(b1);
	axises.pushRange(this.collisionAxises(b2));

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
	var sorted = body.particles
		.select(function(p) { return { part: p, proj: Math.abs(p.newPosition.dot(axis)) } });

	var min = sorted[0];
	var max = min;

	sorted.each(function(s) {
		if(s.proj < min.proj)
			min = s;

		if(s.proj > max.proj)
			max = s;
	});

	return {
		min: min,
		max: max
	};
};

Collision.Detector.prototype.collisionAxises = function (body) {
	return Array
		.range(1, body.particles.length + 1)
		.select(function(i) {
			var p1 = body.particles[i == body.particles.length ? 0 : i].newPosition,
				p2 = body.particles[i - 1].newPosition;

			return p1.subtract(p2).norm().unit();
		});
};