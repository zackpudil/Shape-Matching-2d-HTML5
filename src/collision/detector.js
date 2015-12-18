import AABB from './aabb';

export default class Detector {

	broadPhaseDetection(bodies) {
		return bodies.permutateWhere((a, b) => AABB.create(a).check(AABB.create(b)));
	}

	narrowPhaseDetection(a, b) {
		let axises = this.collisionAxises(a);
		axises.pushRange(this.collisionAxises(b));

		let isSeperated = false;
		let mtv = { axis: axises[0], overlap: Number.MAX_VALUE };

		axises.each(axis => {
			let aProjection = this.minMaxProjections(a, axis);
			let bProjection = this.minMaxProjections(b, axis);

			isSeperated = bProjection.max.proj < aProjection.min.proj || aProjection.max.proj < bProjection.min.proj;
			if(isSeperated) return false;

			let overlap = this.projectionOverlap(aProjection, bProjection, axis);

			if(overlap.overlap < mtv.overlap)
				mtv = overlap;
		});

		if(!isSeperated) {
			let translation = mtv.axis.scale(mtv.overlap);

			if(translation.maximumDirection() < 0)
				translation.update(translation.scale(-1));

			mtv.minPart.newPosition.update(mtv.minPart.newPosition.add(translation));
			mtv.maxPart.newPosition.update(mtv.maxPart.newPosition.subtract(translation));
		}
	}

	projectionOverlap(a, b, axis) {
		let min = a.min.proj > b.min.proj ? a.min.proj : b.min.proj;
		let max = a.max.proj < b.max.proj ? a.max.proj : b.max.proj;

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

	minMaxProjections(body, axis) {
		// this function gets the min-max projections of the body and the axis.
		// essentially the least/greatest particle's position along the axis.
		let sorted = body.particles
			.select(p => { return { part: p, proj: Math.abs(p.newPosition.dot(axis)) }; });

		let min = sorted[0];
		let max = min;

		sorted.each(s => {
			if(s.proj < min.proj)
				min = s;

			if(s.proj > max.proj)
				max = s;
		});

		return {
			min: min,
			max: max
		};
	}

	collisionAxises(body) {
		return Array
			.range(1, body.particles.length + 1)
			.select(i => {
				let p1 = body.particles[i == body.particles.length ? 0 : i].newPosition,
					p2 = body.particles[i - 1].newPosition;

				return p1.subtract(p2).norm().unit();
			});
	}
}