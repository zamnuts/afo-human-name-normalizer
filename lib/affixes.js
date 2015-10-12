var Affixes, // static
	l = require('lodash');

/**
 * @namespace Affixes
 */
module.exports = Affixes = {};

/**
 * @typedef {object} AffixesMap
 * @property {string} formal
 * @property {string} abbrv
 */

/**
 * Reloads the entire affixes cache.
 */
Affixes.recache = function recache() {
	this._cache = {
		prefix: {},
		suffix: {},
		preposition: {},
		surnamePrefix: {},
		conjunction: {}
	};
	Object.keys(this._cache).forEach(function(type) {
		this[type].forEach(function(o) { // populate
			if ( !o ) {
				return;
			}
			var longKey = '',
				shortKey = '';
			if ( typeof o === 'string' ) {
				longKey = this._transformKey(o);
			}
			if ( typeof o.formal === 'string' ) {
				longKey = this._transformKey(o.formal);
			}
			if ( typeof o.abbrv === 'string' ) {
				shortKey = this._transformKey(o.abbrv);
			}
			if ( longKey ) {
				this._cache[type][longKey] = this._cache[type][longKey] || [];
				this._cache[type][longKey].push(o);
			}
			if ( shortKey ) {
				this._cache[type][shortKey] = this._cache[type][shortKey] || [];
				this._cache[type][shortKey].push(o);
			}
		}.bind(this));
	}.bind(this));
};

var notAlphaNumeric = /[^a-z0-9 ]/ig;

/**
 * @param {string} key
 * @returns {string}
 * @private
 */
Affixes._transformKey = function _transformKey(key) {
	return String(key).replace(notAlphaNumeric,'').toLowerCase();
};

/**
 * @param {string} str
 * @returns {string|null}
 */
Affixes.lookupPrefix = function lookupPrefix(str) {
	return this._lookup(str,'prefix');
};

/**
 * @param {string} str
 * @returns {string|null}
 */
Affixes.lookupSuffix = function lookupSuffix(str) {
	return this._lookup(str,'suffix');
};

/**
 * @param {string} str
 * @returns {string|null}
 */
Affixes.lookupPreposition = function lookupPreposition(str) {
	return this._lookup(str,'preposition');
};

/**
 * @param {string} str
 * @returns {string|null}
 */
Affixes.lookupConjunction = function lookupConjunction(str) {
	return this._lookup(str,'conjunction');
};

/**
 * @param {string} str
 * @returns {string|null}
 */
Affixes.lookupSurnamePrefix = function lookupSurnamePrefix(str) {
	return this._lookup(str,'surnamePrefix');
};

/**
 *
 * @param {string} str
 * @param {string} type
 * @returns {string|null}
 * @private
 */
Affixes._lookup = function _lookup(str,type) {
	str = this._transformKey(str);
	var ret = null;
	if ( type && this._cache[type] ) {
		var match = this._cache[type][str];
		if ( l.isArray(match) ) {
			ret = match.slice(0,1).pop(); // XXX should this really only provide the first item?
		} else if ( match ) {
			ret = match;
		}
	}
	return ret;
};

/**
 * @param {AffixesMap} obj
 * @param {boolean} [recache=false]
 */
Affixes.addPrefix = function addPrefix(obj,recache) {
	this._add(obj,'prefix',recache);
};

/**
 * @param {AffixesMap} obj
 * @param {boolean} [recache=false]
 */
Affixes.addSuffix = function addSuffix(obj,recache) {
	this._add(obj,'suffix',recache);
};

/**
 * @param {string} str
 * @param {boolean} [recache=false]
 */
Affixes.addPreposition = function addPreposition(str,recache) {
	this._add(str,'preposition',recache);
};

/**
 * @param {string} str
 * @param {boolean} [recache=false]
 */
Affixes.addConjunction = function addConjunction(str,recache) {
	this._add(str,'conjunction',recache);
};

/**
 * @param {string} str
 * @param {boolean} [recache=false]
 */
Affixes.addSurnamePrefix = function addSurnamePrefix(str,recache) {
	this._add(str,'surnamePrefix',recache);
};

/**
 * @param {AffixesMap|string} item
 * @param {string} type
 * @param {boolean} [recache=false]
 * @returns {boolean}
 * @private
 */
Affixes._add = function _add(item,type,recache) {
	var ret = false;
	if ( type && l.isArray(this[type]) ) {
		ret = this[type].push(item);
	}
	if ( recache ) {
		this.recache();
	}
	return ret;
};

