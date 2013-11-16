define(['math2d/vector'], function(Vector) {

	//	******************
	//  *   a   *   b    *
	//  *       *        *
	//  ******************
	//  *   c 	*   d	 *
	//	*		*		 *
	//	******************

	/*-------------------------------------------------------
	This is a matrix, which in a sense, sorts the rotational data of a "vector".
	-------------------------------------------------------*/
	var Matrix = function (a, b, c, d) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	};

	Matrix.prototype.add = function (m) {
		return new Matrix(this.a + m.a, this.b + m.b, this.c + m.c, this.d + m.d);
	};

	Matrix.prototype.subtract = function (m) {
		return new Matrix(this.a - m.a, this.b - m.b, this.c - m.c, this.d - m.d);
	};

	Matrix.prototype.multiply = function (m) {
		return new Matrix(
			this.a * m.a + this.b * m.c,
			this.a * m.b + this.b * m.d,
			this.c * m.a + this.d * m.c,
			this.c * m.b + this.d * m.d
		);
	};

	Matrix.prototype.multiplyVector = function (v) {
		return new Vector(this.a*v.x+this.b*v.y, this.c*v.x+this.d*v.y);
	};

	Matrix.cartesianProduct = function (v1, v2) {
		return new Matrix(v1.x*v2.x, v1.x*v2.y, v1.y*v2.x, v1.y*v2.y);
	};

	Matrix.prototype.scale = function (s) {
		return new Matrix(this.a*s, this.b*s, this.c*s, this.d*s);
	};

	Matrix.prototype.transpose = function () {
		return new Matrix(this.a, this.c, this.b, this.d);
	}

	Matrix.prototype.determinate = function () {
		return this.a*this.d - this.b*this.c;
	};

	Matrix.prototype.trace = function () {
		return this.a + this.d;
	};

	Matrix.prototype.inverse = function () {
		var det = this.determinate();
		if(det == 0) return this;
		
		var m = new Matrix(this.d, this.b*-1, this.c*-1, this.a);
		m.scale_(1/det);
		
		return m;
	};

	Matrix.prototype.equals = function (m) {
		return m.a.toFixed(5) == this.a.toFixed(5)
			&& m.b.toFixed(5) == this.b.toFixed(5)
			&& m.c.toFixed(5) == this.c.toFixed(5)
			&& m.d.toFixed(5) == this.d.toFixed(5);
	}

	Matrix.prototype.eigenDecomposition = function () {
		//this method of eigen decomposition is a Jacobi rotation.
		var eigenValueMatrix = new Matrix(this.a, this.b, this.c, this.d);
		var eigenVectorMatrix = new Matrix(1, 0, 0, 1);
		
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

	Matrix.prototype.polarDecomposition = function () {
		//polar decomposition is decompositig a matrix "A" into two other matrices, "RS"
		//	where s contains the translative data and R contains the rotational data, in a sense.
		var rotationMatrix = new Matrix(1, 0, 0, 1);
		var scalarMatrix = new Matrix(0, 0, 0, 0);
		
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
		//loop through all the methods in this "class", and create self modifying methods.
		for(var method in Matrix.prototype) {
			if(!/new Matrix/g.test(Matrix.prototype[method]) || method == "eigenDecomposition" || method == "cartesianProduct") continue;
			//a anonymous self invoking function to perserve the method name inside of the '_' method.
			(function (name) {
				Matrix.prototype[name+'_'] = function(args) {
					//this line right here is the reason for the self invoking function. it was "method" than every "_" method would be calling the
					// last method in the for each iteration.
					var m = this[name](args);
					
					this.a = m.a; this.b = m.b;
					this.c = m.c; this.d = m.d;
				}
			})(method);
		}
	})();

	return Matrix;
});