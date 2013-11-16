define([], function() {

	/*------------------------------------------
	Simply a container to the HTML 5 canvas drawing lib.
	------------------------------------------*/
	var Renderer = function (c) {
		this.context = c;
	};

	Renderer.prototype.moveTo = function (v) {
		this.context.moveTo(v.x, v.y);
	};

	Renderer.prototype.lineTo = function (v) {
		this.context.lineTo(v.x, v.y);
	};

	Renderer.prototype.circle = function (v, r) {
		this.context.arc(v.x, v.y, r, 0, Math.PI*2);
	};

	Renderer.prototype.reset = function () {
		this.context.beginPath();
	};

	Renderer.prototype.updatePallet = function (p) {
		this.context.strokeStyle = p.stroke || 'black';
		this.context.fillStyle = p.fill || 'black';
		this.context.lineWidth = p.lineWidth || 1;
	}

	Renderer.prototype.draw = function () { 
		this.context.stroke(); 
		this.context.fill(); 
	};

	Renderer.prototype.clear = function () {
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.context.beginPath();
	};

	return Renderer;
});