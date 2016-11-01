var Participle = require( "../../values/Participle.js" );

var getIndices = require( "../../stringProcessing/indices.js" ).getIndicesByWord;
var getIndicesOfList = require( "../../stringProcessing/indices.js" ).getIndicesByWordList;
var exceptionsRegex =
	/\S+(apparat|arbeit|dienst|haft|halt|keit|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var exceptionsParticiplesActive = require( "./passivevoice-german/exceptionsParticiplesActive.js" )();

var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );
var map = require( "lodash/map" );

/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var GermanParticiple = function(  participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.setSentencePartPassiveness( this.isPassive() );
};

require( "util" ).inherits( GermanParticiple, Participle );

/**
 * Checks if the text is passive based on the participle exceptions.
 *
 * @returns {boolean} Returns true if there is no exception, and the sentence is passive.
 */
GermanParticiple.prototype.isPassive = function() {
	return 	! this.hasNounSuffix() &&
				! this.isInExceptionList() &&
				! this.hasHabenSeinException();
};

/**
 * Checks whether a found participle is in the exception list.
 * If a word is in the exceptionsParticiplesActive list, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is in the exception list, otherwise returns false.
 */
GermanParticiple.prototype.isInExceptionList = function() {
	return includes( exceptionsParticiplesActive, this.getParticiple() );
};

/**
 * Checks whether a found participle ends in a noun suffix.
 * If a word ends in a noun suffix from the exceptionsRegex, it isn't a participle.
 *
 * @returns {boolean} Returns true if it ends in a noun suffix, otherwise returns false.
 */
GermanParticiple.prototype.hasNounSuffix = function() {
	return this.getParticiple().match( exceptionsRegex ) !== null;
};

/**
 * Checks whether a participle is followed by 'haben' or 'sein'.
 * If a participle is followed by one of these, the sentence is not passive.
 *
 * @returns {boolean} Returns true if it is an exception, otherwise returns false.
 */
GermanParticiple.prototype.hasHabenSeinException = function() {
	var participleIndices = getIndices( this.getParticiple(), this.getSentencePart() );
	var habenSeinIndices = getIndicesOfList( [ "haben", "sein" ], this.getSentencePart() );
	var isPassiveException = false;
	if( participleIndices.length > 0 && habenSeinIndices.length === 0 ) {
		return isPassiveException;
	}
	habenSeinIndices = map( habenSeinIndices, "index" );
	var currentParticiple = participleIndices[ 0 ];
	return includes( habenSeinIndices, currentParticiple.index + currentParticiple.match.length + 1 );
};

module.exports = GermanParticiple;
