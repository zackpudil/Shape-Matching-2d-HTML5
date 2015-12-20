
window.Demo = function(canvas) {

	var createActor = function () {
		return new Actor(new Body([], 1),
			{ stroke: '#CA72F2', fill: '#E0B3F5'},
			{ stroke: '#FFFFFF', fill: '#AFA4F5'}
		);
	}

	var scene = new Scene(canvas, canvas.width, canvas.height);
	scene.actors.push(createActor());
	
	var interval = null;
	
	var mouse = new Vector(0, 0);
	var mouseDown = false;
	var animated = false;
	
	var mouseParticle = null;
	
	this.animate = function() {
		if(scene.actors[scene.actors.length-1].body.particles.length == 0) {
			alert("Click the screen to add particles, ya dummy! :)");
			return false;
		}

		scene.actors[scene.actors.length-1].particlePallet = null;
		
		if(animated) return false;
		
		animated = true;
		
		interval = window.setInterval(function() {
			if(mouseDown)
				mouseParticle.position = mouse;

			scene.tick();

		}, Scene.TIMESTEP*1000);
		
		return true;
	};
	
	this.animateMouseDown = function(e) {
		mouse = new Vector(e.offsetX, e.offsetY);
		var particlesInRange = scene.getParticlesInRange(mouse, 15);
		if(particlesInRange.length != 0) {
			mouseDown = true;
			mouseParticle = particlesInRange[0];
			mouseParticle.fixed = true;
		}
	};
	
	this.stiffnessSliderChange = function(e) {
		var idx = $(e.target).data('index');
		scene.actors[idx].body.stiffness = e.target.value;
	};
	
	this.gravitySliderChange = function(e) {
		Scene.GRAVITY.y = e.target.value;
	};
	
	this.drawingMouseDown = function(e) {
		scene.actors[scene.actors.length-1].body.particles.push(new Particle(1, new Vector(e.offsetX, e.offsetY)));
		scene.renderScene();
	};
	
	this.mouseMove = function(e) {
		mouse = new Vector(e.offsetX, e.offsetY);
	};
	
	this.mouseUp = function(e) {
		mouseDown = false;
		if(mouseParticle) mouseParticle.fixed = false;
	};
	
	this.pause = function(e) {
		if(!animated) return false;
		
		scene.actors.push(createActor());
		
		clearInterval(interval);
		animated = false;
		
		return true;
	};
	
	this.clearCanvas = function(e) {
		scene.actors = [createActor()];
		scene.renderer.clear();
		clearInterval(interval);
		animated = false;
	};
	
	return this;
}