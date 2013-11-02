
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
	var total = new Math2d.Vector(0, 0);
	
	for(var i = 0; i < this.length; i++)
		total.add_(delegate(this[i]));
	
	return total;
};

Array.prototype.sumM = function (delegate) {
	var total = new Math2d.Matrix(0, 0, 0, 0);
	
	for(var i = 0; i < this.length; i++)
		total.add_(delegate(this[i]));
	
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

Array.prototype.sortBy = function (delegate) {
	var inx = {};
	var nums = [];
	var ret = [];
	
	for(var i = 0; i < this.length; i++) {
		var answer = delegate(this[i]);
		if(typeof(inx[answer]) != 'undefined') {
			inx[answer] = i;
			nums.push(answer);
		} else {
			var r = Math.random();
			inx[answer+r] = i;
			nums.push(answer+r);
		}
	}
	
	nums.sort();
	for(var i = 0; i < nums.length; i++)
		ret.push(this[inx[nums[i]]]);
	
	return ret;
};

Array.prototype.pushRange = function (array) {
	for(var i = 0; i < array.length; i++)
		this.push(array[i]);
};

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