var HumanNameNormalizer,
	Affixes			= require('./affixes.js'),
	HumanNameModel	= require('./model.js'),
	XRegExp			= require('xregexp').XRegExp;

/**
 * @class HumanNameNormalizer
 * @constructor
 * Attempts to parse and normalize
 * @param {string|{}} fullnameOrNameObject Optional, a string representation of the full name, a plain object
 *        representing a loose HumanNameModel, or an instance of HumanNameModel.
 */
module.exports = HumanNameNormalizer = function(fullnameOrNameObject) {
	this.updateFullname(fullnameOrNameObject);
};

/*
 * XXX since \b doesn't have unicode support and XRegExp doesn't have the u flag, we gotta hack this
 * if js supported negative lookahead/behind then http://stackoverflow.com/a/4214173/1481489 has the answer
 * this was inspired by http://stackoverflow.com/a/2881472/1481489
 */
var nonWordChars = '[^\\p{L}\\p{N}_]',
	wbBefore = '(?:^|'+nonWordChars+')',
	wbAfter = '(?='+nonWordChars+'|$)';

/**
 * Parses originalFullname without considering model.
 * @type {int}
 */
HumanNameNormalizer.MODE_PARSESTRING		= 1;

/**
 * Stringifies model and parses it like it would `originalFullname` only.
 * @type {int}
 */
HumanNameNormalizer.MODE_REPARSEMODEL		= 2;

/**
 * @type {RegExp}
 */
HumanNameNormalizer._firstCharacterRegex	= XRegExp(wbBefore+'\\p{L}','g');

/**
 * @type {RegExp}
 */
HumanNameNormalizer._surnamePrefixRegex		= XRegExp(wbBefore+'('+Affixes.surnamePrefix.map(XRegExp.escape).join('|')+')(\\p{L})','gi');

/**
 * @type {RegExp}
 */
HumanNameNormalizer._mixedCaseRegex			= XRegExp('^(.*?'+wbBefore+'\\p{Lu}+?(?=\\p{Ll}).*?'+wbAfter+'|.*?'+wbBefore+'\\p{Ll}+?(?=\\p{Lu}).*?'+wbAfter+')+$','s');

