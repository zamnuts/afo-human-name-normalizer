var expect = require('chai').expect,
	l = require('lodash');

describe('HumanNameNormalizer',function() {
	var HumanNameNormalizer = require('../index.js');

	describe('constructor',function() {
		it('should be a HumanNameNormalizer',function() {
			expect(new HumanNameNormalizer('')).to.be.an.instanceOf(HumanNameNormalizer);
		});
	});

	describe('#isFormalCase()',function() {
		[
			{test:'Formal',expect:true},
			{test:'UPPER',expect:false},
			{test:'lower',expect:false},
			{test:'mIxEdStartLower',expect:true},
			{test:'MiXeDStartUpper',expect:true},
			{test:'D1GITUPPER',expect:false},
			{test:'d1gitlower',expect:false},
			{test:'D1gitMixed',expect:true,skip:true},
			{test:'81gittwice',expect:false},
			{test:'8Igitafter',expect:false},
			{test:'8gItMiXeD',expect:true,skip:true},
			{test:'hello world',expect:false},
			{test:'Hello World',expect:true},
			{test:'HELLO WORLD',expect:false},
			{test:'super d00d',expect:false},
			{test:'super D00d',expect:true,skip:true},
			{test:'Super d00d',expect:true},
			{test:'sup3R dudE',expect:true},
			{test:'Fógarta',expect:true},
			{test:'danaë',expect:false},
			{test:'åsa',expect:false},
			{test:'Åsa',expect:true},
			{test:'Ольга Крайнова',expect:true},
			{test:'ольга крайнова',expect:false},
			{test:'ОЛЬГА КРАЙНОВА',expect:false}
		].forEach(function(item) {
				(item.skip?it.skip:it)('should determine '+item.test+' '+(item.expect?'is':'is not')+' formal case',function() {
					expect(HumanNameNormalizer.isFormalCase(item.test)).to.equal(item.expect);
				});
			});
		it('should determine an empty name to not be formal case',function() {
			expect(HumanNameNormalizer.isFormalCase('')).to.equal(false);
		});
		it('should determine null to not be formal case',function() {
			expect(HumanNameNormalizer.isFormalCase(null)).to.equal(false);
		});
	});

	describe('#toFormalCase()',function() {
		[
			{test:'walter',expect:'Walter'},
			{test:'mcmanning',expect:'McManning'},
			{test:'o\'brian',expect:'O\'Brian'},
			{test:'judy smith',expect:'Judy Smith'},
			{test:'ROGER',expect:'Roger'},
			{test:'rOGER',expect:'Roger',force:true},
			{test:'rOGER',expect:'rOGER',force:false},
			{test:'macman',expect:'MacMan'},
			{test:'lucy-lue',expect:'Lucy-Lue'},
			{test:'r.e.a.c de boeremeakers',expect:'R.E.A.C De Boeremeakers'},
			{test:'mcmcalmc',expect:'McMcalmc'},
			{test:'fógarta',expect:'Fógarta'},
			{test:'danaë',expect:'Danaë'},
			{test:'åsa',expect:'Åsa'},
			{test:'Ольга Крайнова',expect:'Ольга Крайнова'},
			{test:'ольга крайнова',expect:'Ольга Крайнова'},
			{test:'ОЛЬГА КРАЙНОВА',expect:'Ольга Крайнова'}
		].forEach(function(item) {
				(item.skip?it.skip:it)('should change "'+item.test+'" to "'+item.expect+'"'+(item.force?' (forced)':''),function() {
					expect(HumanNameNormalizer.toFormalCase(item.test,item.force)).to.equal(item.expect);
				});
			});
		it('should not formalize an empty name',function() {
			expect(HumanNameNormalizer.toFormalCase('')).to.equal('');
		});
		it('should not formalize null',function() {
			expect(HumanNameNormalizer.toFormalCase(null)).to.equal('');
		});
	});

	describe('.parse(HumanNameNormalizer.MODE_PARSESTRING)',function() {
		[
			{msg:'f name',str:'John',first:'John'},
			{msg:'f and l name',str:'John Smith',first:'John',last:'Smith'},
			{msg:'fml name',str:'John Regal Smith',first:'John',middle:'Regal',last:'Smith'},
			{msg:'f and l w/ prefix',str:'Dr. John Smith',prefix:'Dr.',first:'John',last:'Smith'},
			{msg:'fml w/ prefix',str:'Dr. John Regal Smith',prefix:'Dr.',first:'John',middle:'Regal',last:'Smith'},
			{msg:'fml w/ prefix and suffix',str:'Dr. John Regal Smith II',prefix:'Dr.',first:'John',middle:'Regal',last:'Smith',suffix:'II'},
			{msg:'fl w/ double prefixes and suffix',str:'Lord Bishop John Smith II',prefix:'Lord',first:'Bishop',middle:'John',last:'Smith',suffix:'II'},
			{msg:'fml w/ double prefix and suffix',str:'Lord Bishop John Regal Smith II',prefix:'Lord',first:'Bishop',middle:'John Regal',last:'Smith',suffix:'II'},
			{msg:'f name could be prefix',str:'Dean',first:'Dean'},
			{msg:'preposition in l w/ prefix',str:'Dean von Bader',prefix:'Dean',last:'von Bader'},
			{msg:'preposition in l w/ prefix/suffix',str:'Dean von Bader II',prefix:'Dean',last:'von Bader',suffix:'II'},
			{msg:'preposition in l w/ double prefix',str:'Dean Dean von Bader',prefix:'Dean',first:'Dean',last:'von Bader'},
			{msg:'preposition in l w/ double prefix and suffix',str:'Dean Dean von Bader II',prefix:'Dean',first:'Dean',last:'von Bader',suffix:'II'},
			{msg:'preposition in l w/ f and prefix/suffix',str:'Mr. Dean von Bader II',prefix:'Mr.',first:'Dean',last:'von Bader',suffix:'II'},
			{msg:'setup for following tests',str:'Dr. Sean von Bader II',prefix:'Dr.',first:'Sean',last:'von Bader',suffix:'II'},
			{msg:'comma f after l w/ prefix',str:'Dr. von Bader, Sean',prefix:'Dr.',first:'Sean',last:'von Bader'},
			{msg:'comma f after l w/ prefix/suffix',str:'Dr. von Bader, Sean II',prefix:'Dr.',first:'Sean',last:'von Bader',suffix:'II'},
			{msg:'comma f after l w/ prefix and comma suffix',str:'Dr. von Bader, Sean, II',prefix:'Dr.',first:'Sean',last:'von Bader',suffix:'II'},
			{msg:'fl w/ prefix and comma suffix',str:'Dr. Sean von Bader, II',prefix:'Dr.',first:'Sean',last:'von Bader',suffix:'II'},
			{msg:'f and l w/ conjunction',str:'Betsy Sejo y Rosa',first:'Betsy',last:'Sejo y Rosa'},
			{msg:'f, m, and l w/ conjunction',str:'Betsy Susan Sejo y Rosa',first:'Betsy',middle:'Susan',last:'Sejo y Rosa'},
			{msg:'f and l w/ conjunction w/ prefix',str:'Dr. Betsy Sejo y Rosa',prefix:'Dr.',first:'Betsy',last:'Sejo y Rosa'},
			{msg:'f and l w/ conjunction w/ prefix/suffix',str:'Dr. Betsy Sejo y Rosa II',prefix:'Dr.',first:'Betsy',last:'Sejo y Rosa',suffix:'II'},
			{msg:'comma f, l w/ conjunction w/ prefix and comma suffix',str:'Dr. Sejo y Rosa, Betsy, II',prefix:'Dr.',first:'Betsy',last:'Sejo y Rosa',suffix:'II'},
			{msg:'comma f, m, l w/ conjunction w/ prefix/suffix',str:'Dr. Betsy Sejo y Rosa, Susan II',prefix:'Dr.',first:'Betsy',middle:'Susan',last:'Sejo y Rosa',suffix:'II'},
			{msg:'fl coupled initials',str:'B.J. Smith',first:'B.J.',last:'Smith'},
			{msg:'fml separate initials',str:'B. J. Smith',first:'B.',middle:'J.',last:'Smith'},
			{msg:'fml separate initials w/ possible conjunction',str:'B. Y. Smith',first:'B.',middle:'Y.',last:'Smith'},
			{msg:'fml coupled no dot initials',str:'BJ Smith',first:'BJ',last:'Smith',skip:true}, // 'BJ' is turned into 'Bj', case is not maintained
			{msg:'fml separate no dot initials',str:'B J Smith',first:'B',middle:'J',last:'Smith'},
			{msg:'fml separate no dot initials w/ possible conjunction',str:'B Y Smith',first:'B',middle:'Y',last:'Smith'},
			{msg:'fml separate no dot initials w/ conjunction (1)',str:'B Y Ross Smith',first:'B',middle:'Y Ross',last:'Smith'},
			{msg:'fml separate no dot initials w/ conjunction (2)',str:'B J Ross Y Smith',first:'B',middle:'J',last:'Ross y Smith'},
			{msg:'hyphenated last name w/ long prefix',str:'Doctor Gary Ross-Smith',prefix:'Dr.',first:'Gary',last:'Ross-Smith'}
		].forEach(function(item) {
				var obj = l.clone(item);
				delete obj.str;
				delete obj.skip;
				delete obj.msg;
				HumanNameNormalizer.HumanNameModel.getPropertiesList().forEach(function(key) {
					if ( !obj[key] ) {
						obj[key] = '';
					}
				});
				(item.skip?it.skip:it)('should parse '+item.str+(item.msg?' ('+item.msg+')':''),function() {
					var n = new HumanNameNormalizer(item.str);
					n.parse(HumanNameNormalizer.MODE_PARSESTRING);
					expect(n.model.toObject()).to.deep.equal(obj);
				});
			});
		it('should not parse an empty name',function() {
			var n = new HumanNameNormalizer('');
			expect(n.model).to.not.be.ok();
		});
		it('should not parse null',function() {
			var n = new HumanNameNormalizer(null);
			expect(n.model).to.not.be.ok();
		});
	});

	describe('.parse(HumanNameNormalizer.MODE_REPARSEMODEL)',function() {
		it('should reparse the model',function() {
			var m = new HumanNameNormalizer.HumanNameModel({
				prefix:'Dr.',
				first:'John',
				middle:'M',
				last:'Smith',
				suffix:'IV'
			});
			var n = new HumanNameNormalizer(m);
			var obj = n.model.toObject();
			n.parse(HumanNameNormalizer.MODE_REPARSEMODEL);
			expect(n.model.toObject()).to.deep.equal(obj);
		});
	});

	describe('.normalizeModel()',function() {
		it('should normalize the model',function() {
			var denormalized = {
				prefix:'dr.',
				first:'john',
				middle:'m',
				last:'SMITH',
				suffix:'Iv'
			};
			var normalized = {
				prefix:'Dr.',
				first:'John',
				middle:'M',
				last:'Smith',
				suffix:'IV'
			};
			var n = new HumanNameNormalizer(denormalized);
			n.normalizeModel();
			expect(n.model.toObject()).to.deep.equal(normalized);
		});
	});

	describe('.updateFullname()',function() {
		it('should update the full name when one is already established',function() {
			var n = new HumanNameNormalizer('John Smith');
			n.parse();
			expect(n.model.toString()).to.deep.equal('John Smith');
			expect(n.updateFullname('Sally Johnson')).to.be.ok();
			n.parse();
			expect(n.model.toString()).to.equal('Sally Johnson');
		});
		it('should not update the full name when null is given',function() {
			var n = new HumanNameNormalizer('John Smith');
			n.parse();
			expect(n.model.toString()).to.deep.equal('John Smith');
			expect(n.updateFullname(null)).to.not.be.ok();
			n.parse();
			expect(n.model.toString()).to.equal('John Smith');
		});
		it('should update the full name to empty when empty is given',function() {
			var n = new HumanNameNormalizer('John Smith');
			n.parse();
			expect(n.model.toString()).to.equal('John Smith');
			expect(n.updateFullname('')).to.be.ok();
			n.parse();
			expect(n.model.toString()).to.equal('');
		});
	});

	describe('.fullname',function() {
		it('should provide the normalized full name when there is a model',function() {
			var n = new HumanNameNormalizer('JOHN SMITH iv');
			n.parse();
			expect(n.fullname).to.equal('John Smith IV');
		});
		it('should provide the given full name when there is no model',function() {
			var n = new HumanNameNormalizer('JOHN SMITH iv');
			expect(n.fullname).to.equal('JOHN SMITH iv');
		});
		it('should provide empty when empty is given',function() {
			var n = new HumanNameNormalizer('');
			expect(n.fullname).to.equal('');
		});
		it('should provide empty when null is given',function() {
			var n = new HumanNameNormalizer(null);
			expect(n.fullname).to.equal('');
		});
	});

	describe('.name',function() {
		it('should provide an object with only the full name',function() {
			var n = new HumanNameNormalizer('John Smith');
			expect(n.name).to.deep.equal({fullname:'John Smith'});
		});
		it('should provide an empty object with an empty full name',function() {
			var n = new HumanNameNormalizer('');
			expect(n.name).to.deep.equal({});
		});
		it('should provide an object with all name parts including full name',function() {
			var n = new HumanNameNormalizer('Dr. John Jacob Smith II');
			n.parse();
			expect(n.name).to.deep.equal({fullname:'Dr. John Jacob Smith II',prefix:'Dr.',first:'John',middle:'Jacob',last:'Smith',suffix:'II'});
		});
		it('should provide empty when null is given',function() {
			var n = new HumanNameNormalizer(null);
			expect(n.name).to.deep.equal({});
		});
	});

	describe('.model',function() {
		it('should provide a model given an empty name',function() {
			var n = new HumanNameNormalizer('');
			n.parse();
			expect(n.model).to.be.an.instanceOf(HumanNameNormalizer.HumanNameModel);
		});
		it('should provide a model given a null name',function() {
			var n = new HumanNameNormalizer(null);
			n.parse();
			expect(n.model).to.be.an.instanceOf(HumanNameNormalizer.HumanNameModel);
		});
		it('should provide a model given a valid name',function() {
			var n = new HumanNameNormalizer('John Smith');
			n.parse();
			expect(n.model).to.be.an.instanceOf(HumanNameNormalizer.HumanNameModel);
		});
		it('should not provide a model without parsing',function() {
			var n = new HumanNameNormalizer('John Smith');
			expect(n.model).to.equal(null);
		});
	});

	describe('.parseLog',function() {
		it('should have an empty parse log',function() {
			var n = new HumanNameNormalizer('');
			expect(n.parseLog).to.be.an.instanceOf(Array);
			expect(n.parseLog).to.have.length(0);
		});
		it('should have a filled parse log',function() {
			var n = new HumanNameNormalizer('John Smith');
			n.parse();
			expect(n.parseLog).to.be.an.instanceOf(Array);
			expect(n.parseLog).to.have.length.above(1);
		});
	});

	describe('.originalFullname',function() {
		it('should be created with an empty (providing empty) originalFullName',function() {
			expect(new HumanNameNormalizer('').originalFullname).to.equal('');
		});
		it('should be created with an empty (providing null) originalFullName',function() {
			expect(new HumanNameNormalizer(null).originalFullname).to.equal('');
		});
		it('should be created with an originalFullName of "John Smith"',function() {
			expect(new HumanNameNormalizer('John Smith').originalFullname).to.equal('John Smith');
		});
	});
});