/**
 * @type {AffixesMap[]}
 */
Affixes.prefix = [
	{formal:'Abbot',abbrv:''},
	{formal:'Admiral',abbrv:'Adm.'},
	{formal:'Ambassador',abbrv:'Amb.'},
	{formal:'Attorney',abbrv:'Atty'},
	{formal:'Baron',abbrv:''},
	{formal:'Baroness',abbrv:'Brnss.'},
	{formal:'Bishop',abbrv:''},
	{formal:'Brigadier General',abbrv:'Brig. Gen.'},
	{formal:'Brigadier General',abbrv:'BG'},
	{formal:'Brother',abbrv:'Br.'},
	{formal:'Captain',abbrv:'Cpt.'},
	{formal:'Chancellor',abbrv:'Chan.'},
	{formal:'Chaplain',abbrv:'Chapln.'},
	{formal:'Chief',abbrv:''},
	{formal:'Chief Petty Officer',abbrv:'CPO'},
	{formal:'Commander',abbrv:'Cmdr.'},
	{formal:'Commander',abbrv:'CBE'},
	{formal:'Colonel',abbrv:'Col.'},
	{formal:'Colonel (Retired)',abbrv:'Col. (Ret.)'},
	{formal:'Corporal',abbrv:'Cpl.'},
	{formal:'Count',abbrv:''},
	{formal:'Countess',abbrv:'Cntss.'},
	{formal:'Dame Commander',abbrv:'D.B.E.'},
	{formal:'Dame Grand Cross',abbrv:'G.B.E.'},
	{formal:'Dean',abbrv:''},
	{formal:'Doctor',abbrv:'Dr.'},
	{formal:'Duke',abbrv:''},
	{formal:'Elder',abbrv:''},
	{formal:'Ensign',abbrv:'Ens.'},
	{formal:'Estate of',abbrv:''},
	{formal:'Father',abbrv:'Fr.'},
	{formal:'Friar',abbrv:'Fr.'},
	{formal:'Frau',abbrv:''},
	{formal:'General',abbrv:'Gen.'},
	{formal:'Governor',abbrv:'Gov.'},
	{formal:'Honorable',abbrv:'Hon.'},
	{formal:'Judge',abbrv:''},
	{formal:'Justice',abbrv:''},
	{formal:'Knight Grand Cross',abbrv:'G.B.E.'},
	{formal:'Knight Commander',abbrv:'K.B.E.'},
	{formal:'Lord',abbrv:''},
	{formal:'Lieutenant',abbrv:'Lt.'},
	{formal:'2nd Lieutenant',abbrv:'2Lt.'},
	{formal:'Lieutenant Commander',abbrv:'Lt. Cmdr.'},
	{formal:'Lieutenant Colonel',abbrv:'Lt. Col.'},
	{formal:'Lieutenant General',abbrv:'Lt. Gen.'},
	{formal:'Lieutenant junior grade',abbrv:'Lt. j.g.'},
	{formal:'Mademoiselle',abbrv:'Mlle.'},
	{formal:'Major',abbrv:'Maj.'},
	{formal:'Master',abbrv:''},
	{formal:'Master Sergeant',abbrv:'Master Sgt.'},
	{formal:'Member',abbrv:'M.B.E.'},
	{formal:'Miss',abbrv:'Ms.'},
	{formal:'Missus',abbrv:'Mrs.'},
	{formal:'Mister',abbrv:'Mr.'},
	{formal:'Madame',abbrv:'Mme.'},
	{formal:'Monsieur',abbrv:'M.'},
	{formal:'Monsignor',abbrv:'Msgr.'},
	{formal:'Officer',abbrv:'O.B.E.'},
	{formal:'President',abbrv:'Pres.'},
	{formal:'Prince',abbrv:''},
	{formal:'Princess',abbrv:''},
	{formal:'Professor',abbrv:'Prof.'},
	{formal:'Rabbi',abbrv:''},
	{formal:'Rear Admiral',abbrv:'R.Adm.'},
	{formal:'Representative',abbrv:'Rep.'},
	{formal:'Reverend',abbrv:'Rev.'},
	{formal:'Reverends',abbrv:'Revs.'},
	{formal:'Right Reverend',abbrv:'Rt.Rev.'},
	{formal:'Sergeant',abbrv:'Sgt.'},
	{formal:'Senator',abbrv:'Sen.'},
	{formal:'Senor',abbrv:'Sr.'},
	{formal:'Senora',abbrv:'Sra.'},
	{formal:'Senorita',abbrv:'Srta.'},
	{formal:'Sheikh',abbrv:''},
	{formal:'Sir',abbrv:''},
	{formal:'Sister',abbrv:'Sr.'},
	{formal:'Staff Sergeant',abbrv:'S. Sgt.'},
	{formal:'The Honorable',abbrv:'The Hon.'},
	{formal:'The Venerable',abbrv:''},
	{formal:'Trust(ees)of',abbrv:''},
	{formal:'Vice Admiral',abbrv:'V.Adm.'}
];

