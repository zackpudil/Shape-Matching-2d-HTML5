World = window.World || { };


/*------------------------------------------
The actor, as of now contains the body and color/stroke/alpha, and knows how to render itself.
------------------------------------------*/
World.Actor = function (b, bc, pc) {
	this.body = b;
	this.bodyPallet = bc;
	this.particlePallet = pc;
};

World.Actor.prototype.render = function(renderer) {
	renderer.updatePallet(this.bodyPallet);
	
	renderer.moveTo(this.body.particles[0].position);
	
	this.body.particles.slice(1).each(function(p) {
		renderer.lineTo(p.position);
	});
	
	renderer.lineTo(this.body.particles[0].position);
	renderer.draw();
	
	renderer.updatePallet(this.particlePallet);
	
	this.body.particles.each(function(p) { 
		renderer.reset();
		renderer.circle(p.position, 5); 
		renderer.draw();
	});
	
	renderer.reset();
};

World.Actor.prototype.prepare = function () {
	this.body.externalForces();
	//prepare adds external forces, then shape matching.
	this.body.projectPositions();
}

World.Actor.prototype.act = function () {
	this.body.integrate();
};