var HumanNameNormalizer	= require('./lib/index.js'),
	HumanNameModel		= require('./lib/model.js'),
	Affixes				= require('./lib/affixes.js');

module.exports						= HumanNameNormalizer;
module.exports.HumanNameNormalizer	= HumanNameNormalizer;
module.exports.HumanNameModel		= HumanNameModel;
module.exports.Affixes				= Affixes;