/**
 * @type {AffixesMap[]}
 */
Affixes.suffix = [
	{formal:'Junior',abbrv:'Jr.'},
	{formal:'Senior',abbrv:'Sr.'},
	{formal:'First',abbrv:'1st'},
	{formal:'Second',abbrv:'2nd'},
	{formal:'Third',abbrv:'3rd'},
	{formal:'Fourth',abbrv:'4th'},
	{formal:'The Second',abbrv:'II'},
	{formal:'The Third',abbrv:'III'},
	{formal:'The Fourth',abbrv:'IV'},
	{formal:'The Fifth',abbrv:'V'},
	{formal:'The Sixth',abbrv:'VI'},
	{formal:'The Seventh',abbrv:'VII'},
	{formal:'The Eigth',abbrv:'VIII'},
	{formal:'The Ninth',abbrv:'IX'},
	{formal:'The Tenth',abbrv:'X'},
	{formal:'Certified Public Accountant',abbrv:'C.P.A.'},
	{formal:'Doctor of Chiropractic',abbrv:'D.C.'},
	{formal:'Doctor of Dental Medicine',abbrv:'D.M.D.'},
	{formal:'Doctor of Dental Surgery',abbrv:'D.D.S.'},
	{formal:'Doctor of Devinity',abbrv:'D.D.'},
	{formal:'Doctor of Education',abbrv:'Ed.D.'},
	{formal:'Doctor of Laws',abbrv:'LL.D.'},
	{formal:'Doctor of Medicine',abbrv:'M.D.'},
	{formal:'Doctor of Optometry',abbrv:'O.D.'},
	{formal:'Doctor of Osteopathy',abbrv:'D.O.'},
	{formal:'Doctor of Philosophy',abbrv:'Ph.D.'},
	{formal:'Doctor of Veterinary Medicine',abbrv:'D.V.M.'},
	{formal:'Esquire',abbrv:'Esq.'},
	{formal:'Juris Doctor',abbrv:'J.D.'},
	{formal:'Registered Nurse',abbrv:'R.N.'},
	{formal:'Registered Nurse Clinician',abbrv:'R.N.C.'},
	{formal:'Retired',abbrv:'Ret.'},
	{formal:'United States Air Force',abbrv:'USAF'},
	{formal:'United States Air Force Reserve',abbrv:'USAFR'},
	{formal:'United States Army',abbrv:'USA'},
	{formal:'United States Army Reserve',abbrv:'USAR'},
	{formal:'United States Coast Guard',abbrv:'USCG'},
	{formal:'United States Marine Corps',abbrv:'USMC'},
	{formal:'United States Marine Corps Reserve',abbrv:'USMCR'},
	{formal:'United States Navy',abbrv:'USN'},
	{formal:'United States Navy Reserve',abbrv:'USNR'}
];

/**
 * @type {string[]}
 */
Affixes.preposition = [
	'ab',
	'ap',
	'bar',
	'bat',
	'ben',
	'bet',
	'bin',
	'bint',
	'da',
	'dal',
	'de',
	'del',
	'der',
	'di',
	'dos',
	'du',
	'el',
	'fitz',
	'gil',
	'ibn',
	'in',
	'kil',
	'la',
	'le',
	'ost',
	'nic',
	'san',
	'st',
	'ste',
	'stor',
	'ter',
	'tre',
	'van',
	'vel',
	'vest',
	'von'
];

/**
 * @type {string[]}
 */
Affixes.conjunction = [
	'y',
	'e'
];

/**
 * @type {string[]}
 */

Affixes.surnamePrefix = [
	'Mc',
	'Mac'
];

Affixes.recache(); // initial cache
