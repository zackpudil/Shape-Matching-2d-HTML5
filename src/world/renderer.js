export default class Renderer {
	constructor(c) {
		this.context = c;
	}

	moveTo(v) {
		this.context.moveTo(v.x, v.y);
	}

	lineTo(v) {
		this.context.lineTo(v.x, v.y);
	}

	circle(v, r) {
		this.context.arc(v.x, v.y, r, 0, Math.PI*2);
	}

	reset() {
		this.context.beginPath();
	}

	updatePallet(p) {
		this.context.strokeStyle = p.stroke || 'black';
		this.context.fillStyle = p.fill || 'black';
		this.context.lineWidth = p.lineWidth || 1;
	}

	draw() {
		this.context.stroke();
		this.context.fill();
	}

	clear() {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.context.beginPath();
	}
}