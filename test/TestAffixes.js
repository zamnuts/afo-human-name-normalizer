var expect = require('chai').expect,
	l = require('lodash');

describe('Affixes',function() {
	var Affixes = require('../index.js').Affixes;

	it('should have a default prefix collection',function() {
		expect(Affixes.prefix).to.be.an.instanceOf(Array);
		expect(Affixes.prefix).to.have.length.above(0);
	});
	it('should have a default suffix collection',function() {
		expect(Affixes.suffix).to.be.an.instanceOf(Array);
		expect(Affixes.suffix).to.have.length.above(0);
	});
	it('should have a default conjunction collection',function() {
		expect(Affixes.conjunction).to.be.an.instanceOf(Array);
		expect(Affixes.conjunction).to.have.length.above(0);
	});
	it('should have a default preposition collection',function() {
		expect(Affixes.preposition).to.be.an.instanceOf(Array);
		expect(Affixes.preposition).to.have.length.above(0);
	});
	it('should have a default surname prefix collection',function() {
		expect(Affixes.surnamePrefix).to.be.an.instanceOf(Array);
		expect(Affixes.surnamePrefix).to.have.length.above(0);
	});

	describe('#_transformKey()',function() {
		it('should transform uppercase and remove punctuation',function() {
			expect(Affixes._transformKey('Hello World!')).to.equal('hello world');
		});
		it('should ignore spaces and lowercase ascii',function() {
			expect(Affixes._transformKey('hello world')).to.equal('hello world');
		});
		it('should remove non-ascii characters',function() {
			expect(Affixes._transformKey('größenmaßstäbe')).to.equal('grenmastbe');
		});
		it('should transform null to a string with a literal null',function() {
			expect(Affixes._transformKey(null)).to.equal('null');
		});
		it('should maintain an empty string',function() {
			expect(Affixes._transformKey('')).to.equal('');
		});
		it('should transform the integer 0 to a literal string 0',function() {
			expect(Affixes._transformKey(0)).to.equal('0');
		});
		it('should transform an integer to the literal base-10 string',function() {
			expect(Affixes._transformKey(0777)).to.equal('511');
		});
	});

	describe('#lookupPrefix()',function() {
		var doctorDoc = {formal:'Doctor',abbrv:'Dr.'},
			fatherDoc = {formal:'Father',abbrv:'Fr.'};
		it('should find the prefix for "Doctor"',function() {
			expect(Affixes.lookupPrefix('Doctor')).to.deep.equal(doctorDoc);
		});
		it('should find the prefix for "Dr."',function() {
			expect(Affixes.lookupPrefix('Dr.')).to.deep.equal(doctorDoc);
		});
		it('should find the prefix for "Dr"',function() {
			expect(Affixes.lookupPrefix('Dr')).to.deep.equal(doctorDoc);
		});
		it('should return null for an empty prefix string',function() {
			expect(Affixes.lookupPrefix('')).to.equal(null);
		});
		it('should return null for a missing prefix',function() {
			expect(Affixes.lookupPrefix('Bogus9999')).to.equal(null);
		});
		it('should find the prefix for "Fr" (Father)',function() {
			expect(Affixes.lookupPrefix('Fr')).to.deep.equal(fatherDoc);
		});
	});

	describe('#lookupSuffix()',function() {
		var theFourthDoc = {formal:'The Fourth',abbrv:'IV'},
			phdDoc = {formal:'Doctor of Philosophy',abbrv:'Ph.D.'};
		it('should find the suffix for "The Fourth"',function() {
			expect(Affixes.lookupSuffix('The Fourth')).to.deep.equal(theFourthDoc);
		});
		it('should find the suffix for "IV"',function() {
			expect(Affixes.lookupSuffix('IV')).to.deep.equal(theFourthDoc);
		});
		it('should find the suffix for "PhD"',function() {
			expect(Affixes.lookupSuffix('PhD')).to.deep.equal(phdDoc);
		});
		it('should find the suffix for "Ph.D."',function() {
			expect(Affixes.lookupSuffix('Ph.D.')).to.deep.equal(phdDoc);
		});
		it('should find the suffix for "Doctor of Philosophy"',function() {
			expect(Affixes.lookupSuffix('Doctor of Philosophy')).to.deep.equal(phdDoc);
		});
		it('should return null for an empty suffix string',function() {
			expect(Affixes.lookupSuffix('')).to.equal(null);
		});
		it('should return null for a missing suffix',function() {
			expect(Affixes.lookupSuffix('Bogus9999')).to.equal(null);
		});
	});

	describe('#lookupPreposition()',function() {
		it('should find the preposition "von"',function() {
			expect(Affixes.lookupPreposition('von')).to.equal('von');
		});
		it('should find the preposition (case insensitive) "Von"',function() {
			expect(Affixes.lookupPreposition('Von')).to.equal('von');
		});
		it('should find the preposition "bin"',function() {
			expect(Affixes.lookupPreposition('bin')).to.equal('bin');
		});
		it('should find the preposition (case insensitive) "Bin"',function() {
			expect(Affixes.lookupPreposition('Bin')).to.equal('bin');
		});
		it('should return null for an empty preposition string',function() {
			expect(Affixes.lookupPreposition('')).to.equal(null);
		});
		it('should return null for a missing preposition',function() {
			expect(Affixes.lookupPreposition('Bogus9999')).to.equal(null);
		});
	});

	describe('#lookupConjunction()',function() {
		it('should find the conjunction "y"',function() {
			expect(Affixes.lookupConjunction('y')).to.equal('y');
		});
		it('should find the conjunction (case insensitive) "Y"',function() {
			expect(Affixes.lookupConjunction('Y')).to.equal('y');
		});
		it('should return null for an empty conjunction string',function() {
			expect(Affixes.lookupConjunction('')).to.equal(null);
		});
		it('should return null for a missing conjunction',function() {
			expect(Affixes.lookupConjunction('Bogus9999')).to.equal(null);
		});
	});

	describe('#lookupSurnamePrefix()',function() {
		it('should find the surname prefix "Mc"',function() {
			expect(Affixes.lookupSurnamePrefix('Mc')).to.equal('Mc');
		});
		it('should find the surname prefix (case insensitive) "mc"',function() {
			expect(Affixes.lookupSurnamePrefix('mc')).to.equal('Mc');
		});
		it('should find the surname prefix "Mac"',function() {
			expect(Affixes.lookupSurnamePrefix('Mac')).to.equal('Mac');
		});
		it('should find the surname prefix (case insensitive) "mac"',function() {
			expect(Affixes.lookupSurnamePrefix('mac')).to.equal('Mac');
		});
		it('should return null for an empty surname prefix string',function() {
			expect(Affixes.lookupSurnamePrefix('')).to.equal(null);
		});
		it('should return null for a missing surname prefix',function() {
			expect(Affixes.lookupSurnamePrefix('Bogus9999')).to.equal(null);
		});
	});

	describe('#recache()',function() {
		var newDoc = {formal:'Newitem',abbrv:'New.'},
			prefix = l.cloneDeep(Affixes.prefix),
			suffix = l.cloneDeep(Affixes.suffix),
			preposition = l.cloneDeep(Affixes.preposition),
			conjunction = l.cloneDeep(Affixes.conjunction),
			surnamePrefix = l.cloneDeep(Affixes.surnamePrefix);
		afterEach(function() {
			Affixes.prefix = l.cloneDeep(prefix);
			Affixes.suffix = l.cloneDeep(suffix);
			Affixes.preposition = l.cloneDeep(preposition);
			Affixes.conjunction = l.cloneDeep(conjunction);
			Affixes.surnamePrefix = l.cloneDeep(surnamePrefix);
			Affixes.recache();
		});
		it('should add prefix "Newitem", recache and find it',function() {
			Affixes.addPrefix(newDoc,true);
			expect(Affixes.lookupPrefix('newitem')).to.deep.equal(newDoc);
		});
		it('should add prefix abbreviation "New.", recache and find it',function() {
			Affixes.addPrefix(newDoc,true);
			expect(Affixes.lookupPrefix('new')).to.deep.equal(newDoc);
		});
		it('should add suffix "Newitem", recache and find it',function() {
			Affixes.addSuffix(newDoc,true);
			expect(Affixes.lookupSuffix('newitem')).to.deep.equal(newDoc);
		});
		it('should add suffix abbreviation "New.", recache and find it',function() {
			Affixes.addSuffix(newDoc,true);
			expect(Affixes.lookupSuffix('new')).to.deep.equal(newDoc);
		});
		it('should add preposition "New", recache and find it (case sensitive)',function() {
			Affixes.addPreposition('New',true);
			expect(Affixes.lookupPreposition('New')).to.equal('New');
		});
		it('should add preposition "New", recache and find it (case in-sensitive)',function() {
			Affixes.addPreposition('New',true);
			expect(Affixes.lookupPreposition('new')).to.equal('New');
		});
		it('should add conjunction "New", recache and find it (case sensitive)',function() {
			Affixes.addConjunction('New',true);
			expect(Affixes.lookupConjunction('New')).to.equal('New');
		});
		it('should add conjunction "New", recache and find it (case in-sensitive)',function() {
			Affixes.addConjunction('New',true);
			expect(Affixes.lookupConjunction('new')).to.equal('New');
		});
		it('should add surname prefix "New", recache and find it (case sensitive)',function() {
			Affixes.addSurnamePrefix('New',true);
			expect(Affixes.lookupSurnamePrefix('New')).to.equal('New');
		});
		it('should add surname prefix "New", recache and find it (case in-sensitive)',function() {
			Affixes.addSurnamePrefix('New',true);
			expect(Affixes.lookupSurnamePrefix('new')).to.equal('New');
		});
	});
});
