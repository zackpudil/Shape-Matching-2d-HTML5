Math2d = window.Math2d || { };

//	******************
//  *   a   *   b    *
//  *       *        *
//  ******************
//  *   c 	*		d	   *
//	*				*				 *
//	******************

Math2d.Matrix = function (a, b, c, d) {
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
};

Math2d.Matrix.prototype.add = function (m) {
	return new Math2d.Matrix(this.a + m.a, this.b + m.b, this.c + m.c, this.d + m.d);
};

Math2d.Matrix.prototype.subtract = function (m) {
	return new Math2d.Matrix(this.a - m.a, this.b - m.b, this.c - m.c, this.d - m.d);
};

Math2d.Matrix.prototype.multiply = function (m) {
	return new Math2d.Matrix(
		this.a * m.a + this.b * m.c,
		this.a * m.b + this.b * m.d,
		this.c * m.a + this.d * m.c,
		this.c * m.b + this.d * m.d
	);
};

Math2d.Matrix.prototype.multiplyVector = function (v) {
	if(!Math2d.Vector) return null;
	
	return new Math2d.Vector(this.a*v.x+this.b*v.y, this.c*v.x+this.d*v.y);
};

Math2d.Matrix.prototype.scale = function (s) {
	return new Math2d.Matrix(this.a*s, this.b*s, this.c*s, this.d*s);
};

Math2d.Matrix.prototype.transpose = function () {
	return new Math2d.Matrix(this.a, this.c, this.b, this.d);
}

Math2d.Matrix.prototype.determinate = function () {
	return this.a*this.d - this.b*this.c;
};

Math2d.Matrix.prototype.trace = function () {
	return this.a + this.d;
};

Math2d.Matrix.prototype.inverse = function () {
	var det = this.determinate();
	if(det == 0) return this;
	
	var m = new Math2d.Matrix(this.d, this.b*-1, this.c*-1, this.a);
	m.scale_(1/det);
	
	return m;
};

Math2d.Matrix.prototype.equals = function (m) {
	return m.a.toFixed(5) == this.a.toFixed(5)
		&& m.b.toFixed(5) == this.b.toFixed(5)
		&& m.c.toFixed(5) == this.c.toFixed(5)
		&& m.d.toFixed(5) == this.d.toFixed(5);
}

Math2d.Matrix.prototype.eigenDecomposition = function () {
	var eigenValueMatrix = new Math2d.Matrix(this.a, this.b, this.c, this.d);
	var eigenVectorMatrix = new Math2d.Matrix(1, 0, 0, 1);
	
	var d = (this.a - this.d)/(2*this.b);
	var t = 1/ (Math.abs(d) + Math.sqrt(d*d + 1));
	
	if( d < 0) t = -t;
	
	var c = 1/Math.sqrt(t*t + 1);
	var s = t*c;
	
	eigenValueMatrix.a += t*this.b;
	eigenValueMatrix.d -= t*this.b;
	eigenValueMatrix.b = eigenValueMatrix.c = 0;
	
	eigenVectorMatrix.a = c;
	eigenVectorMatrix.b = -s;
	eigenVectorMatrix.c = s;
	eigenVectorMatrix.d = c;
	
	return {
		eigenValues: eigenValueMatrix,
		eigenVectors: eigenVectorMatrix
	}
};

Math2d.Matrix.prototype.polarDecomposition = function () {
	var rotationMatrix = new Math2d.Matrix(1, 0, 0, 1);
	var scalarMatrix = new Math2d.Matrix(0, 0, 0, 0);
	
	var ata = this.transpose().multiply(this);
	var e = ata.eigenDecomposition();
	
	var la = e.eigenValues.a <= 0 ? 0 : 1/Math.sqrt(e.eigenValues.a);
	var lb = e.eigenValues.d <= 0 ? 0 : 1/Math.sqrt(e.eigenValues.d);
	
	scalarMatrix.a = la*e.eigenVectors.a*e.eigenVectors.a + lb*e.eigenVectors.b*e.eigenVectors.b;
	scalarMatrix.b = la*e.eigenVectors.a*e.eigenVectors.c + lb*e.eigenVectors.b*e.eigenVectors.d;
	scalarMatrix.c = scalarMatrix.b;
	scalarMatrix.d = la*e.eigenVectors.c*e.eigenVectors.c + lb*e.eigenVectors.d*e.eigenVectors.d;
	
	rotationMatrix = this.multiply(scalarMatrix);
	scalarMatrix = rotationMatrix.transpose().multiply(this);
	
	return {
		rotation: rotationMatrix,
		scalar: scalarMatrix
	};
};

(function () {
	for(var method in Math2d.Matrix.prototype) {
		if(!/new Math2d\.Matrix/g.test(Math2d.Matrix.prototype[method]) && method != "eigenDecomposition") continue;
		
		(function (name) {
			Math2d.Matrix.prototype[name+'_'] = function(args) {
				var m = this[name](args);
				
				this.a = m.a; this.b = m.b;
				this.c = m.c; this.d = m.d;
			}
		})(method);
	}
})();