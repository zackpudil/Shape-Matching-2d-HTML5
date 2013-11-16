require.config({
	paths: {
		'Math2d': 'math2d/math2d',
		'Collision': 'collision/collision',
		'Phys': 'phys/phys',
		'World': 'world/world'
	}
});

require(['lib/array.ext', 'debug/debugger'], function() { });