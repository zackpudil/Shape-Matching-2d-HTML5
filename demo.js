var Demo = (function(canvas) {
	var body = new Phys.Body([], 1);
	var actor = new World.Actor(
		body,
		{ stroke:'#CA72F2', fill: '#E0B3F5'}, 
		{ stroke: '#8372F2', fill: '#AFA4F5'}
	);
	
	var scene = new World.Scene(canvas);
	scene.addActor(actor);
	
	var interval = null;
	
	var mouse = new Math2d.Vector(0, 0);
	var mouseDown = false;
	
	this.animate = function() {
		interval = window.setInterval(function() {
			if(mouseDown)
				body.particles[0].position = mouse;
				
			scene.tick();
		}, World.Scene.TIMESTEP*1000);
	};
	
	this.animateMouseDown = function (e) {
		body.particles[0].fixed = true;
		mouseDown = true;
	};
	
	this.stiffnessSliderChange = function (e) {
		body.stiffness = e.target.value;
	};
	
	this.gravitySliderChange = function (e) {
		World.Scene.GRAVITY.y = e.target.value;
	};
	
	this.drawingMouseDown = function (e) {
		body.particles.push(new Phys.Particle(1, new Math2d.Vector(e.offsetX, e.offsetY)));
		scene.renderScene();
	};
	
	this.mouseMove = function (e) {
		mouse = new Math2d.Vector(e.offsetX, e.offsetY);
	};
	
	this.mouseUp = function (e) {
		mouseDown = false;
		body.particles[0].fixed = false;
	};
	
	this.reset = function (e) {
		body.particles = [];
		clearInterval(interval);
	};
	
	return this;
});