import Vector from '../math2d/vector';
import Matrix from '../math2d/matrix';

//Linq-y javascript :)!  I know there is some risk to modifying the prototypes of
//	native javascript Objects, but I'm only adding methods to the prototypes, and never modifying the existing props or methods.
Array.prototype.each = function (delegate) {
	for(var i = 0; i < this.length; i++)
		if(delegate(this[i]) === false) break;
};

Array.prototype.select = function (delegate) {
	var selects = [];
	
	for(var i = 0; i < this.length; i++)
		selects.push(delegate(this[i]));
	
	return selects;
};

Array.prototype.selectMany = function (delegate) {
	var selects = [];
	
	for(var i = 0; i < this.length; i++)
		delegate(this[i]).select(function(a) { selects.push(a); });
	
	return selects;
};

Array.prototype.where = function (predicate) {
	var wheres = [];
	
	for(var i = 0; i < this.length; i++)
		if(predicate(this[i])) wheres.push(this[i]);
	
	return wheres;
}

Array.prototype.sum = function (delegate) {
	var total = 0;
	
	for(var i = 0; i < this.length; i++)
		total += delegate(this[i]);
	
	return total;
};

Array.prototype.sumV = function (delegate) {
	var total = new Vector(0, 0);
	
	for(var i = 0; i < this.length; i++)
		total.update(total.add(delegate(this[i])));
	
	return total;
};

Array.prototype.sumM = function (delegate) {
	var total = new Matrix(0, 0, 0, 0);
	
	for(var i = 0; i < this.length; i++)
		total.update(total.add(delegate(this[i])));
	
	return total;
};

Array.prototype.any = function (predicate) {
	var any = false;
	
	for(var i = 0; i < this.length; i++) {
		any = predicate(this[i]);
		if(any) break;
	}
	
	return any;
};

Array.prototype.pushRange = function (array) {
	for(var i = 0; i < array.length; i++)
		this.push(array[i]);
};

Array.prototype.permutate = function (delegate) {
	for(var i = 0; i < this.length; i++)
		for(var j = i + 1; j < this.length; j++)
			delegate(this[i], this[j]);
};

Array.prototype.permutateWhere = function (predicate) {
	var result = [];
	for(var i = 0; i < this.length; i++) {
		var r = [this[i]];
		
		for(var j = i + 1; j < this.length; j++) {
			if(predicate(this[i], this[j]))
				r.push(this[j]);
		}

		if(r.length > 1)
			result.push(r);
	}

	return result;
}

Array.enumerate = function(l) {
	return Array.range(0, l);
};

Array.range = function(s, l) {
	var ret = [];
	
	for(var i = s; i < l; i++) {
		ret.push(i);
	}
	
	return ret;
};
