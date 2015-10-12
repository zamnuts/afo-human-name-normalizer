var HumanNameModel;

/**
 * @class HumanNameModel
 * @constructor
 * @param {{}|HumanNameModel|null} objOrInstance
 */
module.exports = HumanNameModel = function(objOrInstance) {
	if ( typeof objOrInstance === 'object' && objOrInstance !== null ) {
		this.fromObject(objOrInstance);
	} else {
		this.restoreDefaults();
	}
};

/**
 * @name HumanNameModel#prefix
 * @type {string}
 */

/**
 * @name HumanNameModel#first
 * @type {string}
 */

/**
 * @name HumanNameModel#middle
 * @type {string}
 */

/**
 * @name HumanNameModel#last
 * @type {string}
 */

/**
 * @name HumanNameModel#suffix
 * @type {string}
 */

/**
 * toString uses the order these are placed in
 * @type {string[]}
 * @private
 */
HumanNameModel._properties = [
	'prefix',
	'first',
	'middle',
	'last',
	'suffix'
];

/**
 * @returns {string[]}
 */
HumanNameModel.getPropertiesList = function getPropertiesList() {
	return HumanNameModel._properties;
};

/**
 * Resets all properties to an empty string.
 * @returns {boolean}
 */
HumanNameModel.prototype.restoreDefaults = function restoreDefaults() {
	for ( var i = 0, iLen = HumanNameModel._properties.length; i < iLen; i++ ) {
		this[HumanNameModel._properties[i]] = '';
	}
	return true;
};

/**
 * Are any of the properties set?
 * @returns {boolean}
 */
HumanNameModel.prototype.isSet = function isSet() {
	for ( var i = 0, iLen = HumanNameModel._properties.length; i < iLen; i++ ) {
		if ( this[HumanNameModel._properties[i]] ) {
			return true;
		}
	}
	return false;
};

/**
 * @returns {HumanNameModel}
 */
HumanNameModel.prototype.clone = function clone() {
	return HumanNameModel.fromObject(this);
};

/**
 * @param {HumanNameModel} from
 * @returns {boolean}
 */
HumanNameModel.prototype.merge = function merge(from) {
	if ( !(from instanceof HumanNameModel) ) {
		return false;
	}
	for ( var i = 0, iLen = HumanNameModel._properties.length; i < iLen; i++ ) {
		if ( from[HumanNameModel._properties[i]] ) {
			this[HumanNameModel._properties[i]] = from[HumanNameModel._properties[i]];
		}
	}
	return true;
};

/**
 * @returns {string}
 */
HumanNameModel.prototype.toString = function toString() {
	var part,parts = [];
	for ( var i = 0, iLen = HumanNameModel._properties.length; i < iLen; i++ ) {
		part = this[HumanNameModel._properties[i]];
		if ( typeof part === 'string' && part ) {
			parts.push(part.trim());
		}
	}
	return parts.join(' ');
};

/**
 * @returns {{}}
 */
HumanNameModel.prototype.toObject = function toObject() {
	var obj = {};
	for ( var i = 0, iLen = HumanNameModel._properties.length; i < iLen; i++ ) {
		obj[HumanNameModel._properties[i]] = this[HumanNameModel._properties[i]];
	}
	return obj;
};

/**
 * @param {{}} obj
 * @returns {boolean}
 */
HumanNameModel.prototype.fromObject = function fromObject(obj) {
	var hasSomeProperties = false,
		isStaticInvocation = !(this instanceof HumanNameModel),
		subject = isStaticInvocation ? new HumanNameModel() : this;
	if ( typeof obj !== 'undefined' && obj !== null ) {
		for ( var i = 0, iLen = HumanNameModel._properties.length; i < iLen; i++ ) {
			if ( typeof obj[HumanNameModel._properties[i]] === 'string' ) {
				hasSomeProperties = true;
				subject[HumanNameModel._properties[i]] = obj[HumanNameModel._properties[i]];
			}
		}
	}
	return isStaticInvocation && hasSomeProperties ? subject : hasSomeProperties;
};

/**
 * @param {{}} obj
 * @type {Function}
 * @return {HumanNameModel}
 */
HumanNameModel.fromObject = HumanNameModel.prototype.fromObject;
