export default class AABB {
	constructor(l, w, p) {
		this.length = l;
		this.width = w;
		this.position = p;
	}

	static create(body) {
		let center = body.center('newPosition'),
			relativeCoords = body.relativeCoords(center, 'newPosition'),
			maxRelativeCoordX = relativeCoords[0].x,
			maxRelativeCoordY = relativeCoords[0].y;

		relativeCoords.each(function(r) {
			if(Math.abs(maxRelativeCoordX) < Math.abs(r.x))
				maxRelativeCoordX = r.x;

			if(Math.abs(maxRelativeCoordY) < Math.abs(r.y))
				maxRelativeCoordY = r.y;
		});

		return new AABB(Math.abs(maxRelativeCoordY), Math.abs(maxRelativeCoordX), center);
	}

	check(aabb) {
		let distance = this.position.subtract(aabb.position);

		return this.width + aabb.width > Math.abs(distance.x)
			&& this.length + aabb.length > Math.abs(distance.y);
	}
}