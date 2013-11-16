define(['collision/aabb'], function (AABB) {

	/*------------------------------------------
	This handles detecting collisions in the scene.
	There will be 2 types:
		broad phase: generates AABB for all bodies and does simple detection.  Isn't full proof, just tells us that two bodies are "close".
		narrow  phase: uses the Seperating Axis theorem to determine if two objects are actually colliding.
	------------------------------------------*/
	var Detector = function () { };

	Detector.prototype.broadPhaseDetection = function (bodies) {	
		var self = this;
		var collidingGroups = bodies.permutateWhere(function(a, b) {
			return AABB.create(a).check(AABB.create(b));
		});
		return collidingGroups;
	};

	Detector.prototype.narrowPhaseDetection = function (a, b) {
		//this uses the seperating axis theorem.
		var self = this;

		//get all the axis from both bodies.
		var axises = this.collisionAxises(a);
		axises.pushRange(this.collisionAxises(b));

		var isSeperated = false;
		var mtv = { axis: axises[0], overlap: Number.MAX_VALUE };

		axises.each(function(axis) {
			//get the min-max projections of each body
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

	Detector.prototype.projectionOverlap = function(a, b, axis) {
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

	Detector.prototype.minMaxProjections = function (body, axis) {
		// this function gets the min-max projections of the body and the axis.
		// essentially the least/greatest particle's position along the axis.
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

	Detector.prototype.collisionAxises = function (body) {
		//get the normals of the surfaces of the of the polygons.
		return Array
			.range(1, body.particles.length + 1)
			.select(function(i) {
				var p1 = body.particles[i == body.particles.length ? 0 : i].newPosition,
					p2 = body.particles[i - 1].newPosition;

				return p1.subtract(p2).norm().unit();
			});
	};

	return Detector;
});