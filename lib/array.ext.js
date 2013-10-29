
Array.prototype.each = function (delegate) {
	for(var i = 0; i < this.length; i++) {
		delegate(this[i]);
	}
};

Array.prototype.select = function (delegate) {
	var selects = [];
	
	for(var i = 0; i < this.length; i++) {
		selects.push(delegate(this[i]));
	}
	
	return selects;
};

Array.prototype.where = function (predicate) {
	var wheres = [];
	
	for(var i = 0; i < this.length; i++) {
		wheres.push(predicate(this[i]));
	}
	
	return wheres;
}

Array.prototype.sum = function (delegate) {
	var total = 0;
	
	for(var i = 0; i < this.length; i++) {
		total += delegate(this[i]);
	}
	
	return total;
};

Array.prototype.sumV = function (delegate) {
	var total = new Math2d.Vector(0, 0);
	
	for(var i = 0; i < this.length; i++) {
		total.add_(delegate(this[i]));
	}
	
	return total;
};

Array.prototype.sumM = function (delegate) {
	var total = new Math2d.Matrix(0, 0, 0, 0);
	
	for(var i = 0; i < this.length; i++) {
		total.add_(delegate(this[i]));
	}
	
	return total;
}

Array.prototype.any = function (predicate) {
	var any = false;
	
	for(var i = 0; i < this.length; i++) {
		any = predicate(this[i]);
		if(any) break;
	}
	
	return any;
};

Array.enumerate = function(l) {
	var ret = [];
	
	for(var i = 0; i < l; i++) {
		ret.push(i);
	}
	
	return ret;
}