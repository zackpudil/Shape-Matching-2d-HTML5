var Demo = (function(canvas) {
	var createActor = function () {
		return new World.Actor(
			new Phys.Body([], 1),
			{ stroke:'#CA72F2', fill: '#E0B3F5'}, 
			{ stroke: '#8372F2', fill: '#AFA4F5'}
		);
	}
	var scene = new World.Scene(canvas, canvas.width, canvas.height);
	scene.actors.push(createActor());
	
	var interval = null;
	
	var mouse = new Math2d.Vector(0, 0);
	var mouseDown = false;
	var animated = false;
	
	var mouseParticle = null;
	
	this.animate = function() {
		if(scene.actors[scene.actors.length-1].body.particles.length == 0) {
			alert("Click the screen to add particles, ya dummy! :)");
			return false;
		}
		
		if(animated) return false;
		
		animated = true;
		
		interval = window.setInterval(function() {
			if(mouseDown)
				mouseParticle.position = mouse;

			scene.tick();

			scene.actors.each(function(a) {
				debugDraw(0, Raphael.getColor(), a.body);
			});

			Raphael.getColor.reset();

		}, World.Scene.TIMESTEP*1000);
		
		return true;
	};
	
	this.animateMouseDown = function (e) {
		mouse = new Math2d.Vector(e.offsetX, e.offsetY);
		var particlesInRange = scene.getParticlesInRange(mouse, 15);
		if(particlesInRange.length != 0) {
			mouseDown = true;
			mouseParticle = particlesInRange[0];
			mouseParticle.fixed = true;
		}
	};
	
	this.stiffnessSliderChange = function (e) {
		var idx = $(e.target).data('index');
		scene.actors[idx].body.stiffness = e.target.value;
	};
	
	this.gravitySliderChange = function (e) {
		World.Scene.GRAVITY.y = e.target.value;
	};
	
	this.drawingMouseDown = function (e) {
		scene.actors[scene.actors.length-1].body.particles.push(new Phys.Particle(1, new Math2d.Vector(e.offsetX, e.offsetY)));
		scene.renderScene();
	};
	
	this.mouseMove = function (e) {
		mouse = new Math2d.Vector(e.offsetX, e.offsetY);
	};
	
	this.mouseUp = function (e) {
		mouseDown = false;
		if(mouseParticle) mouseParticle.fixed = false;
	};
	
	this.pause = function (e) {
		if(!animated) return false;
		
		scene.actors.push(createActor());
		
		clearInterval(interval);
		animated = false;
		
		return true;
	};
	
	this.clearCanvas = function (e) {
		scene.actors = [createActor()];
		scene.renderer.clear();
		clearInterval(interval);
		animated = false;
	};

	var debugDraw = function(j, c, body) {
		var coll = body.collisionAxises();

		var pForJ = new Math2d.Vector(0, 0);
		scene.renderer.context.fillStyle = '#000';
		scene.renderer.context.strokeStyle = '#000';
		scene.renderer.context.lineWidth = 1;

		Array.range(1, body.particles.length+1).each(function(i) {
			var p1 = body.particles[i-1].newPosition;
			var p2 = body.particles[i > body.particles.length-1 ? 0 : i].newPosition;
			var p = p1.add(p2.subtract(p1).scale(1/2));

			if (i-1 == j) pForJ = new Math2d.Vector(p.x, p.y);

			scene.renderer.reset();
			scene.renderer.moveTo(p);
			scene.renderer.lineTo(p.add(coll[i-1].scale(50)));
			scene.renderer.draw();
		});

		scene.renderer.context.strokeStyle = c
		scene.renderer.context.fillStyle = c
		scene.renderer.context.globalAlpha = 0.5;
		scene.renderer.context.lineWidth = 5;

		scene.renderer.reset();
		scene.renderer.moveTo(pForJ);
		scene.renderer.lineTo(pForJ.add(coll[j].scale(1000)));
		scene.renderer.draw();

		scene.renderer.reset();
		scene.renderer.moveTo(pForJ);
		scene.renderer.lineTo(pForJ.add(coll[j].scale(-1000)));
		scene.renderer.draw();

		var minMax = body.minMaxProjections(coll[j]);

		scene.renderer.context.globalAlpha = 0.1;
		scene.renderer.reset();
		scene.renderer.circle(minMax.min.part.newPosition, 10);
		scene.renderer.draw();

		scene.renderer.context.globalAlpha = 1;
		scene.renderer.reset();
		scene.renderer.circle(minMax.max.part.newPosition, 10);
		scene.renderer.draw();
	}
	
	return this;
});