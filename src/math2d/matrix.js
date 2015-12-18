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

import Vector from './vector';

export default class Matrix {

	constructor(a, b, c, d) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	};

	add(m) {
		return new Matrix(this.a + m.a, this.b + m.b, this.c + m.c, this.d + m.d);
	}

	subtract(m) {
		return new Matrix(this.a - m.a, this.b - m.b, this.c - m.c, this.d - m.d);
	}

	multiply(m) {
		return new Matrix(
			this.a * m.a + this.b * m.c,
			this.a * m.b + this.b * m.d,
			this.c * m.a + this.d * m.c,
			this.c * m.b + this.d * m.d
		);
	}

	multiplyVector(v) {
		return new Vector(this.a*v.x+this.b*v.y, this.c*v.x+this.d*v.y);
	}

	static cartesianProduct(v1, v2) {
		return new Matrix(v1.x*v2.x, v1.x*v2.y, v1.y*v2.x, v1.y*v2.y);
	};

	scale(s) {
		return new Matrix(this.a*s, this.b*s, this.c*s, this.d*s);
	}

	transpose() {
		return new Matrix(this.a, this.c, this.b, this.d);
	}

	determinate() {
		return this.a*this.d - this.b*this.c;
	}

	trace() {
		return this.a + this.d;
	}

	inverse() {
		let det = this.determinate();
		if(det == 0) return this;
		
		let m = new Matrix(this.d, this.b*-1, this.c*-1, this.a);
		m = m.scale(1/det);
		
		return m;
	}

	equals(m) {
		return m.a.toFixed(5) == this.a.toFixed(5)
			&& m.b.toFixed(5) == this.b.toFixed(5)
			&& m.c.toFixed(5) == this.c.toFixed(5)
			&& m.d.toFixed(5) == this.d.toFixed(5);
	}

	eigenDecomposition() {
		//this method of eigen decomposition is a Jacobi rotation.
		let eigenValueMatrix = new Matrix(this.a, this.b, this.c, this.d);
		let eigenVectorMatrix = new Matrix(1, 0, 0, 1);
		
		let d = (this.a - this.d)/(2*this.b);
		let t = 1/ (Math.abs(d) + Math.sqrt(d*d + 1));
		
		if( d < 0) t = -t;
		
		let c = 1/Math.sqrt(t*t + 1);
		let s = t*c;
		
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
	}

	polarDecomposition() {
		//polar decomposition is decompositig a matrix "A" into two other matrices, "RS"
		//	where s contains the translative data and R contains the rotational data, in a sense.
		let rotationMatrix = new Matrix(1, 0, 0, 1);
		let scalarMatrix = new Matrix(0, 0, 0, 0);
		
		let ata = this.transpose().multiply(this);
		let e = ata.eigenDecomposition();
		
		let la = e.eigenValues.a <= 0 ? 0 : 1/Math.sqrt(e.eigenValues.a);
		let lb = e.eigenValues.d <= 0 ? 0 : 1/Math.sqrt(e.eigenValues.d);
		
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
	}

	update(m) {
		this.a = m.a;
		this.b = m.b;
		this.c = m.c;
		this.d = m.d;
	}
}
