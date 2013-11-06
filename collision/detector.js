Collision = window.Collision || { };

Collision.Detector = function () { };

Collision.Detector.prototype.narrowPhaseDetection = function (a, b) {
	var self = this;

	var axises = this.collisionAxises(a);
	axises.pushRange(this.collisionAxises(b));

	var isSeperated = false;
	var mtv = { axis: axises[0], overlap: Number.MAX_VALUE };

	axises.each(function(axis) {
		var aProjection = self.minMaxProjections(a, axis),
			bProjection = self.minMaxProjections(b, axis);
			
		isSeperated = bProjection.max.proj < aProjection.min.proj || aProjection.max.proj < bProjection.min.proj;
		if(isSeperated) return false;

		var overlap = self.projectionOverlap(aProjection, bProjection, axis);

		if(overlap.overlap < mtv.overlap)
			mtv = overlap;
	});

	// TODO: Have remove this into a seperate response class that will be more configurable by the body.
	if(!isSeperated) {

		var translation = mtv.axis.scale(mtv.overlap);

		if(translation.maximumDirection() < 0)
			translation.scale_(-1);

		mtv.minPart.newPosition.add_(translation);
		mtv.maxPart.newPosition.subtract_(translation);
	}	
};

Collision.Detector.prototype.projectionOverlap = function(a, b, axis) {
	var min = a.min.proj > b.min.proj ? a.min.proj : b.min.proj;
	var max = a.max.proj < b.max.proj ? a.max.proj : b.max.proj;

	var minPart, maxPart;

	if(a.min.proj > b.min.proj) {
		minPart = a.min.part;
		maxPart = b.max.part;
	} else {
		minPart = b.min.part;
		maxPart = a.max.part;
	}

	return { 
		overlap: max - min,
		minPart: minPart,
		maxPart: maxPart,
		axis: axis
	};
}

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