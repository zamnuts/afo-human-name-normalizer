var expect = require('chai').expect;

describe('HumanNameModel',function() {
	var HumanNameModel = require('../index.js').HumanNameModel;

	var prefix	= 'Dr.',
		first	= 'John',
		middle	= 'Jacob',
		last	= 'Smith',
		suffix	= 'IV';

	it('should have a list of properties',function() {
		expect(HumanNameModel.getPropertiesList()).to.be.an.instanceOf(Array);
		expect(HumanNameModel.getPropertiesList()).to.have.length(5); // property list is fixed
	});

	describe('constructor',function() {
		it('should be a HumanNameModel (no args)',function() {
			expect(new HumanNameModel()).to.be.an.instanceOf(HumanNameModel);
		});
		var m = new HumanNameModel();
		it('should store prefix',function() {
			m.prefix = prefix;
			expect(m.prefix).to.equal(prefix);
		});
		it('should store first',function() {
			m.first = first;
			expect(m.first).to.equal(first);
		});
		it('should store middle',function() {
			m.middle = middle;
			expect(m.middle).to.equal(middle);
		});
		it('should store last',function() {
			m.last = last;
			expect(m.last).to.equal(last);
		});
		it('should store suffix',function() {
			m.suffix = suffix;
			expect(m.suffix).to.equal(suffix);
		});
		it('should be a HumanNameModel and apply defaults',function() {
			var m = new HumanNameModel({
				prefix: prefix,
				first: first,
				middle: middle,
				last: last,
				suffix: suffix
			});
			expect(m).to.be.an.instanceOf(HumanNameModel);
			expect(m.prefix).to.equal(prefix);
			expect(m.first).to.equal(first);
			expect(m.middle).to.equal(middle);
			expect(m.last).to.equal(last);
			expect(m.suffix).to.equal(suffix);
		});
	});

	describe('.restoreDefaults()',function() {
		it('should set all properties back to empty',function() {
			var m = new HumanNameModel({
				prefix: prefix,
				first: first,
				middle: middle,
				last: last,
				suffix: suffix
			});
			m.restoreDefaults();
			expect(m.prefix).to.be.empty();
			expect(m.first).to.be.empty();
			expect(m.middle).to.be.empty();
			expect(m.last).to.be.empty();
			expect(m.suffix).to.be.empty();
		});
	});

	describe('.isSet()',function() {
		var m = new HumanNameModel();
		it('should return false if no properties have a value',function() {
			expect(m.isSet()).to.not.be.ok();
		});
		it('should return true if at least one property has a value',function() {
			m.first = first;
			expect(m.isSet()).to.be.ok();
		});
		it('should return true if all properties have a value',function() {
			m.prefix	= prefix;
			m.middle	= middle;
			m.last		= last;
			m.suffix	= suffix;
			expect(m.isSet()).to.be.ok();
		});
	});

	describe('.clone()',function() {
		it('should make an accurate clone (copied instance)',function() {
			var m = new HumanNameModel({
				prefix: prefix,
				first: first,
				middle: middle,
				last: last,
				suffix: suffix
			});
			var mCloned = m.clone();
			expect(mCloned).to.be.an.instanceOf(HumanNameModel);
			expect(mCloned).to.not.equal(m);
			expect(mCloned.prefix).to.equal(m.prefix);
			expect(mCloned.first).to.equal(m.first);
			expect(mCloned.middle).to.equal(m.middle);
			expect(mCloned.last).to.equal(m.last);
			expect(mCloned.suffix).to.equal(m.suffix);
		});
	});

	describe('.merge()',function() {
		var m1,m2,
			prefix2	= 'Ms.',
			first2	= 'Sally',
			middle2	= 'Grace',
			last2	= 'Soch',
			suffix2	= 'R.N.';
		beforeEach(function() {
			m1 = new HumanNameModel({
				prefix: prefix,
				first: first,
				middle: middle,
				last: last,
				suffix: suffix
			});
			m2 = new HumanNameModel({
				prefix: prefix2,
				first: first2,
				middle: middle2,
				last: last2,
				suffix: suffix2
			});
		});
		it('should overwrite values when merging',function() {
			var result = m1.merge(m2);
			expect(result).to.be.ok();
			expect(m1.prefix).to.equal(prefix2);
			expect(m1.first).to.equal(first2);
			expect(m1.middle).to.equal(middle2);
			expect(m1.last).to.equal(last2);
			expect(m1.suffix).to.equal(suffix2);
		});
		it('should disregard missing values when merging',function() {
			m2.first	= '';
			m2.last		= '';
			var result = m1.merge(m2);
			expect(result).to.be.ok();
			expect(m1.prefix).to.equal(prefix2);
			expect(m1.first).to.equal(first); // here
			expect(m1.middle).to.equal(middle2);
			expect(m1.last).to.equal(last); // here
			expect(m1.suffix).to.equal(suffix2);
		});
		it('should not affect the referenced model when merging',function() {
			var result = m1.merge(m2);
			expect(result).to.be.ok();
			expect(m2.prefix).to.equal(prefix2);
			expect(m2.first).to.equal(first2);
			expect(m2.middle).to.equal(middle2);
			expect(m2.last).to.equal(last2);
			expect(m2.suffix).to.equal(suffix2);
		});
		it('should not merge if a proper reference model was not used',function() {
			var result = m1.merge({first:first2});
			expect(result).to.not.be.ok();
		});
		it('should not merge if null was used for the referencd model',function() {
			var result = m1.merge(null);
			expect(result).to.not.be.ok();
		});
	});

	describe('.toString()',function() {
		var m;
		beforeEach(function() {
			m = new HumanNameModel({
				prefix: prefix,
				first: first,
				middle: middle,
				last: last,
				suffix: suffix
			});
		});
		it('should consolidate all name parts as a single string',function() {
			expect(m.toString()).to.equal(prefix+' '+first+' '+middle+' '+last+' '+suffix);
		});
		it('should disregard extra spaces',function() {
			m.first += ' ';
			m.last = ' '+m.last+' ';
			expect(m.toString()).to.equal(prefix+' '+first+' '+middle+' '+last+' '+suffix);
		});
		it('should skip missing values',function() {
			m.middle = '';
			m.suffix = '';
			expect(m.toString()).to.equal(prefix+' '+first+' '+last);
		});
	});

	describe('.toObject()',function() {
		it('should make a plain object representation',function() {
			var m = new HumanNameModel({
				prefix: prefix,
				first: first,
				middle: middle,
				last: last,
				suffix: suffix
			});
			var mObject = m.toObject();
			expect(mObject).to.satisfy(function(o) {
				return Object.prototype.toString.call(o) === '[object Object]';
			});
			expect(mObject).to.not.equal(m);
			expect(mObject.prefix).to.equal(m.prefix);
			expect(mObject.first).to.equal(m.first);
			expect(mObject.middle).to.equal(m.middle);
			expect(mObject.last).to.equal(m.last);
			expect(mObject.suffix).to.equal(m.suffix);
		});
	});

	describe('.fromObject()',function() {
		it('should populate the model from an object',function() {
			var m = new HumanNameModel();
			var result = m.fromObject({first:first,last:last});
			expect(result).to.be.ok();
			expect(m.first).to.equal(first);
			expect(m.last).to.equal(last);
			expect(m.middle).to.not.be.ok();
		});
		it('should not update the model if null is passed',function() {
			var m = new HumanNameModel();
			var result = m.fromObject(null);
			expect(result).to.not.be.ok();
			expect(m.first).to.not.be.ok();
			expect(m.last).to.not.be.ok();
			expect(m.middle).to.not.be.ok();
		});
		it('should not update the model if no similar properties exist',function() {
			var m = new HumanNameModel();
			var result = m.fromObject({foo:'bar'});
			expect(result).to.not.be.ok();
			expect(m.first).to.not.be.ok();
			expect(m.foot).to.not.be.ok();
		});
	});

	describe('#fromObject()',function() {
		it('should create a new instance and populate from an object',function() {
			var m = HumanNameModel.fromObject({first:first,last:last});
			expect(m).to.be.an.instanceOf(HumanNameModel);
			expect(m.first).to.equal(first);
			expect(m.last).to.equal(last);
			expect(m.middle).to.not.be.ok();
		});
		it('should not create a new instance of null is passed',function() {
			var m = HumanNameModel.fromObject(null);
			expect(m).to.not.be.ok();
			expect(m.first).to.not.be.ok();
			expect(m.last).to.not.be.ok();
			expect(m.middle).to.not.be.ok();
		});
		it('should not create a new instance if no similar properties exist',function() {
			var m = HumanNameModel.fromObject({foo:'bar'});
			expect(m).to.not.be.ok();
			expect(m.first).to.not.be.ok();
			expect(m.foot).to.not.be.ok();
		});
	});
});