// cache _parseString regular expressions
var regexMoveCommas			= /,(["'])/g,
	regexSpaceCommas		= /,(?!\s)/g,
	regexRemoveCommas		= /,+/g,
	regexRemoveEndComma		= /,$/,
	regexRemovePeriods		= /\.+/g,
	regexRemoveSpaces		= /\s+/g,
	regexMatchValidParts	= XRegExp('\\p{L}|\\p{N}');

/**
 * @name HumanNameNormalizer#fullname
 * @type {string}
 * @readonly
 */

/**
 * @name HumanNameNormalizer#name
 * @type {{}}
 * @readonly
 */

/**
 * @name HumanNameNormalizer#model
 * @type {HumanNameModel}
 * @readonly
 */

/**
 * @name HumanNameNormalizer#parseLog
 * @type {string[]}
 * @readonly
 */

Object.defineProperties(HumanNameNormalizer.prototype,{
	fullname: {
		get: function() {
			if ( this._model ) {
				return this._model.toString();
			} else {
				return this.originalFullname || '';
			}
		}
	},
	name: {
		get: function() {
			var obj = {};
			if ( this._model ) {
				obj = this._model.toObject();
			}
			var fullname = this.fullname;
			if ( fullname ) {
				obj.fullname = fullname;
			}
			return obj;
		}
	},
	model: {
		get: function() {
			return this._model || null;
		}
	},
	parseLog: {
		get: function() {
			return this._parseLog || [];
		}
	}
});

/**
 * Updates the internal originalFullname property, to re-ready this instance for parsing.
 * @param {string|{}} fullnameOrNameObject A string representation of the full name, a plain object
 *        representing a loose HumanNameModel, or an instance of HumanNameModel.
 */
HumanNameNormalizer.prototype.updateFullname = function updateFullname(fullnameOrNameObject) {
	if ( typeof fullnameOrNameObject === 'string' ) {
		this.originalFullname = fullnameOrNameObject;
		return true;
	} else if ( typeof fullnameOrNameObject === 'object' && fullnameOrNameObject !== null ) {
		this._model = new HumanNameModel(fullnameOrNameObject);
		if ( typeof fullnameOrNameObject.fullname === 'string' ) {
			this.originalFullname = fullnameOrNameObject.fullname;
		} else {
			this.originalFullname = this._model.toString();
		}
		return true;
	} else {
		this.originalFullname = this.originalFullname || '';
	}
	return false;
};

/**
 * Updates the name parts (internal model) to formal case. Attempts to determine whether or not
 * the name part is already in its formal representation; if it is, then it is not "normalized."
 * @see HumanNameNormalizer.toFormalCase
 * @param {boolean} [force=false] Optional, if enabled then HumanNameNormalizer.toFormalCase will be invoked regardless
 *                      of whether or not the existing value requires formalizing.
 * @returns {boolean} If at least one property was updated, this returns true, otherwise false.
 */
HumanNameNormalizer.prototype.normalizeModel = function normalizeModel(force) {
	var tmp,
		success = false,
		properties = HumanNameModel.getPropertiesList();
	if ( this._model ) {
		for ( var key, i = 0, iLen = properties.length; i < iLen; i++ ) {
			key = properties[i];
			if ( this._model[key] ) {
				if ( key === 'prefix' && (tmp = Affixes.lookupPrefix(this._model[key])) ) {
					this._model[key] = tmp.abbrv || tmp.subject;
				} else if ( key === 'suffix' && (tmp = Affixes.lookupSuffix(this._model[key])) ) {
					this._model[key] = tmp.abbrv || tmp.subject;
				} else {
					this._model[key] = HumanNameNormalizer.toFormalCase(this._model[key],force);
				}
				success = true;
			}
		}
	}
	return success;
};

/**
 * Parses the current `originalFullname` with the given `mode`.
 * @param {int} [mode=HumanNameNormalizer.MODE_PARSESTRING] One of HumanNameNormalizer.MODE_*
 * @returns {boolean} Whether parsing was successful or not.
 */
HumanNameNormalizer.prototype.parse = function parse(mode) {
	if ( typeof mode !== 'string' ) {
		mode = HumanNameNormalizer.MODE_PARSESTRING;
	}
	var success = false;
	this._parseLog = []; // reset on each parse
	this._log('using mode '+mode);
	switch ( mode ) {
		case HumanNameNormalizer.MODE_PARSESTRING:
			success = this._parseString(this.originalFullname);
			break;
		case HumanNameNormalizer.MODE_REPARSEMODEL:
			if ( this._model ) {
				success = this._parseString(this._model.toString());
			}
			break;
	}
	return success;
};

/**
 * @param {string} str
 * @returns {boolean}
 * @private
 */
HumanNameNormalizer.prototype._parseString = function _parseString(str) {
	var success = false;
	if ( typeof str === 'string' ) {
		str = str
			.replace(regexMoveCommas,'$1,') // move commas outside of quoted encapsulators
			.replace(regexRemoveCommas,',') // remove excess commas
			.replace(regexRemovePeriods,'.') // remove excess periods
			.replace(regexSpaceCommas,', ') // all commas should have a space after them
			.replace(regexRemoveSpaces,' ').trim(); // remove excess whitespace
		this._log('using string '+str);
		var subject,word,tmp,j,
			words = str.split(' ').filter(function(v) {
				return v.match(regexMatchValidParts);
			}),
			i = 0,
			iLen = words.length,
			lastWasSuffix = false,
			model = new HumanNameModel();
		// step 1, take care of any commas: always remove, and possibly re-sort (by reference)
		commaIterator: for ( ; i < iLen; i++ ) {
			if ( words[i].indexOf(',') !== words[i].length-1 ) {
				continue commaIterator; // no trailing comma, next
			}
			this._log('found comma '+words[i]);
			words[i] = words[i].replace(regexRemoveEndComma,''); // remove the comma
			if ( words[i+1] && !Affixes.lookupSuffix(words[i+1]) && !lastWasSuffix ) { // next word is not a suffix
				orderIterator: for ( j = i-1; j >= 0; j-- ) { // figure out how to reorder our words, starting with previous word
					if ( !words[j] ) {
						break orderIterator;
					}
					if ( Affixes.lookupConjunction(words[j]) ) {
						j--; // skip the next one
						continue orderIterator;
					} else if ( Affixes.lookupPreposition(words[j]) ) {
						continue orderIterator; // don't skip, just check next one
					} else {
						j++;
						break orderIterator; // found it
					}
				}
				j = Math.max(j,0); // j could come back negative
				if ( !(j === 0 && i > j) ) { // as long as we're sanely in bounds
					tmp = words.splice(i+1,words.length-i);
					if ( Affixes.lookupSuffix(tmp[tmp.length-1]) ) {
						lastWasSuffix = true;
						words.push(tmp.pop());
					} else {
						lastWasSuffix = false;
					}
					Array.prototype.splice.apply(words,[j,0].concat(tmp)); // move it around
					i = -1; // ...and restart from the top
				}
			}
		}
		// step 2, test for associated prefixes and suffixes
		this._log('word length '+words.length+', next word '+words[0]+', '+JSON.stringify(Affixes.lookupPrefix(words[0])));
		if ( words.length > 1 && (subject = Affixes.lookupPrefix(words[0])) ) {
			model.prefix = subject.abbrv || subject.formal;
			words.shift(); // don't need this any more, remove
			this._log('found prefix '+model.prefix);
		}
		if ( words.length > 1 && (subject = Affixes.lookupSuffix(words[words.length-1])) ) {
			model.suffix = subject.abbrv || subject.formal;
			words.pop(); // don't need this any more, remove
			this._log('found suffix '+model.suffix);
		}
		if ( words.length === 1 ) {
			word = HumanNameNormalizer.toFormalCase(words.shift());
			if ( model.prefix ) { // assume last name
				this._log('single word, with prefix, found last '+word);
				model.last = word;
			} else { // assume first name
				this._log('single word, no prefix, found first '+word);
				model.first = word;
			}
		}
		// step 3, determine first/middle/last names
		wordIterator: while ( words.length ) {
			word = words.shift();
			this._log('determining '+word);
			if ( (subject = Affixes.lookupPreposition(word)) ) {
				this._log('found preposition '+word);
				model.last = (model.last?model.last+' ':'')+subject; // use the case from returned subject
			} else if ( model.last && (subject = Affixes.lookupConjunction(word)) ) {
				this._log('found conjunction '+word);
				model.last += ' '+subject; // use the case from returned subject
			} else if ( model.last ) {
				this._log('still on last name '+word);
				model.last += ' '+HumanNameNormalizer.toFormalCase(word);
			} else if ( model.first && words[0] && words[1] && Affixes.lookupConjunction(words[0]) ) {
				model.last = HumanNameNormalizer.toFormalCase(word);
			} else if ( model.first && words[0] && !Affixes.lookupPreposition(words[0]) ) {
				this._log('found middle '+word);
				model.middle = (model.middle?model.middle+' ':'')+HumanNameNormalizer.toFormalCase(word);
			} else if ( !model.first ) {
				this._log('found first '+word);
				model.first = HumanNameNormalizer.toFormalCase(word);
			} else {
				this._log('found initial last '+word);
				model.last = HumanNameNormalizer.toFormalCase(word);
			}
		}
		this._model = model;
		success = true;
	}
	return success;
};

/**
 * @param {string} str
 * @private
 */
HumanNameNormalizer.prototype._log = function _log(str) {
	this._parseLog = this._parseLog || [];
	this._parseLog.push(str);
};

/**
 * Applies a crude algorithm to formalize the case of a string. First it lowercases everything,
 * then capitalizes the first word based on word boundaries, and lastly capitalizes subsequent
 * characters if the surname prefix is defined in Affixes.surnamePrefix.
 * @param {string} str The string to transform into formal case.
 * @param {boolean} [force=false] Optional, if enabled then HumanNameNormalizer.toFormalCase will be invoked regardless of
 *                      whether or not the existing value requires formalizing.
 * @returns {string} The transformed string.
 */
HumanNameNormalizer.toFormalCase = function toFormalCase(str,force) {
	if ( str && (force || !HumanNameNormalizer.isFormalCase(str)) ) {
		str = str.toLowerCase()
				.replace(HumanNameNormalizer._firstCharacterRegex,upperFirstCharacterCallback)
				.replace(HumanNameNormalizer._surnamePrefixRegex,upperSurnamePrefixCallback);
	}
	return str || '';
};

/**
 * Determines whether the given string is in formal case already.
 * @param {string} str The string to test.
 * @returns {boolean} True if it is already in formal case, false otherwise.
 */
HumanNameNormalizer.isFormalCase = function isFormalCase(str) {
	return HumanNameNormalizer._mixedCaseRegex.test(str);
};

function upperFirstCharacterCallback(c) {
	return c.toUpperCase();
}

function upperSurnamePrefixCallback(str,prefix,c) {
	return prefix+c.toUpperCase();
}
