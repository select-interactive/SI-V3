//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
/* jshint ignore:start */
( function( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define( factory ) :
    global.moment = factory()
}( this, function() {
	'use strict';

	var hookCallback;

	function utils_hooks__hooks() {
		return hookCallback.apply( null, arguments );
	}

	// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback( callback ) {
		hookCallback = callback;
	}

	function isArray( input ) {
		return Object.prototype.toString.call( input ) === '[object Array]';
	}

	function isDate( input ) {
		return input instanceof Date || Object.prototype.toString.call( input ) === '[object Date]';
	}

	function map( arr, fn ) {
		var res = [], i;
		for ( i = 0; i < arr.length; ++i ) {
			res.push( fn( arr[i], i ) );
		}
		return res;
	}

	function hasOwnProp( a, b ) {
		return Object.prototype.hasOwnProperty.call( a, b );
	}

	function extend( a, b ) {
		for ( var i in b ) {
			if ( hasOwnProp( b, i ) ) {
				a[i] = b[i];
			}
		}

		if ( hasOwnProp( b, 'toString' ) ) {
			a.toString = b.toString;
		}

		if ( hasOwnProp( b, 'valueOf' ) ) {
			a.valueOf = b.valueOf;
		}

		return a;
	}

	function create_utc__createUTC( input, format, locale, strict ) {
		return createLocalOrUTC( input, format, locale, strict, true ).utc();
	}

	function defaultParsingFlags() {
		// We need to deep clone this object.
		return {
			empty: false,
			unusedTokens: [],
			unusedInput: [],
			overflow: -2,
			charsLeftOver: 0,
			nullInput: false,
			invalidMonth: null,
			invalidFormat: false,
			userInvalidated: false,
			iso: false
		};
	}

	function getParsingFlags( m ) {
		if ( m._pf == null ) {
			m._pf = defaultParsingFlags();
		}
		return m._pf;
	}

	function valid__isValid( m ) {
		if ( m._isValid == null ) {
			var flags = getParsingFlags( m );
			m._isValid = !isNaN( m._d.getTime() ) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

			if ( m._strict ) {
				m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
			}
		}
		return m._isValid;
	}

	function valid__createInvalid( flags ) {
		var m = create_utc__createUTC( NaN );
		if ( flags != null ) {
			extend( getParsingFlags( m ), flags );
		}
		else {
			getParsingFlags( m ).userInvalidated = true;
		}

		return m;
	}

	var momentProperties = utils_hooks__hooks.momentProperties = [];

	function copyConfig( to, from ) {
		var i, prop, val;

		if ( typeof from._isAMomentObject !== 'undefined' ) {
			to._isAMomentObject = from._isAMomentObject;
		}
		if ( typeof from._i !== 'undefined' ) {
			to._i = from._i;
		}
		if ( typeof from._f !== 'undefined' ) {
			to._f = from._f;
		}
		if ( typeof from._l !== 'undefined' ) {
			to._l = from._l;
		}
		if ( typeof from._strict !== 'undefined' ) {
			to._strict = from._strict;
		}
		if ( typeof from._tzm !== 'undefined' ) {
			to._tzm = from._tzm;
		}
		if ( typeof from._isUTC !== 'undefined' ) {
			to._isUTC = from._isUTC;
		}
		if ( typeof from._offset !== 'undefined' ) {
			to._offset = from._offset;
		}
		if ( typeof from._pf !== 'undefined' ) {
			to._pf = getParsingFlags( from );
		}
		if ( typeof from._locale !== 'undefined' ) {
			to._locale = from._locale;
		}

		if ( momentProperties.length > 0 ) {
			for ( i in momentProperties ) {
				prop = momentProperties[i];
				val = from[prop];
				if ( typeof val !== 'undefined' ) {
					to[prop] = val;
				}
			}
		}

		return to;
	}

	var updateInProgress = false;

	// Moment prototype object
	function Moment( config ) {
		copyConfig( this, config );
		this._d = new Date( +config._d );
		// Prevent infinite loop in case updateOffset creates new moment
		// objects.
		if ( updateInProgress === false ) {
			updateInProgress = true;
			utils_hooks__hooks.updateOffset( this );
			updateInProgress = false;
		}
	}

	function isMoment( obj ) {
		return obj instanceof Moment || ( obj != null && obj._isAMomentObject != null );
	}

	function toInt( argumentForCoercion ) {
		var coercedNumber = +argumentForCoercion,
            value = 0;

		if ( coercedNumber !== 0 && isFinite( coercedNumber ) ) {
			if ( coercedNumber >= 0 ) {
				value = Math.floor( coercedNumber );
			} else {
				value = Math.ceil( coercedNumber );
			}
		}

		return value;
	}

	function compareArrays( array1, array2, dontConvert ) {
		var len = Math.min( array1.length, array2.length ),
            lengthDiff = Math.abs( array1.length - array2.length ),
            diffs = 0,
            i;
		for ( i = 0; i < len; i++ ) {
			if ( ( dontConvert && array1[i] !== array2[i] ) ||
                ( !dontConvert && toInt( array1[i] ) !== toInt( array2[i] ) ) ) {
				diffs++;
			}
		}
		return diffs + lengthDiff;
	}

	function Locale() {
	}

	var locales = {};
	var globalLocale;

	function normalizeLocale( key ) {
		return key ? key.toLowerCase().replace( '_', '-' ) : key;
	}

	// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale( names ) {
		var i = 0, j, next, locale, split;

		while ( i < names.length ) {
			split = normalizeLocale( names[i] ).split( '-' );
			j = split.length;
			next = normalizeLocale( names[i + 1] );
			next = next ? next.split( '-' ) : null;
			while ( j > 0 ) {
				locale = loadLocale( split.slice( 0, j ).join( '-' ) );
				if ( locale ) {
					return locale;
				}
				if ( next && next.length >= j && compareArrays( split, next, true ) >= j - 1 ) {
					//the next array item is better than a shallower substring of this one
					break;
				}
				j--;
			}
			i++;
		}
		return null;
	}

	function loadLocale( name ) {
		var oldLocale = null;
		// TODO: Find a better way to register and load all the locales in Node
		if ( !locales[name] && typeof module !== 'undefined' &&
                module && module.exports ) {
			try {
				oldLocale = globalLocale._abbr;
				require( './locale/' + name );
				// because defineLocale currently also sets the global locale, we
				// want to undo that for lazy loaded locales
				locale_locales__getSetGlobalLocale( oldLocale );
			} catch ( e ) { }
		}
		return locales[name];
	}

	// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function locale_locales__getSetGlobalLocale( key, values ) {
		var data;
		if ( key ) {
			if ( typeof values === 'undefined' ) {
				data = locale_locales__getLocale( key );
			}
			else {
				data = defineLocale( key, values );
			}

			if ( data ) {
				// moment.duration._locale = moment._locale = data;
				globalLocale = data;
			}
		}

		return globalLocale._abbr;
	}

	function defineLocale( name, values ) {
		if ( values !== null ) {
			values.abbr = name;
			if ( !locales[name] ) {
				locales[name] = new Locale();
			}
			locales[name].set( values );

			// backwards compat for now: also set the locale
			locale_locales__getSetGlobalLocale( name );

			return locales[name];
		} else {
			// useful for testing
			delete locales[name];
			return null;
		}
	}

	// returns locale data
	function locale_locales__getLocale( key ) {
		var locale;

		if ( key && key._locale && key._locale._abbr ) {
			key = key._locale._abbr;
		}

		if ( !key ) {
			return globalLocale;
		}

		if ( !isArray( key ) ) {
			//short-circuit everything else
			locale = loadLocale( key );
			if ( locale ) {
				return locale;
			}
			key = [key];
		}

		return chooseLocale( key );
	}

	var aliases = {};

	function addUnitAlias( unit, shorthand ) {
		var lowerCase = unit.toLowerCase();
		aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	}

	function normalizeUnits( units ) {
		return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	}

	function normalizeObjectUnits( inputObject ) {
		var normalizedInput = {},
            normalizedProp,
            prop;

		for ( prop in inputObject ) {
			if ( hasOwnProp( inputObject, prop ) ) {
				normalizedProp = normalizeUnits( prop );
				if ( normalizedProp ) {
					normalizedInput[normalizedProp] = inputObject[prop];
				}
			}
		}

		return normalizedInput;
	}

	function makeGetSet( unit, keepTime ) {
		return function( value ) {
			if ( value != null ) {
				get_set__set( this, unit, value );
				utils_hooks__hooks.updateOffset( this, keepTime );
				return this;
			} else {
				return get_set__get( this, unit );
			}
		};
	}

	function get_set__get( mom, unit ) {
		return mom._d['get' + ( mom._isUTC ? 'UTC' : '' ) + unit]();
	}

	function get_set__set( mom, unit, value ) {
		return mom._d['set' + ( mom._isUTC ? 'UTC' : '' ) + unit]( value );
	}

	// MOMENTS

	function getSet( units, value ) {
		var unit;
		if ( typeof units === 'object' ) {
			for ( unit in units ) {
				this.set( unit, units[unit] );
			}
		} else {
			units = normalizeUnits( units );
			if ( typeof this[units] === 'function' ) {
				return this[units]( value );
			}
		}
		return this;
	}

	function zeroFill( number, targetLength, forceSign ) {
		var output = '' + Math.abs( number ),
            sign = number >= 0;

		while ( output.length < targetLength ) {
			output = '0' + output;
		}
		return ( sign ? ( forceSign ? '+' : '' ) : '-' ) + output;
	}

	var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g;

	var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	var formatFunctions = {};

	var formatTokenFunctions = {};

	// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken( token, padded, ordinal, callback ) {
		var func = callback;
		if ( typeof callback === 'string' ) {
			func = function() {
				return this[callback]();
			};
		}
		if ( token ) {
			formatTokenFunctions[token] = func;
		}
		if ( padded ) {
			formatTokenFunctions[padded[0]] = function() {
				return zeroFill( func.apply( this, arguments ), padded[1], padded[2] );
			};
		}
		if ( ordinal ) {
			formatTokenFunctions[ordinal] = function() {
				return this.localeData().ordinal( func.apply( this, arguments ), token );
			};
		}
	}

	function removeFormattingTokens( input ) {
		if ( input.match( /\[[\s\S]/ ) ) {
			return input.replace( /^\[|\]$/g, '' );
		}
		return input.replace( /\\/g, '' );
	}

	function makeFormatFunction( format ) {
		var array = format.match( formattingTokens ), i, length;

		for ( i = 0, length = array.length; i < length; i++ ) {
			if ( formatTokenFunctions[array[i]] ) {
				array[i] = formatTokenFunctions[array[i]];
			} else {
				array[i] = removeFormattingTokens( array[i] );
			}
		}

		return function( mom ) {
			var output = '';
			for ( i = 0; i < length; i++ ) {
				output += array[i] instanceof Function ? array[i].call( mom, format ) : array[i];
			}
			return output;
		};
	}

	// format date using native date object
	function formatMoment( m, format ) {
		if ( !m.isValid() ) {
			return m.localeData().invalidDate();
		}

		format = expandFormat( format, m.localeData() );

		if ( !formatFunctions[format] ) {
			formatFunctions[format] = makeFormatFunction( format );
		}

		return formatFunctions[format]( m );
	}

	function expandFormat( format, locale ) {
		var i = 5;

		function replaceLongDateFormatTokens( input ) {
			return locale.longDateFormat( input ) || input;
		}

		localFormattingTokens.lastIndex = 0;
		while ( i >= 0 && localFormattingTokens.test( format ) ) {
			format = format.replace( localFormattingTokens, replaceLongDateFormatTokens );
			localFormattingTokens.lastIndex = 0;
			i -= 1;
		}

		return format;
	}

	var match1 = /\d/;            //       0 - 9
	var match2 = /\d\d/;          //      00 - 99
	var match3 = /\d{3}/;         //     000 - 999
	var match4 = /\d{4}/;         //    0000 - 9999
	var match6 = /[+-]?\d{6}/;    // -999999 - 999999
	var match1to2 = /\d\d?/;         //       0 - 99
	var match1to3 = /\d{1,3}/;       //       0 - 999
	var match1to4 = /\d{1,4}/;       //       0 - 9999
	var match1to6 = /[+-]?\d{1,6}/;  // -999999 - 999999

	var matchUnsigned = /\d+/;           //       0 - inf
	var matchSigned = /[+-]?\d+/;      //    -inf - inf

	var matchOffset = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

	var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	// any word (or two) characters or numbers including two/three word month in arabic.
	var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

	var regexes = {};

	function addRegexToken( token, regex, strictRegex ) {
		regexes[token] = typeof regex === 'function' ? regex : function( isStrict ) {
			return ( isStrict && strictRegex ) ? strictRegex : regex;
		};
	}

	function getParseRegexForToken( token, config ) {
		if ( !hasOwnProp( regexes, token ) ) {
			return new RegExp( unescapeFormat( token ) );
		}

		return regexes[token]( config._strict, config._locale );
	}

	// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat( s ) {
		return s.replace( '\\', '' ).replace( /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function( matched, p1, p2, p3, p4 ) {
			return p1 || p2 || p3 || p4;
		} ).replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' );
	}

	var tokens = {};

	function addParseToken( token, callback ) {
		var i, func = callback;
		if ( typeof token === 'string' ) {
			token = [token];
		}
		if ( typeof callback === 'number' ) {
			func = function( input, array ) {
				array[callback] = toInt( input );
			};
		}
		for ( i = 0; i < token.length; i++ ) {
			tokens[token[i]] = func;
		}
	}

	function addWeekParseToken( token, callback ) {
		addParseToken( token, function( input, array, config, token ) {
			config._w = config._w || {};
			callback( input, config._w, config, token );
		} );
	}

	function addTimeToArrayFromToken( token, input, config ) {
		if ( input != null && hasOwnProp( tokens, token ) ) {
			tokens[token]( input, config._a, config, token );
		}
	}

	var YEAR = 0;
	var MONTH = 1;
	var DATE = 2;
	var HOUR = 3;
	var MINUTE = 4;
	var SECOND = 5;
	var MILLISECOND = 6;

	function daysInMonth( year, month ) {
		return new Date( Date.UTC( year, month + 1, 0 ) ).getUTCDate();
	}

	// FORMATTING

	addFormatToken( 'M', ['MM', 2], 'Mo', function() {
		return this.month() + 1;
	} );

	addFormatToken( 'MMM', 0, 0, function( format ) {
		return this.localeData().monthsShort( this, format );
	} );

	addFormatToken( 'MMMM', 0, 0, function( format ) {
		return this.localeData().months( this, format );
	} );

	// ALIASES

	addUnitAlias( 'month', 'M' );

	// PARSING

	addRegexToken( 'M', match1to2 );
	addRegexToken( 'MM', match1to2, match2 );
	addRegexToken( 'MMM', matchWord );
	addRegexToken( 'MMMM', matchWord );

	addParseToken( ['M', 'MM'], function( input, array ) {
		array[MONTH] = toInt( input ) - 1;
	} );

	addParseToken( ['MMM', 'MMMM'], function( input, array, config, token ) {
		var month = config._locale.monthsParse( input, token, config._strict );
		// if we didn't find a month name, mark the date as invalid.
		if ( month != null ) {
			array[MONTH] = month;
		} else {
			getParsingFlags( config ).invalidMonth = input;
		}
	} );

	// LOCALES

	var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split( '_' );
	function localeMonths( m ) {
		return this._months[m.month()];
	}

	var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split( '_' );
	function localeMonthsShort( m ) {
		return this._monthsShort[m.month()];
	}

	function localeMonthsParse( monthName, format, strict ) {
		var i, mom, regex;

		if ( !this._monthsParse ) {
			this._monthsParse = [];
			this._longMonthsParse = [];
			this._shortMonthsParse = [];
		}

		for ( i = 0; i < 12; i++ ) {
			// make the regex if we don't have it already
			mom = create_utc__createUTC( [2000, i] );
			if ( strict && !this._longMonthsParse[i] ) {
				this._longMonthsParse[i] = new RegExp( '^' + this.months( mom, '' ).replace( '.', '' ) + '$', 'i' );
				this._shortMonthsParse[i] = new RegExp( '^' + this.monthsShort( mom, '' ).replace( '.', '' ) + '$', 'i' );
			}
			if ( !strict && !this._monthsParse[i] ) {
				regex = '^' + this.months( mom, '' ) + '|^' + this.monthsShort( mom, '' );
				this._monthsParse[i] = new RegExp( regex.replace( '.', '' ), 'i' );
			}
			// test the regex
			if ( strict && format === 'MMMM' && this._longMonthsParse[i].test( monthName ) ) {
				return i;
			} else if ( strict && format === 'MMM' && this._shortMonthsParse[i].test( monthName ) ) {
				return i;
			} else if ( !strict && this._monthsParse[i].test( monthName ) ) {
				return i;
			}
		}
	}

	// MOMENTS

	function setMonth( mom, value ) {
		var dayOfMonth;

		// TODO: Move this out of here!
		if ( typeof value === 'string' ) {
			value = mom.localeData().monthsParse( value );
			// TODO: Another silent failure?
			if ( typeof value !== 'number' ) {
				return mom;
			}
		}

		dayOfMonth = Math.min( mom.date(), daysInMonth( mom.year(), value ) );
		mom._d['set' + ( mom._isUTC ? 'UTC' : '' ) + 'Month']( value, dayOfMonth );
		return mom;
	}

	function getSetMonth( value ) {
		if ( value != null ) {
			setMonth( this, value );
			utils_hooks__hooks.updateOffset( this, true );
			return this;
		} else {
			return get_set__get( this, 'Month' );
		}
	}

	function getDaysInMonth() {
		return daysInMonth( this.year(), this.month() );
	}

	function checkOverflow( m ) {
		var overflow;
		var a = m._a;

		if ( a && getParsingFlags( m ).overflow === -2 ) {
			overflow =
                a[MONTH] < 0 || a[MONTH] > 11 ? MONTH :
                a[DATE] < 1 || a[DATE] > daysInMonth( a[YEAR], a[MONTH] ) ? DATE :
                a[HOUR] < 0 || a[HOUR] > 24 || ( a[HOUR] === 24 && ( a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0 ) ) ? HOUR :
                a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE :
                a[SECOND] < 0 || a[SECOND] > 59 ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

			if ( getParsingFlags( m )._overflowDayOfYear && ( overflow < YEAR || overflow > DATE ) ) {
				overflow = DATE;
			}

			getParsingFlags( m ).overflow = overflow;
		}

		return m;
	}

	function warn( msg ) {
		if ( utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn ) {
			console.warn( 'Deprecation warning: ' + msg );
		}
	}

	function deprecate( msg, fn ) {
		var firstTime = true,
            msgWithStack = msg + '\n' + ( new Error() ).stack;

		return extend( function() {
			if ( firstTime ) {
				warn( msgWithStack );
				firstTime = false;
			}
			return fn.apply( this, arguments );
		}, fn );
	}

	var deprecations = {};

	function deprecateSimple( name, msg ) {
		if ( !deprecations[name] ) {
			warn( msg );
			deprecations[name] = true;
		}
	}

	utils_hooks__hooks.suppressDeprecationWarnings = false;

	var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
	];

	// iso time formats and regexes
	var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
	];

	var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	// date from iso format
	function configFromISO( config ) {
		var i, l,
            string = config._i,
            match = from_string__isoRegex.exec( string );

		if ( match ) {
			getParsingFlags( config ).iso = true;
			for ( i = 0, l = isoDates.length; i < l; i++ ) {
				if ( isoDates[i][1].exec( string ) ) {
					// match[5] should be 'T' or undefined
					config._f = isoDates[i][0] + ( match[6] || ' ' );
					break;
				}
			}
			for ( i = 0, l = isoTimes.length; i < l; i++ ) {
				if ( isoTimes[i][1].exec( string ) ) {
					config._f += isoTimes[i][0];
					break;
				}
			}
			if ( string.match( matchOffset ) ) {
				config._f += 'Z';
			}
			configFromStringAndFormat( config );
		} else {
			config._isValid = false;
		}
	}

	// date from iso format or fallback
	function configFromString( config ) {
		var matched = aspNetJsonRegex.exec( config._i );

		if ( matched !== null ) {
			config._d = new Date( +matched[1] );
			return;
		}

		configFromISO( config );
		if ( config._isValid === false ) {
			delete config._isValid;
			utils_hooks__hooks.createFromInputFallback( config );
		}
	}

	utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function( config ) {
        	config._d = new Date( config._i + ( config._useUTC ? ' UTC' : '' ) );
        }
    );

	function createDate( y, m, d, h, M, s, ms ) {
		//can't just apply() to create a date:
		//http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
		var date = new Date( y, m, d, h, M, s, ms );

		//the date constructor doesn't accept years < 1970
		if ( y < 1970 ) {
			date.setFullYear( y );
		}
		return date;
	}

	function createUTCDate( y ) {
		var date = new Date( Date.UTC.apply( null, arguments ) );
		if ( y < 1970 ) {
			date.setUTCFullYear( y );
		}
		return date;
	}

	addFormatToken( 0, ['YY', 2], 0, function() {
		return this.year() % 100;
	} );

	addFormatToken( 0, ['YYYY', 4], 0, 'year' );
	addFormatToken( 0, ['YYYYY', 5], 0, 'year' );
	addFormatToken( 0, ['YYYYYY', 6, true], 0, 'year' );

	// ALIASES

	addUnitAlias( 'year', 'y' );

	// PARSING

	addRegexToken( 'Y', matchSigned );
	addRegexToken( 'YY', match1to2, match2 );
	addRegexToken( 'YYYY', match1to4, match4 );
	addRegexToken( 'YYYYY', match1to6, match6 );
	addRegexToken( 'YYYYYY', match1to6, match6 );

	addParseToken( ['YYYY', 'YYYYY', 'YYYYYY'], YEAR );
	addParseToken( 'YY', function( input, array ) {
		array[YEAR] = utils_hooks__hooks.parseTwoDigitYear( input );
	} );

	// HELPERS

	function daysInYear( year ) {
		return isLeapYear( year ) ? 366 : 365;
	}

	function isLeapYear( year ) {
		return ( year % 4 === 0 && year % 100 !== 0 ) || year % 400 === 0;
	}

	// HOOKS

	utils_hooks__hooks.parseTwoDigitYear = function( input ) {
		return toInt( input ) + ( toInt( input ) > 68 ? 1900 : 2000 );
	};

	// MOMENTS

	var getSetYear = makeGetSet( 'FullYear', false );

	function getIsLeapYear() {
		return isLeapYear( this.year() );
	}

	addFormatToken( 'w', ['ww', 2], 'wo', 'week' );
	addFormatToken( 'W', ['WW', 2], 'Wo', 'isoWeek' );

	// ALIASES

	addUnitAlias( 'week', 'w' );
	addUnitAlias( 'isoWeek', 'W' );

	// PARSING

	addRegexToken( 'w', match1to2 );
	addRegexToken( 'ww', match1to2, match2 );
	addRegexToken( 'W', match1to2 );
	addRegexToken( 'WW', match1to2, match2 );

	addWeekParseToken( ['w', 'ww', 'W', 'WW'], function( input, week, config, token ) {
		week[token.substr( 0, 1 )] = toInt( input );
	} );

	// HELPERS

	// firstDayOfWeek       0 = sun, 6 = sat
	//                      the day of the week that starts the week
	//                      (usually sunday or monday)
	// firstDayOfWeekOfYear 0 = sun, 6 = sat
	//                      the first week is the week that contains the first
	//                      of this day of the week
	//                      (eg. ISO weeks use thursday (4))
	function weekOfYear( mom, firstDayOfWeek, firstDayOfWeekOfYear ) {
		var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


		if ( daysToDayOfWeek > end ) {
			daysToDayOfWeek -= 7;
		}

		if ( daysToDayOfWeek < end - 7 ) {
			daysToDayOfWeek += 7;
		}

		adjustedMoment = local__createLocal( mom ).add( daysToDayOfWeek, 'd' );
		return {
			week: Math.ceil( adjustedMoment.dayOfYear() / 7 ),
			year: adjustedMoment.year()
		};
	}

	// LOCALES

	function localeWeek( mom ) {
		return weekOfYear( mom, this._week.dow, this._week.doy ).week;
	}

	var defaultLocaleWeek = {
		dow: 0, // Sunday is the first day of the week.
		doy: 6  // The week that contains Jan 1st is the first week of the year.
	};

	function localeFirstDayOfWeek() {
		return this._week.dow;
	}

	function localeFirstDayOfYear() {
		return this._week.doy;
	}

	// MOMENTS

	function getSetWeek( input ) {
		var week = this.localeData().week( this );
		return input == null ? week : this.add(( input - week ) * 7, 'd' );
	}

	function getSetISOWeek( input ) {
		var week = weekOfYear( this, 1, 4 ).week;
		return input == null ? week : this.add(( input - week ) * 7, 'd' );
	}

	addFormatToken( 'DDD', ['DDDD', 3], 'DDDo', 'dayOfYear' );

	// ALIASES

	addUnitAlias( 'dayOfYear', 'DDD' );

	// PARSING

	addRegexToken( 'DDD', match1to3 );
	addRegexToken( 'DDDD', match3 );
	addParseToken( ['DDD', 'DDDD'], function( input, array, config ) {
		config._dayOfYear = toInt( input );
	} );

	// HELPERS

	//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks( year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek ) {
		var d = createUTCDate( year, 0, 1 ).getUTCDay();
		var daysToAdd;
		var dayOfYear;

		d = d === 0 ? 7 : d;
		weekday = weekday != null ? weekday : firstDayOfWeek;
		daysToAdd = firstDayOfWeek - d + ( d > firstDayOfWeekOfYear ? 7 : 0 ) - ( d < firstDayOfWeek ? 7 : 0 );
		dayOfYear = 7 * ( week - 1 ) + ( weekday - firstDayOfWeek ) + daysToAdd + 1;

		return {
			year: dayOfYear > 0 ? year : year - 1,
			dayOfYear: dayOfYear > 0 ? dayOfYear : daysInYear( year - 1 ) + dayOfYear
		};
	}

	// MOMENTS

	function getSetDayOfYear( input ) {
		var dayOfYear = Math.round(( this.clone().startOf( 'day' ) - this.clone().startOf( 'year' ) ) / 864e5 ) + 1;
		return input == null ? dayOfYear : this.add(( input - dayOfYear ), 'd' );
	}

	// Pick the first defined of two or three arguments.
	function defaults( a, b, c ) {
		if ( a != null ) {
			return a;
		}
		if ( b != null ) {
			return b;
		}
		return c;
	}

	function currentDateArray( config ) {
		var now = new Date();
		if ( config._useUTC ) {
			return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
		}
		return [now.getFullYear(), now.getMonth(), now.getDate()];
	}

	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray( config ) {
		var i, date, input = [], currentDate, yearToUse;

		if ( config._d ) {
			return;
		}

		currentDate = currentDateArray( config );

		//compute day of the year from weeks and weekdays
		if ( config._w && config._a[DATE] == null && config._a[MONTH] == null ) {
			dayOfYearFromWeekInfo( config );
		}

		//if the day of the year is set, figure out what it is
		if ( config._dayOfYear ) {
			yearToUse = defaults( config._a[YEAR], currentDate[YEAR] );

			if ( config._dayOfYear > daysInYear( yearToUse ) ) {
				getParsingFlags( config )._overflowDayOfYear = true;
			}

			date = createUTCDate( yearToUse, 0, config._dayOfYear );
			config._a[MONTH] = date.getUTCMonth();
			config._a[DATE] = date.getUTCDate();
		}

		// Default to current date.
		// * if no year, month, day of month are given, default to today
		// * if day of month is given, default month and year
		// * if month is given, default only year
		// * if year is given, don't default anything
		for ( i = 0; i < 3 && config._a[i] == null; ++i ) {
			config._a[i] = input[i] = currentDate[i];
		}

		// Zero out whatever was not defaulted, including time
		for ( ; i < 7; i++ ) {
			config._a[i] = input[i] = ( config._a[i] == null ) ? ( i === 2 ? 1 : 0 ) : config._a[i];
		}

		// Check for 24:00:00.000
		if ( config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0 ) {
			config._nextDay = true;
			config._a[HOUR] = 0;
		}

		config._d = ( config._useUTC ? createUTCDate : createDate ).apply( null, input );
		// Apply timezone offset from input. The actual utcOffset can be changed
		// with parseZone.
		if ( config._tzm != null ) {
			config._d.setUTCMinutes( config._d.getUTCMinutes() - config._tzm );
		}

		if ( config._nextDay ) {
			config._a[HOUR] = 24;
		}
	}

	function dayOfYearFromWeekInfo( config ) {
		var w, weekYear, week, weekday, dow, doy, temp;

		w = config._w;
		if ( w.GG != null || w.W != null || w.E != null ) {
			dow = 1;
			doy = 4;

			// TODO: We need to take the current isoWeekYear, but that depends on
			// how we interpret now (local, utc, fixed offset). So create
			// a now version of current config (take local/utc/offset flags, and
			// create now).
			weekYear = defaults( w.GG, config._a[YEAR], weekOfYear( local__createLocal(), 1, 4 ).year );
			week = defaults( w.W, 1 );
			weekday = defaults( w.E, 1 );
		} else {
			dow = config._locale._week.dow;
			doy = config._locale._week.doy;

			weekYear = defaults( w.gg, config._a[YEAR], weekOfYear( local__createLocal(), dow, doy ).year );
			week = defaults( w.w, 1 );

			if ( w.d != null ) {
				// weekday -- low day numbers are considered next week
				weekday = w.d;
				if ( weekday < dow ) {
					++week;
				}
			} else if ( w.e != null ) {
				// local weekday -- counting starts from begining of week
				weekday = w.e + dow;
			} else {
				// default to begining of week
				weekday = dow;
			}
		}
		temp = dayOfYearFromWeeks( weekYear, week, weekday, doy, dow );

		config._a[YEAR] = temp.year;
		config._dayOfYear = temp.dayOfYear;
	}

	utils_hooks__hooks.ISO_8601 = function() { };

	// date from string and format string
	function configFromStringAndFormat( config ) {
		// TODO: Move this to another part of the creation flow to prevent circular deps
		if ( config._f === utils_hooks__hooks.ISO_8601 ) {
			configFromISO( config );
			return;
		}

		config._a = [];
		getParsingFlags( config ).empty = true;

		// This array is used to make a Date, either with `new Date` or `Date.UTC`
		var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

		tokens = expandFormat( config._f, config._locale ).match( formattingTokens ) || [];

		for ( i = 0; i < tokens.length; i++ ) {
			token = tokens[i];
			parsedInput = ( string.match( getParseRegexForToken( token, config ) ) || [] )[0];
			if ( parsedInput ) {
				skipped = string.substr( 0, string.indexOf( parsedInput ) );
				if ( skipped.length > 0 ) {
					getParsingFlags( config ).unusedInput.push( skipped );
				}
				string = string.slice( string.indexOf( parsedInput ) + parsedInput.length );
				totalParsedInputLength += parsedInput.length;
			}
			// don't parse if it's not a known token
			if ( formatTokenFunctions[token] ) {
				if ( parsedInput ) {
					getParsingFlags( config ).empty = false;
				}
				else {
					getParsingFlags( config ).unusedTokens.push( token );
				}
				addTimeToArrayFromToken( token, parsedInput, config );
			}
			else if ( config._strict && !parsedInput ) {
				getParsingFlags( config ).unusedTokens.push( token );
			}
		}

		// add remaining unparsed input length to the string
		getParsingFlags( config ).charsLeftOver = stringLength - totalParsedInputLength;
		if ( string.length > 0 ) {
			getParsingFlags( config ).unusedInput.push( string );
		}

		// clear _12h flag if hour is <= 12
		if ( getParsingFlags( config ).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0 ) {
			getParsingFlags( config ).bigHour = undefined;
		}
		// handle meridiem
		config._a[HOUR] = meridiemFixWrap( config._locale, config._a[HOUR], config._meridiem );

		configFromArray( config );
		checkOverflow( config );
	}


	function meridiemFixWrap( locale, hour, meridiem ) {
		var isPm;

		if ( meridiem == null ) {
			// nothing to do
			return hour;
		}
		if ( locale.meridiemHour != null ) {
			return locale.meridiemHour( hour, meridiem );
		} else if ( locale.isPM != null ) {
			// Fallback
			isPm = locale.isPM( meridiem );
			if ( isPm && hour < 12 ) {
				hour += 12;
			}
			if ( !isPm && hour === 12 ) {
				hour = 0;
			}
			return hour;
		} else {
			// this is not supposed to happen
			return hour;
		}
	}

	function configFromStringAndArray( config ) {
		var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

		if ( config._f.length === 0 ) {
			getParsingFlags( config ).invalidFormat = true;
			config._d = new Date( NaN );
			return;
		}

		for ( i = 0; i < config._f.length; i++ ) {
			currentScore = 0;
			tempConfig = copyConfig( {}, config );
			if ( config._useUTC != null ) {
				tempConfig._useUTC = config._useUTC;
			}
			tempConfig._f = config._f[i];
			configFromStringAndFormat( tempConfig );

			if ( !valid__isValid( tempConfig ) ) {
				continue;
			}

			// if there is any input that was not parsed add a penalty for that format
			currentScore += getParsingFlags( tempConfig ).charsLeftOver;

			//or tokens
			currentScore += getParsingFlags( tempConfig ).unusedTokens.length * 10;

			getParsingFlags( tempConfig ).score = currentScore;

			if ( scoreToBeat == null || currentScore < scoreToBeat ) {
				scoreToBeat = currentScore;
				bestMoment = tempConfig;
			}
		}

		extend( config, bestMoment || tempConfig );
	}

	function configFromObject( config ) {
		if ( config._d ) {
			return;
		}

		var i = normalizeObjectUnits( config._i );
		config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

		configFromArray( config );
	}

	function createFromConfig( config ) {
		var input = config._i,
            format = config._f,
            res;

		config._locale = config._locale || locale_locales__getLocale( config._l );

		if ( input === null || ( format === undefined && input === '' ) ) {
			return valid__createInvalid( { nullInput: true } );
		}

		if ( typeof input === 'string' ) {
			config._i = input = config._locale.preparse( input );
		}

		if ( isMoment( input ) ) {
			return new Moment( checkOverflow( input ) );
		} else if ( isArray( format ) ) {
			configFromStringAndArray( config );
		} else if ( format ) {
			configFromStringAndFormat( config );
		} else if ( isDate( input ) ) {
			config._d = input;
		} else {
			configFromInput( config );
		}

		res = new Moment( checkOverflow( config ) );
		if ( res._nextDay ) {
			// Adding is smart enough around DST
			res.add( 1, 'd' );
			res._nextDay = undefined;
		}

		return res;
	}

	function configFromInput( config ) {
		var input = config._i;
		if ( input === undefined ) {
			config._d = new Date();
		} else if ( isDate( input ) ) {
			config._d = new Date( +input );
		} else if ( typeof input === 'string' ) {
			configFromString( config );
		} else if ( isArray( input ) ) {
			config._a = map( input.slice( 0 ), function( obj ) {
				return parseInt( obj, 10 );
			} );
			configFromArray( config );
		} else if ( typeof ( input ) === 'object' ) {
			configFromObject( config );
		} else if ( typeof ( input ) === 'number' ) {
			// from milliseconds
			config._d = new Date( input );
		} else {
			utils_hooks__hooks.createFromInputFallback( config );
		}
	}

	function createLocalOrUTC( input, format, locale, strict, isUTC ) {
		var c = {};

		if ( typeof ( locale ) === 'boolean' ) {
			strict = locale;
			locale = undefined;
		}
		// object construction must be done this way.
		// https://github.com/moment/moment/issues/1423
		c._isAMomentObject = true;
		c._useUTC = c._isUTC = isUTC;
		c._l = locale;
		c._i = input;
		c._f = format;
		c._strict = strict;

		return createFromConfig( c );
	}

	function local__createLocal( input, format, locale, strict ) {
		return createLocalOrUTC( input, format, locale, strict, false );
	}

	var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function() {
         	var other = local__createLocal.apply( null, arguments );
         	return other < this ? this : other;
         }
     );

	var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function() {
        	var other = local__createLocal.apply( null, arguments );
        	return other > this ? this : other;
        }
    );

	// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy( fn, moments ) {
		var res, i;
		if ( moments.length === 1 && isArray( moments[0] ) ) {
			moments = moments[0];
		}
		if ( !moments.length ) {
			return local__createLocal();
		}
		res = moments[0];
		for ( i = 1; i < moments.length; ++i ) {
			if ( moments[i][fn]( res ) ) {
				res = moments[i];
			}
		}
		return res;
	}

	// TODO: Use [].sort instead?
	function min() {
		var args = [].slice.call( arguments, 0 );

		return pickBy( 'isBefore', args );
	}

	function max() {
		var args = [].slice.call( arguments, 0 );

		return pickBy( 'isAfter', args );
	}

	function Duration( duration ) {
		var normalizedInput = normalizeObjectUnits( duration ),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

		// representation for dateAddRemove
		this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
		// Because of dateAddRemove treats 24 hours as different from a
		// day when working around DST, we need to store them separately
		this._days = +days +
            weeks * 7;
		// It is impossible translate months into days without knowing
		// which months you are are talking about, so we have to store
		// it separately.
		this._months = +months +
            quarters * 3 +
            years * 12;

		this._data = {};

		this._locale = locale_locales__getLocale();

		this._bubble();
	}

	function isDuration( obj ) {
		return obj instanceof Duration;
	}

	function offset( token, separator ) {
		addFormatToken( token, 0, 0, function() {
			var offset = this.utcOffset();
			var sign = '+';
			if ( offset < 0 ) {
				offset = -offset;
				sign = '-';
			}
			return sign + zeroFill( ~~( offset / 60 ), 2 ) + separator + zeroFill( ~~( offset ) % 60, 2 );
		} );
	}

	offset( 'Z', ':' );
	offset( 'ZZ', '' );

	// PARSING

	addRegexToken( 'Z', matchOffset );
	addRegexToken( 'ZZ', matchOffset );
	addParseToken( ['Z', 'ZZ'], function( input, array, config ) {
		config._useUTC = true;
		config._tzm = offsetFromString( input );
	} );

	// HELPERS

	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset = /([\+\-]|\d\d)/gi;

	function offsetFromString( string ) {
		var matches = ( ( string || '' ).match( matchOffset ) || [] );
		var chunk = matches[matches.length - 1] || [];
		var parts = ( chunk + '' ).match( chunkOffset ) || ['-', 0, 0];
		var minutes = +( parts[1] * 60 ) + toInt( parts[2] );

		return parts[0] === '+' ? minutes : -minutes;
	}

	// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset( input, model ) {
		var res, diff;
		if ( model._isUTC ) {
			res = model.clone();
			diff = ( isMoment( input ) || isDate( input ) ? +input : +local__createLocal( input ) ) - ( +res );
			// Use low-level api, because this fn is low-level api.
			res._d.setTime( +res._d + diff );
			utils_hooks__hooks.updateOffset( res, false );
			return res;
		} else {
			return local__createLocal( input ).local();
		}
		return model._isUTC ? local__createLocal( input ).zone( model._offset || 0 ) : local__createLocal( input ).local();
	}

	function getDateOffset( m ) {
		// On Firefox.24 Date#getTimezoneOffset returns a floating point.
		// https://github.com/moment/moment/pull/1871
		return -Math.round( m._d.getTimezoneOffset() / 15 ) * 15;
	}

	// HOOKS

	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	utils_hooks__hooks.updateOffset = function() { };

	// MOMENTS

	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset( input, keepLocalTime ) {
		var offset = this._offset || 0,
            localAdjust;
		if ( input != null ) {
			if ( typeof input === 'string' ) {
				input = offsetFromString( input );
			}
			if ( Math.abs( input ) < 16 ) {
				input = input * 60;
			}
			if ( !this._isUTC && keepLocalTime ) {
				localAdjust = getDateOffset( this );
			}
			this._offset = input;
			this._isUTC = true;
			if ( localAdjust != null ) {
				this.add( localAdjust, 'm' );
			}
			if ( offset !== input ) {
				if ( !keepLocalTime || this._changeInProgress ) {
					add_subtract__addSubtract( this, create__createDuration( input - offset, 'm' ), 1, false );
				} else if ( !this._changeInProgress ) {
					this._changeInProgress = true;
					utils_hooks__hooks.updateOffset( this, true );
					this._changeInProgress = null;
				}
			}
			return this;
		} else {
			return this._isUTC ? offset : getDateOffset( this );
		}
	}

	function getSetZone( input, keepLocalTime ) {
		if ( input != null ) {
			if ( typeof input !== 'string' ) {
				input = -input;
			}

			this.utcOffset( input, keepLocalTime );

			return this;
		} else {
			return -this.utcOffset();
		}
	}

	function setOffsetToUTC( keepLocalTime ) {
		return this.utcOffset( 0, keepLocalTime );
	}

	function setOffsetToLocal( keepLocalTime ) {
		if ( this._isUTC ) {
			this.utcOffset( 0, keepLocalTime );
			this._isUTC = false;

			if ( keepLocalTime ) {
				this.subtract( getDateOffset( this ), 'm' );
			}
		}
		return this;
	}

	function setOffsetToParsedOffset() {
		if ( this._tzm ) {
			this.utcOffset( this._tzm );
		} else if ( typeof this._i === 'string' ) {
			this.utcOffset( offsetFromString( this._i ) );
		}
		return this;
	}

	function hasAlignedHourOffset( input ) {
		if ( !input ) {
			input = 0;
		}
		else {
			input = local__createLocal( input ).utcOffset();
		}

		return ( this.utcOffset() - input ) % 60 === 0;
	}

	function isDaylightSavingTime() {
		return (
            this.utcOffset() > this.clone().month( 0 ).utcOffset() ||
            this.utcOffset() > this.clone().month( 5 ).utcOffset()
        );
	}

	function isDaylightSavingTimeShifted() {
		if ( this._a ) {
			var other = this._isUTC ? create_utc__createUTC( this._a ) : local__createLocal( this._a );
			return this.isValid() && compareArrays( this._a, other.toArray() ) > 0;
		}

		return false;
	}

	function isLocal() {
		return !this._isUTC;
	}

	function isUtcOffset() {
		return this._isUTC;
	}

	function isUtc() {
		return this._isUTC && this._offset === 0;
	}

	var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

	// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

	function create__createDuration( input, key ) {
		var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

		if ( isDuration( input ) ) {
			duration = {
				ms: input._milliseconds,
				d: input._days,
				M: input._months
			};
		} else if ( typeof input === 'number' ) {
			duration = {};
			if ( key ) {
				duration[key] = input;
			} else {
				duration.milliseconds = input;
			}
		} else if ( !!( match = aspNetRegex.exec( input ) ) ) {
			sign = ( match[1] === '-' ) ? -1 : 1;
			duration = {
				y: 0,
				d: toInt( match[DATE] ) * sign,
				h: toInt( match[HOUR] ) * sign,
				m: toInt( match[MINUTE] ) * sign,
				s: toInt( match[SECOND] ) * sign,
				ms: toInt( match[MILLISECOND] ) * sign
			};
		} else if ( !!( match = create__isoRegex.exec( input ) ) ) {
			sign = ( match[1] === '-' ) ? -1 : 1;
			duration = {
				y: parseIso( match[2], sign ),
				M: parseIso( match[3], sign ),
				d: parseIso( match[4], sign ),
				h: parseIso( match[5], sign ),
				m: parseIso( match[6], sign ),
				s: parseIso( match[7], sign ),
				w: parseIso( match[8], sign )
			};
		} else if ( duration == null ) {// checks for null or undefined
			duration = {};
		} else if ( typeof duration === 'object' && ( 'from' in duration || 'to' in duration ) ) {
			diffRes = momentsDifference( local__createLocal( duration.from ), local__createLocal( duration.to ) );

			duration = {};
			duration.ms = diffRes.milliseconds;
			duration.M = diffRes.months;
		}

		ret = new Duration( duration );

		if ( isDuration( input ) && hasOwnProp( input, '_locale' ) ) {
			ret._locale = input._locale;
		}

		return ret;
	}

	create__createDuration.fn = Duration.prototype;

	function parseIso( inp, sign ) {
		// We'd normally use ~~inp for this, but unfortunately it also
		// converts floats to ints.
		// inp may be undefined, so careful calling replace on it.
		var res = inp && parseFloat( inp.replace( ',', '.' ) );
		// apply sign while we're at it
		return ( isNaN( res ) ? 0 : res ) * sign;
	}

	function positiveMomentsDifference( base, other ) {
		var res = { milliseconds: 0, months: 0 };

		res.months = other.month() - base.month() +
            ( other.year() - base.year() ) * 12;
		if ( base.clone().add( res.months, 'M' ).isAfter( other ) ) {
			--res.months;
		}

		res.milliseconds = +other - +( base.clone().add( res.months, 'M' ) );

		return res;
	}

	function momentsDifference( base, other ) {
		var res;
		other = cloneWithOffset( other, base );
		if ( base.isBefore( other ) ) {
			res = positiveMomentsDifference( base, other );
		} else {
			res = positiveMomentsDifference( other, base );
			res.milliseconds = -res.milliseconds;
			res.months = -res.months;
		}

		return res;
	}

	function createAdder( direction, name ) {
		return function( val, period ) {
			var dur, tmp;
			//invert the arguments, but complain about it
			if ( period !== null && !isNaN( +period ) ) {
				deprecateSimple( name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).' );
				tmp = val; val = period; period = tmp;
			}

			val = typeof val === 'string' ? +val : val;
			dur = create__createDuration( val, period );
			add_subtract__addSubtract( this, dur, direction );
			return this;
		};
	}

	function add_subtract__addSubtract( mom, duration, isAdding, updateOffset ) {
		var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
		updateOffset = updateOffset == null ? true : updateOffset;

		if ( milliseconds ) {
			mom._d.setTime( +mom._d + milliseconds * isAdding );
		}
		if ( days ) {
			get_set__set( mom, 'Date', get_set__get( mom, 'Date' ) + days * isAdding );
		}
		if ( months ) {
			setMonth( mom, get_set__get( mom, 'Month' ) + months * isAdding );
		}
		if ( updateOffset ) {
			utils_hooks__hooks.updateOffset( mom, days || months );
		}
	}

	var add_subtract__add = createAdder( 1, 'add' );
	var add_subtract__subtract = createAdder( -1, 'subtract' );

	function moment_calendar__calendar( time ) {
		// We want to compare the start of today, vs this.
		// Getting start-of-today depends on whether we're local/utc/offset or not.
		var now = time || local__createLocal(),
            sod = cloneWithOffset( now, this ).startOf( 'day' ),
            diff = this.diff( sod, 'days', true ),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
		return this.format( this.localeData().calendar( format, this, local__createLocal( now ) ) );
	}

	function clone() {
		return new Moment( this );
	}

	function isAfter( input, units ) {
		var inputMs;
		units = normalizeUnits( typeof units !== 'undefined' ? units : 'millisecond' );
		if ( units === 'millisecond' ) {
			input = isMoment( input ) ? input : local__createLocal( input );
			return +this > +input;
		} else {
			inputMs = isMoment( input ) ? +input : +local__createLocal( input );
			return inputMs < +this.clone().startOf( units );
		}
	}

	function isBefore( input, units ) {
		var inputMs;
		units = normalizeUnits( typeof units !== 'undefined' ? units : 'millisecond' );
		if ( units === 'millisecond' ) {
			input = isMoment( input ) ? input : local__createLocal( input );
			return +this < +input;
		} else {
			inputMs = isMoment( input ) ? +input : +local__createLocal( input );
			return +this.clone().endOf( units ) < inputMs;
		}
	}

	function isBetween( from, to, units ) {
		return this.isAfter( from, units ) && this.isBefore( to, units );
	}

	function isSame( input, units ) {
		var inputMs;
		units = normalizeUnits( units || 'millisecond' );
		if ( units === 'millisecond' ) {
			input = isMoment( input ) ? input : local__createLocal( input );
			return +this === +input;
		} else {
			inputMs = +local__createLocal( input );
			return +( this.clone().startOf( units ) ) <= inputMs && inputMs <= +( this.clone().endOf( units ) );
		}
	}

	function absFloor( number ) {
		if ( number < 0 ) {
			return Math.ceil( number );
		} else {
			return Math.floor( number );
		}
	}

	function diff( input, units, asFloat ) {
		var that = cloneWithOffset( input, this ),
            zoneDelta = ( that.utcOffset() - this.utcOffset() ) * 6e4,
            delta, output;

		units = normalizeUnits( units );

		if ( units === 'year' || units === 'month' || units === 'quarter' ) {
			output = monthDiff( this, that );
			if ( units === 'quarter' ) {
				output = output / 3;
			} else if ( units === 'year' ) {
				output = output / 12;
			}
		} else {
			delta = this - that;
			output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? ( delta - zoneDelta ) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? ( delta - zoneDelta ) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
		}
		return asFloat ? output : absFloor( output );
	}

	function monthDiff( a, b ) {
		// difference in months
		var wholeMonthDiff = ( ( b.year() - a.year() ) * 12 ) + ( b.month() - a.month() ),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add( wholeMonthDiff, 'months' ),
            anchor2, adjust;

		if ( b - anchor < 0 ) {
			anchor2 = a.clone().add( wholeMonthDiff - 1, 'months' );
			// linear across the month
			adjust = ( b - anchor ) / ( anchor - anchor2 );
		} else {
			anchor2 = a.clone().add( wholeMonthDiff + 1, 'months' );
			// linear across the month
			adjust = ( b - anchor ) / ( anchor2 - anchor );
		}

		return -( wholeMonthDiff + adjust );
	}

	utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

	function toString() {
		return this.clone().locale( 'en' ).format( 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ' );
	}

	function moment_format__toISOString() {
		var m = this.clone().utc();
		if ( 0 < m.year() && m.year() <= 9999 ) {
			if ( 'function' === typeof Date.prototype.toISOString ) {
				// native implementation is ~50x faster, use it when we can
				return this.toDate().toISOString();
			} else {
				return formatMoment( m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' );
			}
		} else {
			return formatMoment( m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' );
		}
	}

	function format( inputString ) {
		var output = formatMoment( this, inputString || utils_hooks__hooks.defaultFormat );
		return this.localeData().postformat( output );
	}

	function from( time, withoutSuffix ) {
		if ( !this.isValid() ) {
			return this.localeData().invalidDate();
		}
		return create__createDuration( { to: this, from: time } ).locale( this.locale() ).humanize( !withoutSuffix );
	}

	function fromNow( withoutSuffix ) {
		return this.from( local__createLocal(), withoutSuffix );
	}

	function to( time, withoutSuffix ) {
		if ( !this.isValid() ) {
			return this.localeData().invalidDate();
		}
		return create__createDuration( { from: this, to: time } ).locale( this.locale() ).humanize( !withoutSuffix );
	}

	function toNow( withoutSuffix ) {
		return this.to( local__createLocal(), withoutSuffix );
	}

	function locale( key ) {
		var newLocaleData;

		if ( key === undefined ) {
			return this._locale._abbr;
		} else {
			newLocaleData = locale_locales__getLocale( key );
			if ( newLocaleData != null ) {
				this._locale = newLocaleData;
			}
			return this;
		}
	}

	var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function( key ) {
        	if ( key === undefined ) {
        		return this.localeData();
        	} else {
        		return this.locale( key );
        	}
        }
    );

	function localeData() {
		return this._locale;
	}

	function startOf( units ) {
		units = normalizeUnits( units );
		// the following switch intentionally omits break keywords
		// to utilize falling through the cases.
		switch ( units ) {
			case 'year':
				this.month( 0 );
				/* falls through */
			case 'quarter':
			case 'month':
				this.date( 1 );
				/* falls through */
			case 'week':
			case 'isoWeek':
			case 'day':
				this.hours( 0 );
				/* falls through */
			case 'hour':
				this.minutes( 0 );
				/* falls through */
			case 'minute':
				this.seconds( 0 );
				/* falls through */
			case 'second':
				this.milliseconds( 0 );
		}

		// weeks are a special case
		if ( units === 'week' ) {
			this.weekday( 0 );
		}
		if ( units === 'isoWeek' ) {
			this.isoWeekday( 1 );
		}

		// quarters are also special
		if ( units === 'quarter' ) {
			this.month( Math.floor( this.month() / 3 ) * 3 );
		}

		return this;
	}

	function endOf( units ) {
		units = normalizeUnits( units );
		if ( units === undefined || units === 'millisecond' ) {
			return this;
		}
		return this.startOf( units ).add( 1, ( units === 'isoWeek' ? 'week' : units ) ).subtract( 1, 'ms' );
	}

	function to_type__valueOf() {
		return +this._d - ( ( this._offset || 0 ) * 60000 );
	}

	function unix() {
		return Math.floor( +this / 1000 );
	}

	function toDate() {
		return this._offset ? new Date( +this ) : this._d;
	}

	function toArray() {
		var m = this;
		return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	}

	function moment_valid__isValid() {
		return valid__isValid( this );
	}

	function parsingFlags() {
		return extend( {}, getParsingFlags( this ) );
	}

	function invalidAt() {
		return getParsingFlags( this ).overflow;
	}

	addFormatToken( 0, ['gg', 2], 0, function() {
		return this.weekYear() % 100;
	} );

	addFormatToken( 0, ['GG', 2], 0, function() {
		return this.isoWeekYear() % 100;
	} );

	function addWeekYearFormatToken( token, getter ) {
		addFormatToken( 0, [token, token.length], 0, getter );
	}

	addWeekYearFormatToken( 'gggg', 'weekYear' );
	addWeekYearFormatToken( 'ggggg', 'weekYear' );
	addWeekYearFormatToken( 'GGGG', 'isoWeekYear' );
	addWeekYearFormatToken( 'GGGGG', 'isoWeekYear' );

	// ALIASES

	addUnitAlias( 'weekYear', 'gg' );
	addUnitAlias( 'isoWeekYear', 'GG' );

	// PARSING

	addRegexToken( 'G', matchSigned );
	addRegexToken( 'g', matchSigned );
	addRegexToken( 'GG', match1to2, match2 );
	addRegexToken( 'gg', match1to2, match2 );
	addRegexToken( 'GGGG', match1to4, match4 );
	addRegexToken( 'gggg', match1to4, match4 );
	addRegexToken( 'GGGGG', match1to6, match6 );
	addRegexToken( 'ggggg', match1to6, match6 );

	addWeekParseToken( ['gggg', 'ggggg', 'GGGG', 'GGGGG'], function( input, week, config, token ) {
		week[token.substr( 0, 2 )] = toInt( input );
	} );

	addWeekParseToken( ['gg', 'GG'], function( input, week, config, token ) {
		week[token] = utils_hooks__hooks.parseTwoDigitYear( input );
	} );

	// HELPERS

	function weeksInYear( year, dow, doy ) {
		return weekOfYear( local__createLocal( [year, 11, 31 + dow - doy] ), dow, doy ).week;
	}

	// MOMENTS

	function getSetWeekYear( input ) {
		var year = weekOfYear( this, this.localeData()._week.dow, this.localeData()._week.doy ).year;
		return input == null ? year : this.add(( input - year ), 'y' );
	}

	function getSetISOWeekYear( input ) {
		var year = weekOfYear( this, 1, 4 ).year;
		return input == null ? year : this.add(( input - year ), 'y' );
	}

	function getISOWeeksInYear() {
		return weeksInYear( this.year(), 1, 4 );
	}

	function getWeeksInYear() {
		var weekInfo = this.localeData()._week;
		return weeksInYear( this.year(), weekInfo.dow, weekInfo.doy );
	}

	addFormatToken( 'Q', 0, 0, 'quarter' );

	// ALIASES

	addUnitAlias( 'quarter', 'Q' );

	// PARSING

	addRegexToken( 'Q', match1 );
	addParseToken( 'Q', function( input, array ) {
		array[MONTH] = ( toInt( input ) - 1 ) * 3;
	} );

	// MOMENTS

	function getSetQuarter( input ) {
		return input == null ? Math.ceil(( this.month() + 1 ) / 3 ) : this.month(( input - 1 ) * 3 + this.month() % 3 );
	}

	addFormatToken( 'D', ['DD', 2], 'Do', 'date' );

	// ALIASES

	addUnitAlias( 'date', 'D' );

	// PARSING

	addRegexToken( 'D', match1to2 );
	addRegexToken( 'DD', match1to2, match2 );
	addRegexToken( 'Do', function( isStrict, locale ) {
		return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	} );

	addParseToken( ['D', 'DD'], DATE );
	addParseToken( 'Do', function( input, array ) {
		array[DATE] = toInt( input.match( match1to2 )[0], 10 );
	} );

	// MOMENTS

	var getSetDayOfMonth = makeGetSet( 'Date', true );

	addFormatToken( 'd', 0, 'do', 'day' );

	addFormatToken( 'dd', 0, 0, function( format ) {
		return this.localeData().weekdaysMin( this, format );
	} );

	addFormatToken( 'ddd', 0, 0, function( format ) {
		return this.localeData().weekdaysShort( this, format );
	} );

	addFormatToken( 'dddd', 0, 0, function( format ) {
		return this.localeData().weekdays( this, format );
	} );

	addFormatToken( 'e', 0, 0, 'weekday' );
	addFormatToken( 'E', 0, 0, 'isoWeekday' );

	// ALIASES

	addUnitAlias( 'day', 'd' );
	addUnitAlias( 'weekday', 'e' );
	addUnitAlias( 'isoWeekday', 'E' );

	// PARSING

	addRegexToken( 'd', match1to2 );
	addRegexToken( 'e', match1to2 );
	addRegexToken( 'E', match1to2 );
	addRegexToken( 'dd', matchWord );
	addRegexToken( 'ddd', matchWord );
	addRegexToken( 'dddd', matchWord );

	addWeekParseToken( ['dd', 'ddd', 'dddd'], function( input, week, config ) {
		var weekday = config._locale.weekdaysParse( input );
		// if we didn't get a weekday name, mark the date as invalid
		if ( weekday != null ) {
			week.d = weekday;
		} else {
			getParsingFlags( config ).invalidWeekday = input;
		}
	} );

	addWeekParseToken( ['d', 'e', 'E'], function( input, week, config, token ) {
		week[token] = toInt( input );
	} );

	// HELPERS

	function parseWeekday( input, locale ) {
		if ( typeof input === 'string' ) {
			if ( !isNaN( input ) ) {
				input = parseInt( input, 10 );
			}
			else {
				input = locale.weekdaysParse( input );
				if ( typeof input !== 'number' ) {
					return null;
				}
			}
		}
		return input;
	}

	// LOCALES

	var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split( '_' );
	function localeWeekdays( m ) {
		return this._weekdays[m.day()];
	}

	var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split( '_' );
	function localeWeekdaysShort( m ) {
		return this._weekdaysShort[m.day()];
	}

	var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split( '_' );
	function localeWeekdaysMin( m ) {
		return this._weekdaysMin[m.day()];
	}

	function localeWeekdaysParse( weekdayName ) {
		var i, mom, regex;

		if ( !this._weekdaysParse ) {
			this._weekdaysParse = [];
		}

		for ( i = 0; i < 7; i++ ) {
			// make the regex if we don't have it already
			if ( !this._weekdaysParse[i] ) {
				mom = local__createLocal( [2000, 1] ).day( i );
				regex = '^' + this.weekdays( mom, '' ) + '|^' + this.weekdaysShort( mom, '' ) + '|^' + this.weekdaysMin( mom, '' );
				this._weekdaysParse[i] = new RegExp( regex.replace( '.', '' ), 'i' );
			}
			// test the regex
			if ( this._weekdaysParse[i].test( weekdayName ) ) {
				return i;
			}
		}
	}

	// MOMENTS

	function getSetDayOfWeek( input ) {
		var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
		if ( input != null ) {
			input = parseWeekday( input, this.localeData() );
			return this.add( input - day, 'd' );
		} else {
			return day;
		}
	}

	function getSetLocaleDayOfWeek( input ) {
		var weekday = ( this.day() + 7 - this.localeData()._week.dow ) % 7;
		return input == null ? weekday : this.add( input - weekday, 'd' );
	}

	function getSetISODayOfWeek( input ) {
		// behaves the same as moment#day except
		// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
		// as a setter, sunday should belong to the previous week.
		return input == null ? this.day() || 7 : this.day( this.day() % 7 ? input : input - 7 );
	}

	addFormatToken( 'H', ['HH', 2], 0, 'hour' );
	addFormatToken( 'h', ['hh', 2], 0, function() {
		return this.hours() % 12 || 12;
	} );

	function meridiem( token, lowercase ) {
		addFormatToken( token, 0, 0, function() {
			return this.localeData().meridiem( this.hours(), this.minutes(), lowercase );
		} );
	}

	meridiem( 'a', true );
	meridiem( 'A', false );

	// ALIASES

	addUnitAlias( 'hour', 'h' );

	// PARSING

	function matchMeridiem( isStrict, locale ) {
		return locale._meridiemParse;
	}

	addRegexToken( 'a', matchMeridiem );
	addRegexToken( 'A', matchMeridiem );
	addRegexToken( 'H', match1to2 );
	addRegexToken( 'h', match1to2 );
	addRegexToken( 'HH', match1to2, match2 );
	addRegexToken( 'hh', match1to2, match2 );

	addParseToken( ['H', 'HH'], HOUR );
	addParseToken( ['a', 'A'], function( input, array, config ) {
		config._isPm = config._locale.isPM( input );
		config._meridiem = input;
	} );
	addParseToken( ['h', 'hh'], function( input, array, config ) {
		array[HOUR] = toInt( input );
		getParsingFlags( config ).bigHour = true;
	} );

	// LOCALES

	function localeIsPM( input ) {
		// IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
		// Using charAt should be more compatible.
		return ( ( input + '' ).toLowerCase().charAt( 0 ) === 'p' );
	}

	var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	function localeMeridiem( hours, minutes, isLower ) {
		if ( hours > 11 ) {
			return isLower ? 'pm' : 'PM';
		} else {
			return isLower ? 'am' : 'AM';
		}
	}


	// MOMENTS

	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour = makeGetSet( 'Hours', true );

	addFormatToken( 'm', ['mm', 2], 0, 'minute' );

	// ALIASES

	addUnitAlias( 'minute', 'm' );

	// PARSING

	addRegexToken( 'm', match1to2 );
	addRegexToken( 'mm', match1to2, match2 );
	addParseToken( ['m', 'mm'], MINUTE );

	// MOMENTS

	var getSetMinute = makeGetSet( 'Minutes', false );

	addFormatToken( 's', ['ss', 2], 0, 'second' );

	// ALIASES

	addUnitAlias( 'second', 's' );

	// PARSING

	addRegexToken( 's', match1to2 );
	addRegexToken( 'ss', match1to2, match2 );
	addParseToken( ['s', 'ss'], SECOND );

	// MOMENTS

	var getSetSecond = makeGetSet( 'Seconds', false );

	addFormatToken( 'S', 0, 0, function() {
		return ~~( this.millisecond() / 100 );
	} );

	addFormatToken( 0, ['SS', 2], 0, function() {
		return ~~( this.millisecond() / 10 );
	} );

	function millisecond__milliseconds( token ) {
		addFormatToken( 0, [token, 3], 0, 'millisecond' );
	}

	millisecond__milliseconds( 'SSS' );
	millisecond__milliseconds( 'SSSS' );

	// ALIASES

	addUnitAlias( 'millisecond', 'ms' );

	// PARSING

	addRegexToken( 'S', match1to3, match1 );
	addRegexToken( 'SS', match1to3, match2 );
	addRegexToken( 'SSS', match1to3, match3 );
	addRegexToken( 'SSSS', matchUnsigned );
	addParseToken( ['S', 'SS', 'SSS', 'SSSS'], function( input, array ) {
		array[MILLISECOND] = toInt(( '0.' + input ) * 1000 );
	} );

	// MOMENTS

	var getSetMillisecond = makeGetSet( 'Milliseconds', false );

	addFormatToken( 'z', 0, 0, 'zoneAbbr' );
	addFormatToken( 'zz', 0, 0, 'zoneName' );

	// MOMENTS

	function getZoneAbbr() {
		return this._isUTC ? 'UTC' : '';
	}

	function getZoneName() {
		return this._isUTC ? 'Coordinated Universal Time' : '';
	}

	var momentPrototype__proto = Moment.prototype;

	momentPrototype__proto.add = add_subtract__add;
	momentPrototype__proto.calendar = moment_calendar__calendar;
	momentPrototype__proto.clone = clone;
	momentPrototype__proto.diff = diff;
	momentPrototype__proto.endOf = endOf;
	momentPrototype__proto.format = format;
	momentPrototype__proto.from = from;
	momentPrototype__proto.fromNow = fromNow;
	momentPrototype__proto.to = to;
	momentPrototype__proto.toNow = toNow;
	momentPrototype__proto.get = getSet;
	momentPrototype__proto.invalidAt = invalidAt;
	momentPrototype__proto.isAfter = isAfter;
	momentPrototype__proto.isBefore = isBefore;
	momentPrototype__proto.isBetween = isBetween;
	momentPrototype__proto.isSame = isSame;
	momentPrototype__proto.isValid = moment_valid__isValid;
	momentPrototype__proto.lang = lang;
	momentPrototype__proto.locale = locale;
	momentPrototype__proto.localeData = localeData;
	momentPrototype__proto.max = prototypeMax;
	momentPrototype__proto.min = prototypeMin;
	momentPrototype__proto.parsingFlags = parsingFlags;
	momentPrototype__proto.set = getSet;
	momentPrototype__proto.startOf = startOf;
	momentPrototype__proto.subtract = add_subtract__subtract;
	momentPrototype__proto.toArray = toArray;
	momentPrototype__proto.toDate = toDate;
	momentPrototype__proto.toISOString = moment_format__toISOString;
	momentPrototype__proto.toJSON = moment_format__toISOString;
	momentPrototype__proto.toString = toString;
	momentPrototype__proto.unix = unix;
	momentPrototype__proto.valueOf = to_type__valueOf;

	// Year
	momentPrototype__proto.year = getSetYear;
	momentPrototype__proto.isLeapYear = getIsLeapYear;

	// Week Year
	momentPrototype__proto.weekYear = getSetWeekYear;
	momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

	// Quarter
	momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

	// Month
	momentPrototype__proto.month = getSetMonth;
	momentPrototype__proto.daysInMonth = getDaysInMonth;

	// Week
	momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
	momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
	momentPrototype__proto.weeksInYear = getWeeksInYear;
	momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

	// Day
	momentPrototype__proto.date = getSetDayOfMonth;
	momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
	momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
	momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
	momentPrototype__proto.dayOfYear = getSetDayOfYear;

	// Hour
	momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

	// Minute
	momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

	// Second
	momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

	// Millisecond
	momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

	// Offset
	momentPrototype__proto.utcOffset = getSetOffset;
	momentPrototype__proto.utc = setOffsetToUTC;
	momentPrototype__proto.local = setOffsetToLocal;
	momentPrototype__proto.parseZone = setOffsetToParsedOffset;
	momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
	momentPrototype__proto.isDST = isDaylightSavingTime;
	momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
	momentPrototype__proto.isLocal = isLocal;
	momentPrototype__proto.isUtcOffset = isUtcOffset;
	momentPrototype__proto.isUtc = isUtc;
	momentPrototype__proto.isUTC = isUtc;

	// Timezone
	momentPrototype__proto.zoneAbbr = getZoneAbbr;
	momentPrototype__proto.zoneName = getZoneName;

	// Deprecations
	momentPrototype__proto.dates = deprecate( 'dates accessor is deprecated. Use date instead.', getSetDayOfMonth );
	momentPrototype__proto.months = deprecate( 'months accessor is deprecated. Use month instead', getSetMonth );
	momentPrototype__proto.years = deprecate( 'years accessor is deprecated. Use year instead', getSetYear );
	momentPrototype__proto.zone = deprecate( 'moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone );

	var momentPrototype = momentPrototype__proto;

	function moment__createUnix( input ) {
		return local__createLocal( input * 1000 );
	}

	function moment__createInZone() {
		return local__createLocal.apply( null, arguments ).parseZone();
	}

	var defaultCalendar = {
		sameDay: '[Today at] LT',
		nextDay: '[Tomorrow at] LT',
		nextWeek: 'dddd [at] LT',
		lastDay: '[Yesterday at] LT',
		lastWeek: '[Last] dddd [at] LT',
		sameElse: 'L'
	};

	function locale_calendar__calendar( key, mom, now ) {
		var output = this._calendar[key];
		return typeof output === 'function' ? output.call( mom, now ) : output;
	}

	var defaultLongDateFormat = {
		LTS: 'h:mm:ss A',
		LT: 'h:mm A',
		L: 'MM/DD/YYYY',
		LL: 'MMMM D, YYYY',
		LLL: 'MMMM D, YYYY LT',
		LLLL: 'dddd, MMMM D, YYYY LT'
	};

	function longDateFormat( key ) {
		var output = this._longDateFormat[key];
		if ( !output && this._longDateFormat[key.toUpperCase()] ) {
			output = this._longDateFormat[key.toUpperCase()].replace( /MMMM|MM|DD|dddd/g, function( val ) {
				return val.slice( 1 );
			} );
			this._longDateFormat[key] = output;
		}
		return output;
	}

	var defaultInvalidDate = 'Invalid date';

	function invalidDate() {
		return this._invalidDate;
	}

	var defaultOrdinal = '%d';
	var defaultOrdinalParse = /\d{1,2}/;

	function ordinal( number ) {
		return this._ordinal.replace( '%d', number );
	}

	function preParsePostFormat( string ) {
		return string;
	}

	var defaultRelativeTime = {
		future: 'in %s',
		past: '%s ago',
		s: 'a few seconds',
		m: 'a minute',
		mm: '%d minutes',
		h: 'an hour',
		hh: '%d hours',
		d: 'a day',
		dd: '%d days',
		M: 'a month',
		MM: '%d months',
		y: 'a year',
		yy: '%d years'
	};

	function relative__relativeTime( number, withoutSuffix, string, isFuture ) {
		var output = this._relativeTime[string];
		return ( typeof output === 'function' ) ?
            output( number, withoutSuffix, string, isFuture ) :
            output.replace( /%d/i, number );
	}

	function pastFuture( diff, output ) {
		var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
		return typeof format === 'function' ? format( output ) : format.replace( /%s/i, output );
	}

	function locale_set__set( config ) {
		var prop, i;
		for ( i in config ) {
			prop = config[i];
			if ( typeof prop === 'function' ) {
				this[i] = prop;
			} else {
				this['_' + i] = prop;
			}
		}
		// Lenient ordinal parsing accepts just a number in addition to
		// number + (possibly) stuff coming from _ordinalParseLenient.
		this._ordinalParseLenient = new RegExp( this._ordinalParse.source + '|' + ( /\d{1,2}/ ).source );
	}

	var prototype__proto = Locale.prototype;

	prototype__proto._calendar = defaultCalendar;
	prototype__proto.calendar = locale_calendar__calendar;
	prototype__proto._longDateFormat = defaultLongDateFormat;
	prototype__proto.longDateFormat = longDateFormat;
	prototype__proto._invalidDate = defaultInvalidDate;
	prototype__proto.invalidDate = invalidDate;
	prototype__proto._ordinal = defaultOrdinal;
	prototype__proto.ordinal = ordinal;
	prototype__proto._ordinalParse = defaultOrdinalParse;
	prototype__proto.preparse = preParsePostFormat;
	prototype__proto.postformat = preParsePostFormat;
	prototype__proto._relativeTime = defaultRelativeTime;
	prototype__proto.relativeTime = relative__relativeTime;
	prototype__proto.pastFuture = pastFuture;
	prototype__proto.set = locale_set__set;

	// Month
	prototype__proto.months = localeMonths;
	prototype__proto._months = defaultLocaleMonths;
	prototype__proto.monthsShort = localeMonthsShort;
	prototype__proto._monthsShort = defaultLocaleMonthsShort;
	prototype__proto.monthsParse = localeMonthsParse;

	// Week
	prototype__proto.week = localeWeek;
	prototype__proto._week = defaultLocaleWeek;
	prototype__proto.firstDayOfYear = localeFirstDayOfYear;
	prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

	// Day of Week
	prototype__proto.weekdays = localeWeekdays;
	prototype__proto._weekdays = defaultLocaleWeekdays;
	prototype__proto.weekdaysMin = localeWeekdaysMin;
	prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
	prototype__proto.weekdaysShort = localeWeekdaysShort;
	prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
	prototype__proto.weekdaysParse = localeWeekdaysParse;

	// Hours
	prototype__proto.isPM = localeIsPM;
	prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
	prototype__proto.meridiem = localeMeridiem;

	function lists__get( format, index, field, setter ) {
		var locale = locale_locales__getLocale();
		var utc = create_utc__createUTC().set( setter, index );
		return locale[field]( utc, format );
	}

	function list( format, index, field, count, setter ) {
		if ( typeof format === 'number' ) {
			index = format;
			format = undefined;
		}

		format = format || '';

		if ( index != null ) {
			return lists__get( format, index, field, setter );
		}

		var i;
		var out = [];
		for ( i = 0; i < count; i++ ) {
			out[i] = lists__get( format, i, field, setter );
		}
		return out;
	}

	function lists__listMonths( format, index ) {
		return list( format, index, 'months', 12, 'month' );
	}

	function lists__listMonthsShort( format, index ) {
		return list( format, index, 'monthsShort', 12, 'month' );
	}

	function lists__listWeekdays( format, index ) {
		return list( format, index, 'weekdays', 7, 'day' );
	}

	function lists__listWeekdaysShort( format, index ) {
		return list( format, index, 'weekdaysShort', 7, 'day' );
	}

	function lists__listWeekdaysMin( format, index ) {
		return list( format, index, 'weekdaysMin', 7, 'day' );
	}

	locale_locales__getSetGlobalLocale( 'en', {
		ordinalParse: /\d{1,2}(th|st|nd|rd)/,
		ordinal: function( number ) {
			var b = number % 10,
                output = ( toInt( number % 100 / 10 ) === 1 ) ? 'th' :
                ( b === 1 ) ? 'st' :
                ( b === 2 ) ? 'nd' :
                ( b === 3 ) ? 'rd' : 'th';
			return number + output;
		}
	} );

	// Side effect imports
	utils_hooks__hooks.lang = deprecate( 'moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale );
	utils_hooks__hooks.langData = deprecate( 'moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale );

	var mathAbs = Math.abs;

	function duration_abs__abs() {
		var data = this._data;

		this._milliseconds = mathAbs( this._milliseconds );
		this._days = mathAbs( this._days );
		this._months = mathAbs( this._months );

		data.milliseconds = mathAbs( data.milliseconds );
		data.seconds = mathAbs( data.seconds );
		data.minutes = mathAbs( data.minutes );
		data.hours = mathAbs( data.hours );
		data.months = mathAbs( data.months );
		data.years = mathAbs( data.years );

		return this;
	}

	function duration_add_subtract__addSubtract( duration, input, value, direction ) {
		var other = create__createDuration( input, value );

		duration._milliseconds += direction * other._milliseconds;
		duration._days += direction * other._days;
		duration._months += direction * other._months;

		return duration._bubble();
	}

	// supports only 2.0-style add(1, 's') or add(duration)
	function duration_add_subtract__add( input, value ) {
		return duration_add_subtract__addSubtract( this, input, value, 1 );
	}

	// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function duration_add_subtract__subtract( input, value ) {
		return duration_add_subtract__addSubtract( this, input, value, -1 );
	}

	function bubble() {
		var milliseconds = this._milliseconds;
		var days = this._days;
		var months = this._months;
		var data = this._data;
		var seconds, minutes, hours, years = 0;

		// The following code bubbles up values, see the tests for
		// examples of what that means.
		data.milliseconds = milliseconds % 1000;

		seconds = absFloor( milliseconds / 1000 );
		data.seconds = seconds % 60;

		minutes = absFloor( seconds / 60 );
		data.minutes = minutes % 60;

		hours = absFloor( minutes / 60 );
		data.hours = hours % 24;

		days += absFloor( hours / 24 );

		// Accurately convert days to years, assume start from year 0.
		years = absFloor( daysToYears( days ) );
		days -= absFloor( yearsToDays( years ) );

		// 30 days to a month
		// TODO (iskren): Use anchor date (like 1st Jan) to compute this.
		months += absFloor( days / 30 );
		days %= 30;

		// 12 months -> 1 year
		years += absFloor( months / 12 );
		months %= 12;

		data.days = days;
		data.months = months;
		data.years = years;

		return this;
	}

	function daysToYears( days ) {
		// 400 years have 146097 days (taking into account leap year rules)
		return days * 400 / 146097;
	}

	function yearsToDays( years ) {
		// years * 365 + absFloor(years / 4) -
		//     absFloor(years / 100) + absFloor(years / 400);
		return years * 146097 / 400;
	}

	function as( units ) {
		var days;
		var months;
		var milliseconds = this._milliseconds;

		units = normalizeUnits( units );

		if ( units === 'month' || units === 'year' ) {
			days = this._days + milliseconds / 864e5;
			months = this._months + daysToYears( days ) * 12;
			return units === 'month' ? months : months / 12;
		} else {
			// handle milliseconds separately because of floating point math errors (issue #1867)
			days = this._days + Math.round( yearsToDays( this._months / 12 ) );
			switch ( units ) {
				case 'week': return days / 7 + milliseconds / 6048e5;
				case 'day': return days + milliseconds / 864e5;
				case 'hour': return days * 24 + milliseconds / 36e5;
				case 'minute': return days * 1440 + milliseconds / 6e4;
				case 'second': return days * 86400 + milliseconds / 1000;
					// Math.floor prevents floating point math errors here
				case 'millisecond': return Math.floor( days * 864e5 ) + milliseconds;
				default: throw new Error( 'Unknown unit ' + units );
			}
		}
	}

	// TODO: Use this.as('ms')?
	function duration_as__valueOf() {
		return (
            this._milliseconds +
            this._days * 864e5 +
            ( this._months % 12 ) * 2592e6 +
            toInt( this._months / 12 ) * 31536e6
        );
	}

	function makeAs( alias ) {
		return function() {
			return this.as( alias );
		};
	}

	var asMilliseconds = makeAs( 'ms' );
	var asSeconds = makeAs( 's' );
	var asMinutes = makeAs( 'm' );
	var asHours = makeAs( 'h' );
	var asDays = makeAs( 'd' );
	var asWeeks = makeAs( 'w' );
	var asMonths = makeAs( 'M' );
	var asYears = makeAs( 'y' );

	function duration_get__get( units ) {
		units = normalizeUnits( units );
		return this[units + 's']();
	}

	function makeGetter( name ) {
		return function() {
			return this._data[name];
		};
	}

	var duration_get__milliseconds = makeGetter( 'milliseconds' );
	var seconds = makeGetter( 'seconds' );
	var minutes = makeGetter( 'minutes' );
	var hours = makeGetter( 'hours' );
	var days = makeGetter( 'days' );
	var months = makeGetter( 'months' );
	var years = makeGetter( 'years' );

	function weeks() {
		return absFloor( this.days() / 7 );
	}

	var round = Math.round;
	var thresholds = {
		s: 45,  // seconds to minute
		m: 45,  // minutes to hour
		h: 22,  // hours to day
		d: 26,  // days to month
		M: 11   // months to year
	};

	// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo( string, number, withoutSuffix, isFuture, locale ) {
		return locale.relativeTime( number || 1, !!withoutSuffix, string, isFuture );
	}

	function duration_humanize__relativeTime( posNegDuration, withoutSuffix, locale ) {
		var duration = create__createDuration( posNegDuration ).abs();
		var seconds = round( duration.as( 's' ) );
		var minutes = round( duration.as( 'm' ) );
		var hours = round( duration.as( 'h' ) );
		var days = round( duration.as( 'd' ) );
		var months = round( duration.as( 'M' ) );
		var years = round( duration.as( 'y' ) );

		var a = seconds < thresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < thresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < thresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < thresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

		a[2] = withoutSuffix;
		a[3] = +posNegDuration > 0;
		a[4] = locale;
		return substituteTimeAgo.apply( null, a );
	}

	// This function allows you to set a threshold for relative time strings
	function duration_humanize__getSetRelativeTimeThreshold( threshold, limit ) {
		if ( thresholds[threshold] === undefined ) {
			return false;
		}
		if ( limit === undefined ) {
			return thresholds[threshold];
		}
		thresholds[threshold] = limit;
		return true;
	}

	function humanize( withSuffix ) {
		var locale = this.localeData();
		var output = duration_humanize__relativeTime( this, !withSuffix, locale );

		if ( withSuffix ) {
			output = locale.pastFuture( +this, output );
		}

		return locale.postformat( output );
	}

	var iso_string__abs = Math.abs;

	function iso_string__toISOString() {
		// inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
		var Y = iso_string__abs( this.years() );
		var M = iso_string__abs( this.months() );
		var D = iso_string__abs( this.days() );
		var h = iso_string__abs( this.hours() );
		var m = iso_string__abs( this.minutes() );
		var s = iso_string__abs( this.seconds() + this.milliseconds() / 1000 );
		var total = this.asSeconds();

		if ( !total ) {
			// this is the same as C#'s (Noda) and python (isodate)...
			// but not other JS (goog.date)
			return 'P0D';
		}

		return ( total < 0 ? '-' : '' ) +
            'P' +
            ( Y ? Y + 'Y' : '' ) +
            ( M ? M + 'M' : '' ) +
            ( D ? D + 'D' : '' ) +
            ( ( h || m || s ) ? 'T' : '' ) +
            ( h ? h + 'H' : '' ) +
            ( m ? m + 'M' : '' ) +
            ( s ? s + 'S' : '' );
	}

	var duration_prototype__proto = Duration.prototype;

	duration_prototype__proto.abs = duration_abs__abs;
	duration_prototype__proto.add = duration_add_subtract__add;
	duration_prototype__proto.subtract = duration_add_subtract__subtract;
	duration_prototype__proto.as = as;
	duration_prototype__proto.asMilliseconds = asMilliseconds;
	duration_prototype__proto.asSeconds = asSeconds;
	duration_prototype__proto.asMinutes = asMinutes;
	duration_prototype__proto.asHours = asHours;
	duration_prototype__proto.asDays = asDays;
	duration_prototype__proto.asWeeks = asWeeks;
	duration_prototype__proto.asMonths = asMonths;
	duration_prototype__proto.asYears = asYears;
	duration_prototype__proto.valueOf = duration_as__valueOf;
	duration_prototype__proto._bubble = bubble;
	duration_prototype__proto.get = duration_get__get;
	duration_prototype__proto.milliseconds = duration_get__milliseconds;
	duration_prototype__proto.seconds = seconds;
	duration_prototype__proto.minutes = minutes;
	duration_prototype__proto.hours = hours;
	duration_prototype__proto.days = days;
	duration_prototype__proto.weeks = weeks;
	duration_prototype__proto.months = months;
	duration_prototype__proto.years = years;
	duration_prototype__proto.humanize = humanize;
	duration_prototype__proto.toISOString = iso_string__toISOString;
	duration_prototype__proto.toString = iso_string__toISOString;
	duration_prototype__proto.toJSON = iso_string__toISOString;
	duration_prototype__proto.locale = locale;
	duration_prototype__proto.localeData = localeData;

	// Deprecations
	duration_prototype__proto.toIsoString = deprecate( 'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString );
	duration_prototype__proto.lang = lang;

	// Side effect imports

	addFormatToken( 'X', 0, 0, 'unix' );
	addFormatToken( 'x', 0, 0, 'valueOf' );

	// PARSING

	addRegexToken( 'x', matchSigned );
	addRegexToken( 'X', matchTimestamp );
	addParseToken( 'X', function( input, array, config ) {
		config._d = new Date( parseFloat( input, 10 ) * 1000 );
	} );
	addParseToken( 'x', function( input, array, config ) {
		config._d = new Date( toInt( input ) );
	} );

	// Side effect imports


	utils_hooks__hooks.version = '2.10.3';

	setHookCallback( local__createLocal );

	utils_hooks__hooks.fn = momentPrototype;
	utils_hooks__hooks.min = min;
	utils_hooks__hooks.max = max;
	utils_hooks__hooks.utc = create_utc__createUTC;
	utils_hooks__hooks.unix = moment__createUnix;
	utils_hooks__hooks.months = lists__listMonths;
	utils_hooks__hooks.isDate = isDate;
	utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
	utils_hooks__hooks.invalid = valid__createInvalid;
	utils_hooks__hooks.duration = create__createDuration;
	utils_hooks__hooks.isMoment = isMoment;
	utils_hooks__hooks.weekdays = lists__listWeekdays;
	utils_hooks__hooks.parseZone = moment__createInZone;
	utils_hooks__hooks.localeData = locale_locales__getLocale;
	utils_hooks__hooks.isDuration = isDuration;
	utils_hooks__hooks.monthsShort = lists__listMonthsShort;
	utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
	utils_hooks__hooks.defineLocale = defineLocale;
	utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
	utils_hooks__hooks.normalizeUnits = normalizeUnits;
	utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

	var _moment = utils_hooks__hooks;

	return _moment;

} ) );
/*jshint ignore:end */
/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */
/* jshint ignore:start */
( function( root, factory ) {
	'use strict';

	var moment;
	if ( typeof exports === 'object' ) {
		// CommonJS module
		// Load moment.js as an optional dependency
		try { moment = require( 'moment' ); } catch ( e ) { }
		module.exports = factory( moment );
	} else if ( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define( function( req ) {
			// Load moment.js as an optional dependency
			var id = 'moment';
			try { moment = req( id ); } catch ( e ) { }
			return factory( moment );
		} );
	} else {
		root.Pikaday = factory( root.moment );
	}
}( this, function( moment ) {
	'use strict';

	/**
     * feature detection and helper functions
     */
	var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function( el, e, callback, capture ) {
    	if ( hasEventListeners ) {
    		el.addEventListener( e, callback, !!capture );
    	} else {
    		el.attachEvent( 'on' + e, callback );
    	}
    },

    removeEvent = function( el, e, callback, capture ) {
    	if ( hasEventListeners ) {
    		el.removeEventListener( e, callback, !!capture );
    	} else {
    		el.detachEvent( 'on' + e, callback );
    	}
    },

    fireEvent = function( el, eventName, data ) {
    	var ev;

    	if ( document.createEvent ) {
    		ev = document.createEvent( 'HTMLEvents' );
    		ev.initEvent( eventName, true, false );
    		ev = extend( ev, data );
    		el.dispatchEvent( ev );
    	} else if ( document.createEventObject ) {
    		ev = document.createEventObject();
    		ev = extend( ev, data );
    		el.fireEvent( 'on' + eventName, ev );
    	}
    },

    trim = function( str ) {
    	return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, '' );
    },

    hasClass = function( el, cn ) {
    	return ( ' ' + el.className + ' ' ).indexOf( ' ' + cn + ' ' ) !== -1;
    },

    addClass = function( el, cn ) {
    	if ( !hasClass( el, cn ) ) {
    		el.className = ( el.className === '' ) ? cn : el.className + ' ' + cn;
    	}
    },

    removeClass = function( el, cn ) {
    	el.className = trim(( ' ' + el.className + ' ' ).replace( ' ' + cn + ' ', ' ' ) );
    },

    isArray = function( obj ) {
    	return ( /Array/ ).test( Object.prototype.toString.call( obj ) );
    },

    isDate = function( obj ) {
    	return ( /Date/ ).test( Object.prototype.toString.call( obj ) ) && !isNaN( obj.getTime() );
    },

    isWeekend = function( date ) {
    	var day = date.getDay();
    	return day === 0 || day === 6;
    },

    isLeapYear = function( year ) {
    	// solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
    	return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function( year, month ) {
    	return [31, isLeapYear( year ) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function( date ) {
    	if ( isDate( date ) ) date.setHours( 0, 0, 0, 0 );
    },

    compareDates = function( a, b ) {
    	// weak date comparison (use setToStartOfDay(date) to ensure correct result)
    	return a.getTime() === b.getTime();
    },

    extend = function( to, from, overwrite ) {
    	var prop, hasProp;
    	for ( prop in from ) {
    		hasProp = to[prop] !== undefined;
    		if ( hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined ) {
    			if ( isDate( from[prop] ) ) {
    				if ( overwrite ) {
    					to[prop] = new Date( from[prop].getTime() );
    				}
    			}
    			else if ( isArray( from[prop] ) ) {
    				if ( overwrite ) {
    					to[prop] = from[prop].slice( 0 );
    				}
    			} else {
    				to[prop] = extend( {}, from[prop], overwrite );
    			}
    		} else if ( overwrite || !hasProp ) {
    			to[prop] = from[prop];
    		}
    	}
    	return to;
    },

    adjustCalendar = function( calendar ) {
    	if ( calendar.month < 0 ) {
    		calendar.year -= Math.ceil( Math.abs( calendar.month ) / 12 );
    		calendar.month += 12;
    	}
    	if ( calendar.month > 11 ) {
    		calendar.year += Math.floor( Math.abs( calendar.month ) / 12 );
    		calendar.month -= 12;
    	}
    	return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

    	// bind the picker to a form field
    	field: null,

    	// automatically show/hide the picker on `field` focus (default `true` if `field` is set)
    	bound: undefined,

    	// position of the datepicker, relative to the field (default to bottom & left)
    	// ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
    	position: 'bottom left',

    	// automatically fit in the viewport even if it means repositioning from the position option
    	reposition: true,

    	// the default output format for `.toString()` and `field` value
    	format: 'YYYY-MM-DD',

    	// the initial date to view when first opened
    	defaultDate: null,

    	// make the `defaultDate` the initial selected value
    	setDefaultDate: false,

    	// first day of week (0: Sunday, 1: Monday etc)
    	firstDay: 0,

    	// the minimum/earliest date that can be selected
    	minDate: null,
    	// the maximum/latest date that can be selected
    	maxDate: null,

    	// number of years either side, or array of upper/lower range
    	yearRange: 10,

    	// show week numbers at head of row
    	showWeekNumber: false,

    	// used internally (don't config outside)
    	minYear: 0,
    	maxYear: 9999,
    	minMonth: undefined,
    	maxMonth: undefined,

    	isRTL: false,

    	// Additional text to append to the year in the calendar title
    	yearSuffix: '',

    	// Render the month after year in the calendar title
    	showMonthAfterYear: false,

    	// how many months are visible
    	numberOfMonths: 1,

    	// when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
    	// only used for the first display or when a selected date is not visible
    	mainCalendar: 'left',

    	// Specify a DOM element to render the calendar in
    	container: undefined,

    	// internationalization
    	i18n: {
    		previousMonth: 'Previous Month',
    		nextMonth: 'Next Month',
    		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    		weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    		weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    	},

    	// callback function
    	onSelect: null,
    	onOpen: null,
    	onClose: null,
    	onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function( opts, day, abbr ) {
    	day += opts.firstDay;
    	while ( day >= 7 ) {
    		day -= 7;
    	}
    	return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function( d, m, y, isSelected, isToday, isDisabled, isEmpty ) {
    	if ( isEmpty ) {
    		return '<td class="is-empty"></td>';
    	}
    	var arr = [];
    	if ( isDisabled ) {
    		arr.push( 'is-disabled' );
    	}
    	if ( isToday ) {
    		arr.push( 'is-today' );
    	}
    	if ( isSelected ) {
    		arr.push( 'is-selected' );
    	}
    	return '<td data-day="' + d + '" class="' + arr.join( ' ' ) + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + y + '" data-pika-month="' + m + '" data-pika-day="' + d + '">' +
                        d +
                 '</button>' +
               '</td>';
    },

    renderWeek = function( d, m, y ) {
    	// Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
    	var onejan = new Date( y, 0, 1 ),
            weekNum = Math.ceil(( ( ( new Date( y, m, d ) - onejan ) / 86400000 ) + onejan.getDay() + 1 ) / 7 );
    	return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function( days, isRTL ) {
    	return '<tr>' + ( isRTL ? days.reverse() : days ).join( '' ) + '</tr>';
    },

    renderBody = function( rows ) {
    	return '<tbody>' + rows.join( '' ) + '</tbody>';
    },

    renderHead = function( opts ) {
    	var i, arr = [];
    	if ( opts.showWeekNumber ) {
    		arr.push( '<th></th>' );
    	}
    	for ( i = 0; i < 7; i++ ) {
    		arr.push( '<th scope="col"><abbr title="' + renderDayName( opts, i ) + '">' + renderDayName( opts, i, true ) + '</abbr></th>' );
    	}
    	return '<thead>' + ( opts.isRTL ? arr.reverse() : arr ).join( '' ) + '</thead>';
    },

    renderTitle = function( instance, c, year, month, refYear ) {
    	var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

    	for ( arr = [], i = 0; i < 12; i++ ) {
    		arr.push( '<option value="' + ( year === refYear ? i - c : 12 + i - c ) + '"' +
                ( i === month ? ' selected' : '' ) +
                ( ( isMinYear && i < opts.minMonth ) || ( isMaxYear && i > opts.maxMonth ) ? 'disabled' : '' ) + '>' +
                opts.i18n.months[i] + '</option>' );
    	}
    	monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month">' + arr.join( '' ) + '</select></div>';

    	if ( isArray( opts.yearRange ) ) {
    		i = opts.yearRange[0];
    		j = opts.yearRange[1] + 1;
    	} else {
    		i = year - opts.yearRange;
    		j = 1 + year + opts.yearRange;
    	}

    	for ( arr = []; i < j && i <= opts.maxYear; i++ ) {
    		if ( i >= opts.minYear ) {
    			arr.push( '<option value="' + i + '"' + ( i === year ? ' selected' : '' ) + '>' + ( i ) + '</option>' );
    		}
    	}
    	yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year">' + arr.join( '' ) + '</select></div>';

    	if ( opts.showMonthAfterYear ) {
    		html += yearHtml + monthHtml;
    	} else {
    		html += monthHtml + yearHtml;
    	}

    	if ( isMinYear && ( month === 0 || opts.minMonth >= month ) ) {
    		prev = false;
    	}

    	if ( isMaxYear && ( month === 11 || opts.maxMonth <= month ) ) {
    		next = false;
    	}

    	if ( c === 0 ) {
    		html += '<button class="pika-prev' + ( prev ? '' : ' is-disabled' ) + '" type="button">' + opts.i18n.previousMonth + '</button>';
    	}
    	if ( c === ( instance._o.numberOfMonths - 1 ) ) {
    		html += '<button class="pika-next' + ( next ? '' : ' is-disabled' ) + '" type="button">' + opts.i18n.nextMonth + '</button>';
    	}

    	return html += '</div>';
    },

    renderTable = function( opts, data ) {
    	return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead( opts ) + renderBody( data ) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function( options ) {
    	var self = this,
            opts = self.config( options );

    	self._onMouseDown = function( e ) {
    		if ( !self._v ) {
    			return;
    		}
    		e = e || window.event;
    		var target = e.target || e.srcElement;
    		if ( !target ) {
    			return;
    		}

    		if ( !hasClass( target, 'is-disabled' ) ) {
    			if ( hasClass( target, 'pika-button' ) && !hasClass( target, 'is-empty' ) ) {
    				self.setDate( new Date( target.getAttribute( 'data-pika-year' ), target.getAttribute( 'data-pika-month' ), target.getAttribute( 'data-pika-day' ) ) );
    				if ( opts.bound ) {
    					sto( function() {
    						self.hide();
    						if ( opts.field ) {
    							opts.field.blur();
    						}
    					}, 100 );
    				}
    				return;
    			}
    			else if ( hasClass( target, 'pika-prev' ) ) {
    				self.prevMonth();
    			}
    			else if ( hasClass( target, 'pika-next' ) ) {
    				self.nextMonth();
    			}
    		}
    		if ( !hasClass( target, 'pika-select' ) ) {
    			if ( e.preventDefault ) {
    				e.preventDefault();
    			} else {
    				e.returnValue = false;
    				return false;
    			}
    		} else {
    			self._c = true;
    		}
    	};

    	self._onChange = function( e ) {
    		e = e || window.event;
    		var target = e.target || e.srcElement;
    		if ( !target ) {
    			return;
    		}
    		if ( hasClass( target, 'pika-select-month' ) ) {
    			self.gotoMonth( target.value );
    		}
    		else if ( hasClass( target, 'pika-select-year' ) ) {
    			self.gotoYear( target.value );
    		}
    	};

    	self._onInputChange = function( e ) {
    		var date;

    		if ( e.firedBy === self ) {
    			return;
    		}
    		if ( hasMoment ) {
    			date = moment( opts.field.value, opts.format );
    			date = ( date && date.isValid() ) ? date.toDate() : null;
    		}
    		else {
    			date = new Date( Date.parse( opts.field.value ) );
    		}
    		self.setDate( isDate( date ) ? date : null );
    		if ( !self._v ) {
    			self.show();
    		}
    	};

    	self._onInputFocus = function() {
    		self.show();
    	};

    	self._onInputClick = function() {
    		self.show();
    	};

    	self._onInputBlur = function() {
    		// IE allows pika div to gain focus; catch blur the input field
    		var pEl = document.activeElement;
    		do {
    			if ( hasClass( pEl, 'pika-single' ) ) {
    				return;
    			}
    		}
    		while ( ( pEl = pEl.parentNode ) );

    		if ( !self._c ) {
    			self._b = sto( function() {
    				self.hide();
    			}, 50 );
    		}
    		self._c = false;
    	};

    	self._onClick = function( e ) {
    		e = e || window.event;
    		var target = e.target || e.srcElement,
                pEl = target;
    		if ( !target ) {
    			return;
    		}
    		if ( !hasEventListeners && hasClass( target, 'pika-select' ) ) {
    			if ( !target.onchange ) {
    				target.setAttribute( 'onchange', 'return;' );
    				addEvent( target, 'change', self._onChange );
    			}
    		}
    		do {
    			if ( hasClass( pEl, 'pika-single' ) || pEl === opts.trigger ) {
    				return;
    			}
    		}
    		while ( ( pEl = pEl.parentNode ) );
    		if ( self._v && target !== opts.trigger && pEl !== opts.trigger ) {
    			self.hide();
    		}
    	};

    	self.el = document.createElement( 'div' );
    	self.el.className = 'pika-single' + ( opts.isRTL ? ' is-rtl' : '' );

    	addEvent( self.el, 'mousedown', self._onMouseDown, true );
    	addEvent( self.el, 'change', self._onChange );

    	if ( opts.field ) {
    		if ( opts.container ) {
    			opts.container.appendChild( self.el );
    		} else if ( opts.bound ) {
    			document.body.appendChild( self.el );
    		} else {
    			opts.field.parentNode.insertBefore( self.el, opts.field.nextSibling );
    		}
    		addEvent( opts.field, 'change', self._onInputChange );

    		if ( !opts.defaultDate ) {
    			if ( hasMoment && opts.field.value ) {
    				opts.defaultDate = moment( opts.field.value, opts.format ).toDate();
    			} else {
    				opts.defaultDate = new Date( Date.parse( opts.field.value ) );
    			}
    			opts.setDefaultDate = true;
    		}
    	}

    	var defDate = opts.defaultDate;

    	if ( isDate( defDate ) ) {
    		if ( opts.setDefaultDate ) {
    			self.setDate( defDate, true );
    		} else {
    			self.gotoDate( defDate );
    		}
    	} else {
    		self.gotoDate( new Date() );
    	}

    	if ( opts.bound ) {
    		this.hide();
    		self.el.className += ' is-bound';
    		addEvent( opts.trigger, 'click', self._onInputClick );
    		addEvent( opts.trigger, 'focus', self._onInputFocus );
    		addEvent( opts.trigger, 'blur', self._onInputBlur );
    	} else {
    		this.show();
    	}
    };


	/**
     * public Pikaday API
     */
	Pikaday.prototype = {


		/**
         * configure functionality
         */
		config: function( options ) {
			if ( !this._o ) {
				this._o = extend( {}, defaults, true );
			}

			var opts = extend( this._o, options, true );

			opts.isRTL = !!opts.isRTL;

			opts.field = ( opts.field && opts.field.nodeName ) ? opts.field : null;

			opts.bound = !!( opts.bound !== undefined ? opts.field && opts.bound : opts.field );

			opts.trigger = ( opts.trigger && opts.trigger.nodeName ) ? opts.trigger : opts.field;

			opts.disableWeekends = !!opts.disableWeekends;

			opts.disableDayFn = ( typeof opts.disableDayFn ) == "function" ? opts.disableDayFn : null;

			var nom = parseInt( opts.numberOfMonths, 10 ) || 1;
			opts.numberOfMonths = nom > 4 ? 4 : nom;

			if ( !isDate( opts.minDate ) ) {
				opts.minDate = false;
			}
			if ( !isDate( opts.maxDate ) ) {
				opts.maxDate = false;
			}
			if ( ( opts.minDate && opts.maxDate ) && opts.maxDate < opts.minDate ) {
				opts.maxDate = opts.minDate = false;
			}
			if ( opts.minDate ) {
				setToStartOfDay( opts.minDate );
				opts.minYear = opts.minDate.getFullYear();
				opts.minMonth = opts.minDate.getMonth();
			}
			if ( opts.maxDate ) {
				setToStartOfDay( opts.maxDate );
				opts.maxYear = opts.maxDate.getFullYear();
				opts.maxMonth = opts.maxDate.getMonth();
			}

			if ( isArray( opts.yearRange ) ) {
				var fallback = new Date().getFullYear() - 10;
				opts.yearRange[0] = parseInt( opts.yearRange[0], 10 ) || fallback;
				opts.yearRange[1] = parseInt( opts.yearRange[1], 10 ) || fallback;
			} else {
				opts.yearRange = Math.abs( parseInt( opts.yearRange, 10 ) ) || defaults.yearRange;
				if ( opts.yearRange > 100 ) {
					opts.yearRange = 100;
				}
			}

			return opts;
		},

		/**
         * return a formatted string of the current selection (using Moment.js if available)
         */
		toString: function( format ) {
			return !isDate( this._d ) ? '' : hasMoment ? moment( this._d ).format( format || this._o.format ) : this._d.toDateString();
		},

		/**
         * return a Moment.js object of the current selection (if available)
         */
		getMoment: function() {
			return hasMoment ? moment( this._d ) : null;
		},

		/**
         * set the current selection from a Moment.js object (if available)
         */
		setMoment: function( date, preventOnSelect ) {
			if ( hasMoment && moment.isMoment( date ) ) {
				this.setDate( date.toDate(), preventOnSelect );
			}
		},

		/**
         * return a Date object of the current selection
         */
		getDate: function() {
			return isDate( this._d ) ? new Date( this._d.getTime() ) : null;
		},

		/**
         * set the current selection
         */
		setDate: function( date, preventOnSelect ) {
			if ( !date ) {
				this._d = null;

				if ( this._o.field ) {
					this._o.field.value = '';
					fireEvent( this._o.field, 'change', { firedBy: this } );
				}

				return this.draw();
			}
			if ( typeof date === 'string' ) {
				date = new Date( Date.parse( date ) );
			}
			if ( !isDate( date ) ) {
				return;
			}

			var min = this._o.minDate,
                max = this._o.maxDate;

			if ( isDate( min ) && date < min ) {
				date = min;
			} else if ( isDate( max ) && date > max ) {
				date = max;
			}

			this._d = new Date( date.getTime() );
			setToStartOfDay( this._d );
			this.gotoDate( this._d );

			if ( this._o.field ) {
				this._o.field.value = this.toString();
				fireEvent( this._o.field, 'change', { firedBy: this } );
			}
			if ( !preventOnSelect && typeof this._o.onSelect === 'function' ) {
				this._o.onSelect.call( this, this.getDate() );
			}
		},

		/**
         * change view to a specific date
         */
		gotoDate: function( date ) {
			var newCalendar = true;

			if ( !isDate( date ) ) {
				return;
			}

			if ( this.calendars ) {
				var firstVisibleDate = new Date( this.calendars[0].year, this.calendars[0].month, 1 ),
                    lastVisibleDate = new Date( this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1 ),
                    visibleDate = date.getTime();
				// get the end of the month
				lastVisibleDate.setMonth( lastVisibleDate.getMonth() + 1 );
				lastVisibleDate.setDate( lastVisibleDate.getDate() - 1 );
				newCalendar = ( visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate );
			}

			if ( newCalendar ) {
				this.calendars = [{
					month: date.getMonth(),
					year: date.getFullYear()
				}];
				if ( this._o.mainCalendar === 'right' ) {
					this.calendars[0].month += 1 - this._o.numberOfMonths;
				}
			}

			this.adjustCalendars();
		},

		adjustCalendars: function() {
			this.calendars[0] = adjustCalendar( this.calendars[0] );
			for ( var c = 1; c < this._o.numberOfMonths; c++ ) {
				this.calendars[c] = adjustCalendar( {
					month: this.calendars[0].month + c,
					year: this.calendars[0].year
				} );
			}
			this.draw();
		},

		gotoToday: function() {
			this.gotoDate( new Date() );
		},

		/**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
		gotoMonth: function( month ) {
			if ( !isNaN( month ) ) {
				this.calendars[0].month = parseInt( month, 10 );
				this.adjustCalendars();
			}
		},

		nextMonth: function() {
			this.calendars[0].month++;
			this.adjustCalendars();
		},

		prevMonth: function() {
			this.calendars[0].month--;
			this.adjustCalendars();
		},

		/**
         * change view to a specific full year (e.g. "2012")
         */
		gotoYear: function( year ) {
			if ( !isNaN( year ) ) {
				this.calendars[0].year = parseInt( year, 10 );
				this.adjustCalendars();
			}
		},

		/**
         * change the minDate
         */
		setMinDate: function( value ) {
			this._o.minDate = value;
		},

		/**
         * change the maxDate
         */
		setMaxDate: function( value ) {
			this._o.maxDate = value;
		},

		/**
         * refresh the HTML
         */
		draw: function( force ) {
			if ( !this._v && !force ) {
				return;
			}
			var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '';

			if ( this._y <= minYear ) {
				this._y = minYear;
				if ( !isNaN( minMonth ) && this._m < minMonth ) {
					this._m = minMonth;
				}
			}
			if ( this._y >= maxYear ) {
				this._y = maxYear;
				if ( !isNaN( maxMonth ) && this._m > maxMonth ) {
					this._m = maxMonth;
				}
			}

			for ( var c = 0; c < opts.numberOfMonths; c++ ) {
				html += '<div class="pika-lendar">' + renderTitle( this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year ) + this.render( this.calendars[c].year, this.calendars[c].month ) + '</div>';
			}

			this.el.innerHTML = html;

			if ( opts.bound ) {
				if ( opts.field.type !== 'hidden' ) {
					sto( function() {
						opts.trigger.focus();
					}, 1 );
				}
			}

			if ( typeof this._o.onDraw === 'function' ) {
				var self = this;
				sto( function() {
					self._o.onDraw.call( self );
				}, 0 );
			}
		},

		adjustPosition: function() {
			if ( this._o.container ) return;
			var field = this._o.trigger, pEl = field,
            width = this.el.offsetWidth, height = this.el.offsetHeight,
            viewportWidth = window.innerWidth || document.documentElement.clientWidth,
            viewportHeight = window.innerHeight || document.documentElement.clientHeight,
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop,
            left, top, clientRect;

			if ( typeof field.getBoundingClientRect === 'function' ) {
				clientRect = field.getBoundingClientRect();
				left = clientRect.left + window.pageXOffset;
				top = clientRect.bottom + window.pageYOffset;
			} else {
				left = pEl.offsetLeft;
				top = pEl.offsetTop + pEl.offsetHeight;
				while ( ( pEl = pEl.offsetParent ) ) {
					left += pEl.offsetLeft;
					top += pEl.offsetTop;
				}
			}

			// default position is bottom & left
			if ( ( this._o.reposition && left + width > viewportWidth ) ||
                (
                    this._o.position.indexOf( 'right' ) > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
				left = left - width + field.offsetWidth;
			}
			if ( ( this._o.reposition && top + height > viewportHeight + scrollTop ) ||
                (
                    this._o.position.indexOf( 'top' ) > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
				top = top - height - field.offsetHeight;
			}

			this.el.style.cssText = [
                'position: absolute',
                'left: ' + left + 'px',
                'top: ' + top + 'px'
			].join( ';' );
		},

		/**
         * render HTML for a particular month
         */
		render: function( year, month ) {
			var opts = this._o,
                now = new Date(),
                days = getDaysInMonth( year, month ),
                before = new Date( year, month, 1 ).getDay(),
                data = [],
                row = [];
			setToStartOfDay( now );
			if ( opts.firstDay > 0 ) {
				before -= opts.firstDay;
				if ( before < 0 ) {
					before += 7;
				}
			}
			var cells = days + before,
                after = cells;
			while ( after > 7 ) {
				after -= 7;
			}
			cells += 7 - after;
			for ( var i = 0, r = 0; i < cells; i++ ) {
				var day = new Date( year, month, 1 + ( i - before ) ),
                    isSelected = isDate( this._d ) ? compareDates( day, this._d ) : false,
                    isToday = compareDates( day, now ),
                    isEmpty = i < before || i >= ( days + before ),
                    isDisabled = ( opts.minDate && day < opts.minDate ) ||
                                 ( opts.maxDate && day > opts.maxDate ) ||
                                 ( opts.disableWeekends && isWeekend( day ) ) ||
                                 ( opts.disableDayFn && opts.disableDayFn( day ) );

				row.push( renderDay( 1 + ( i - before ), month, year, isSelected, isToday, isDisabled, isEmpty ) );

				if ( ++r === 7 ) {
					if ( opts.showWeekNumber ) {
						row.unshift( renderWeek( i - before, month, year ) );
					}
					data.push( renderRow( row, opts.isRTL ) );
					row = [];
					r = 0;
				}
			}
			return renderTable( opts, data );
		},

		isVisible: function() {
			return this._v;
		},

		show: function() {
			if ( !this._v ) {
				removeClass( this.el, 'is-hidden' );
				this._v = true;
				this.draw();
				if ( this._o.bound ) {
					addEvent( document, 'click', this._onClick );
					this.adjustPosition();
				}
				if ( typeof this._o.onOpen === 'function' ) {
					this._o.onOpen.call( this );
				}
			}
		},

		hide: function() {
			var v = this._v;
			if ( v !== false ) {
				if ( this._o.bound ) {
					removeEvent( document, 'click', this._onClick );
				}
				this.el.style.cssText = '';
				addClass( this.el, 'is-hidden' );
				this._v = false;
				if ( v !== undefined && typeof this._o.onClose === 'function' ) {
					this._o.onClose.call( this );
				}
			}
		},

		/**
         * GAME OVER
         */
		destroy: function() {
			this.hide();
			removeEvent( this.el, 'mousedown', this._onMouseDown, true );
			removeEvent( this.el, 'change', this._onChange );
			if ( this._o.field ) {
				removeEvent( this._o.field, 'change', this._onInputChange );
				if ( this._o.bound ) {
					removeEvent( this._o.trigger, 'click', this._onInputClick );
					removeEvent( this._o.trigger, 'focus', this._onInputFocus );
					removeEvent( this._o.trigger, 'blur', this._onInputBlur );
				}
			}
			if ( this.el.parentNode ) {
				this.el.parentNode.removeChild( this.el );
			}
		}

	};

	return Pikaday;

} ) );
/*jshint ignore:end */
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
var app = {};
///<reference path="main.js">
/**	
 * SI JavaScript library
 *
 * @author Jeremy Burton - jeremy@select-interactive.com
 * @version 0.1.1
 *
 * @description To provide crossbrowser support for Select Interactive
 *   projects without relying on jQuery.
 *   
 * Featured detection and polyfill for
 *   Promises
 *   Fetch
 * 
 * Targeting features such as:
 *   forEach
 *   .matchMedia support
 *   equal height columns
 *   fetch
 */
( function( window, doc, undefined ) {

	// $ - maps to querySelector to return an element
	// @elements - a node list of elements or selector
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	var $ = function( expr, context ) {
		return typeof expr === 'string' ? ( context || doc ).querySelector( expr ) : expr || null;
	};

	// $$ - maps to querySelectorAll to return a node list of elements
	// @expr - the selector expression to search for
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	var $$ = function( expr, context ) {
		return typeof expr === 'string' ? ( context || doc ).querySelectorAll( expr ) : expr || null;
	};

	// $.addScript - helper function to load scripts
	// @src - String - the source of the script to load
	// @parent - Element - the element that the script should be appended to
	// @async - Boolean - should the script be loaded async
	$.addScript = function( src, parent, async ) {
		var script = doc.createElement( 'script' );
		script.src = src;
		script.async = async;
		parent.appendChild( script );
	};

	// if we need to polyfill promises
	if ( typeof self.Promise === 'undefined' || !self.Promise ) {
		$.addScript( '/bower_components/es6-promise/promise.min.js', doc.querySelector( 'head' ), true );
	}

	// If we need to polyfill fetch
	if ( typeof self.fetch === 'undefined' || !self.fetch ) {
		$.addScript( '/bower_components/fetch/fetch.min.js', doc.querySelector( 'head' ), true );
	}

	// $.forEach / window.forEachElement = traverses a node list of elements and executes a function over them
	// @elements - a node list of elements or selector
	// @fn - the function to execute over the list of elements
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	$.forEach = function( elements, fn, context ) {
		var i = 0,
            len;

		if ( !elements || typeof elements === 'function' ) {
			console.log( 'elements is not a valid node list.' );
			return;
		}

		if ( typeof elements === 'string' || elements instanceof String ) {
			elements = $$( elements, context );
		}

		len = elements.length;

		for ( ; i < len; i++ ) {
			if ( fn( elements[i], i ) ) {
				break;
			}
		}
	};

	// keep backwards compatibility for forEachElement
	window.forEachElement = $.forEach;

	// $.addEvent - traverses a node list of elements and attaches and event handler to them
	// @elements - a node list of elements or selector 
	// @evt - the event to watch for (i.e. 'click', 'mouseenter')
	// @fn - the function to execute when the event is raised
	// @contenxt - optional - the parent container of the elements. Defaults to document.
	$.addEvent = function( elements, evt, fn, context ) {
		if ( !elements || typeof elements === 'function' ) {
			console.log( 'elements is not a valid node list.' );
			return;
		}

		if ( typeof elements === 'string' || elements instanceof String ) {
			elements = $$( elements, context );
		}

		$.forEach( elements, function( el ) {
			el.addEventListener( evt, function( e ) {
				fn( e, el );
			}, false );
		} );
	};

	// $.findUp - helper function to recursively traverse up the DOM to find a specified element 
	// @startEl - the element that we start at and move up from
	// @selector - the selector of the element we are looking for
	// @attr - optional - the data attribute of the element we may want a value for
	// @endTag - optional - the selector of the end tag to stop at. Defaults to the body tag.
	// @fn - optional - a function to run once the element has been found
	$.findUp = function( startEl, selector, attr, endTag, fn ) {
		var el = startEl,
			rspObj = {};

		if ( !endTag ) {
			endTag = doc.body;
		}

		function moveUp() {
			if ( $.matches( el, selector ) ) {
				rspObj = {
					el: el,
					val: attr && attr.length ? el.getAttribute( attr ) : ''
				};

				if ( fn ) {
					fn( rspObj );
				}

				return rspObj;
			}
			else {
				el = el.parentNode;

				if ( el === endTag || $.matches( el, endTag ) ) {
					return null;
				}
				else {
					return moveUp();
				}
			}
		}

		return moveUp();
	};

	// $.mq - helper function to check for mediaquery
	// @mediaQuery - the mediaquery to test for (i.e. '(min-width:1024px)')
	$.mq = function( mediaQuery ) {
		return !( window.matchMedia ) || ( window.matchMedia && window.matchMedia( mediaQuery ).matches );
	};

	// keep backwards compatibility for mq
	window.mq = $.mq;

	// $.eqHeight - Helper function to set columns to the same height
	// @context - Optional - Element - the parent element to find rows in. Defaults to body.
	$.eqHeight = function( context ) {
		if ( !context || !context.querySelector ) {
			context = doc;
		}

		// if the promise polyfill hasn't loaded for browsers that need it
		if ( typeof self.Promise === 'undefined' || !self.Promise ) {
			setTimeout( function() {
				$.eqHeight( context );
			}, 10 );

			return;
		}

		// collect all of the rows
		$.forEach( '.eq-height', function( row ) {
			var cols = $$( '.eq-height-item', row ),

				// keep all the image promises as an array
				imagePromises = [];

			// only if we are over a mq of 768px or the row has class .mbl-eq-height
			if ( $.mq( '(min-width:768px)' ) || row.classList.contains( 'mbl-eq-height' ) ) {

				// check if this is large item only
				if ( !row.classList.contains( 'eq-height-item-lg' ) || $.mq( '(min-width:1024px)' ) ) {
					// loop through any images, create a promise for them and add to the imagePromises array
					$.forEach( 'img', function( img ) {
						imagePromises.push( new Promise( function( resolve, reject ) {
							// the image is cached (or has already loaded?)
							if ( img.complete ) {
								resolve( this );
							}
							else {
								// image has loaded
								img.addEventListener( 'load', function() {
									console.log( 'image loaded' );
									resolve( this );
								}, false );
							}
						} ) );
					}, row );

					// if there are images, wait for them to all load before setting the column height
					if ( imagePromises.length ) {
						Promise.all( imagePromises ).then( function() {
							// all images have been loaded
							setColumnHeights( cols );
						}, function() {
							console.warn( 'An image has failed to load.' );
						} );
					}

						// if no images in the container/row, set the column heights now
					else {
						setColumnHeights( cols );
					}
				}
				else {
					$.forEach( cols, function( col ) {
						col.classList.add( 'in' );
					} );
				}
			}
			else {
				$.forEach( cols, function( col ) {
					col.classList.add( 'in' );
				} );
			}
		}, context );

		function setColumnHeights( cols ) {
			var h = 0;

			// find the tallest column
			$.forEach( cols, function( col ) {
				if ( col.offsetHeight > h ) {
					h = col.offsetHeight;
				}
			} );

			// set the height of all the columns to the tallest one
			$.forEach( cols, function( col ) {
				col.style.height = h + 'px';
				col.classList.add( 'in' );
			} );
		}
	};

	// on load let's run eqHeight
	window.addEventListener( 'load', $.eqHeight );

	// $.fetch - Replacing Ajax
	// url - String - the url to fetch
	// options - JSON object - options such as data, method, etc...
	// type - optional - String - the method type. Set to 'GET' to perform a GET request
	$.fetch = function( url, options, type, callbackFn ) {
		var opts, headers;

		// if no url was passed in break now
		if ( !url ) {
			console.warn( 'No url provided to fetch' );
			return;
		}

		// if the promise polyfill hasn't loaded yet
		//   overwrite .then and wait 100 milliseconds then try again.
		if ( typeof self.Promise === 'undefined' || !self.Promise ) {
			return {
				then: function( fn ) {
					setTimeout( function() {
						return $.fetch( url, options, type, fn );
					}, 100 );
				}
			};
		}

		// if the fetch polyfill hasn't loaded yet
		//   overwrite .then and wait 100 milliseconds then try again.
		if ( !self.fetch ) {
			return {
				then: function( fn ) {
					setTimeout( function() {
						return $.fetch( url, options, type, fn );
					}, 100 );
				}
			};
		}
		else {
			// init options to empty object if none were passed in
			if ( !options ) {
				options = {};
			}

			// check fetch request type -- assuming this would a POST request
			if ( !type || type !== 'GET' ) {
				// if additional headers need to be added
				headers = app.util.extend( {
					'Accept': 'application/json',
					'Content-type': 'application/json'
				}, options.headers || {} );

				// setup some default options for a POST request
				//  and extend to include any options that were passed in
				//  specifically the body property for webservice parameters
				opts = app.util.extend( {
					url: url,
					body: '',
					method: 'POST'
				}, options );

				// make sure we include all of the needed headers
				opts.headers = headers;

				// make sure the body property has been stringified
				if ( opts.body && typeof opts.body !== 'string' && opts.body !== {} ) {
					opts.body = JSON.stringify( opts.body );
				}

				// make the fetch call
				return fetch( url, opts ).then( function( rsp ) {
					return rsp.json();
				} ).then( function( data ) {
					if ( callbackFn ) {
						callbackFn( data.d );
					}
					else {
						return data.d;
					}
				} ).then( function( rsp ) {
					return JSON.parse( rsp );
				} );
			}
			else {
				// if additional headers need to be added
				headers = app.util.extend( {
					'Content-Type': 'text/plain'
				}, options.headers || {} );
				
				// setup default options for a GET request
				//  expecting text/plain content type by default
				opts = app.util.extend( {
					method: 'GET'
				}, options );

				// make sure we include all of the needed headers
				opts.headers = headers;

				// make the fetch call
				return fetch( url, opts ).then( function( rsp ) {
					return rsp.text();
				} ).then( function( rsp ) {
					if ( callbackFn ) {
						callbackFn( rsp );
					}
					else {
						return rsp;
					}
				} );
			}
		}
	};

	$.matches = function( elm, selector ) {
		var _matches = ( elm.document || elm.ownerDocument ).querySelectorAll( selector ),
			i = _matches.length;
		while ( --i >= 0 && _matches.item( i ) !== elm ) { }
		return i > -1;
	};

	app.$ = $;
	app.$$ = $$;
}( window, window.document, undefined ) );

// Polyfill for CustomEvent
( function() {

	if ( typeof window.CustomEvent === 'function' ) {
		return false;
	}

	function CustomEvent( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
} )();

// Avoid 'console' errors in browsers that lack a console
( function() {
	var method;
	var noop = function() { };
	var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = ( window.console = window.console || {} );

	while ( length-- ) {
		method = methods[length];

		// Only stub undefined methods.
		if ( !console[method] ) {
			console[method] = noop;
		}
	}
}() );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
 app.util = (function( doc ) {
    'use strict';
        
    // will clone an object, not copying by reference
    function cloneObj( obj ) {
        return JSON.parse( JSON.stringify( obj ) );
    }

    function extend( obj1, obj2 ) {
        var obj = obj1;

        for ( var key in obj2 ) {
            obj[key] = obj2[key];
        }

        return obj;
    }

    function getWindowScrollPosition() {
        if ( typeof window.scrollY === 'undefined' ) {
            return document.documentElement.scrollTop;
        }
        else {
            return window.scrollY;
        }
    }

    function callBackFn( instance, fnName ) {
    	return function() {
    		instance[fnName].apply( instance, arguments );
    	};
    }

    function disableWindowScroll() {
    	doc.body.classList.add( 'noscroll' );
    }

    function enableWindowScroll() {
    	doc.body.classList.remove( 'noscroll' );
    }

    return {
        cloneObj: cloneObj,
        extend: extend,
        getWindowScrollPosition: getWindowScrollPosition,
        callBackFn: callBackFn,
        disableWindowScroll: disableWindowScroll,
        enableWindowScroll: enableWindowScroll
    };

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 */
( function( doc ) {
	'use strict';

	let activeAlert = null;

	const cssClasses = {
		ALERT_ACTIVE: 'alert-active',
		ALERT_EL: 'alert-el',
		ALERT_HDR: 'alert-header',
		ALERT_INFO: 'alert-info',
		BTN: 'alert-btn',
		BTN_CONFIRM: 'alert-btn-confirm',
		BTN_CONTAINER: 'alert-btn-container',
		BTN_DISMISS: 'alert-btn-dismiss',
		CONTAINER: 'alert-container'
	};

	const keys = {
		ESCAPE: 27
	};

	class Alert {
		constructor() {
			if ( activeAlert ) {
				console.log( 'An alert already exists.' );
				return activeAlert;
			}

			this.alertContainer = this.createAlertElements();

			this.onConfirm = function() { };
			this.onDismiss = function() { };

			this.promptAlert = this.promptAlert.bind( this );
			this.updateButtons = this.updateButtons.bind( this );
			this.showAlert = this.showAlert.bind( this );
			this.handleKeyDown = this.handleKeyDown.bind( this );
			this.dismissAlert = this.dismissAlert.bind( this );

			this.addEventListeners();

			activeAlert = this;
		}

		createAlertElements() {
			let el = doc.createElement( 'div' );
			el.classList.add( cssClasses.CONTAINER );
			doc.body.appendChild( el );

			this.alertEl = doc.createElement( 'div' );
			this.alertEl.classList.add( cssClasses.ALERT_EL );

			this.alertHeader = doc.createElement( 'h3' );
			this.alertHeader.classList.add( cssClasses.ALERT_HDR );

			this.alertInfo = doc.createElement( 'div' );
			this.alertInfo.classList.add( cssClasses.ALERT_INFO );

			let btnContainer = doc.createElement( 'div' );
			btnContainer.classList.add( cssClasses.BTN_CONTAINER );

			this.btnDismiss = doc.createElement( 'button' );
			this.btnDismiss.classList.add( cssClasses.BTN );
			this.btnDismiss.classList.add( cssClasses.BTN_CONFIRM );
			this.btnDismiss.classList.add( 'btn-ripple' );
			this.btnDismiss.textContent = 'Dismiss';

			this.btnConfirm = doc.createElement( 'button' );
			this.btnConfirm.classList.add( cssClasses.BTN );
			this.btnConfirm.classList.add( cssClasses.BTN_CONFIRM );
			this.btnConfirm.classList.add( 'btn-ripple' );
			this.btnConfirm.textContent = 'Confirm';

			btnContainer.appendChild( this.btnDismiss );
			btnContainer.appendChild( this.btnConfirm );

			el.appendChild( this.alertEl );
			this.alertEl.appendChild( this.alertHeader );
			this.alertEl.appendChild( this.alertInfo );
			this.alertEl.appendChild( btnContainer );

			return el;
		}

		addEventListeners() {
			this.btnConfirm.addEventListener( 'click', this.onConfirm, false );
			this.btnDismiss.addEventListener( 'click', this.onDismiss, false );
		}

		promptAlert( hdr, content, btnConfirmText, btnDismissText, fnConfirm, fnDismiss ) {
			this.alertHeader.textContent = hdr;
			this.alertInfo.innerHTML = content;
			this.updateButtons( btnConfirmText, btnDismissText, fnConfirm, fnDismiss );
			this.showAlert();

			doc.body.addEventListener( 'keydown', this.handleKeyDown, false );
		}

		updateButtons( btnConfirmText, btnDismissText, fnConfirm, fnDismiss ) {
			this.btnConfirm.textContent = btnConfirmText;
			this.btnDismiss.textContent = btnDismissText;

			this.btnDismiss.MaterialButton = new MaterialButton( this.btnDismiss );
			this.btnConfirm.MaterialButton = new MaterialButton( this.btnConfirm );

			this.btnConfirm.removeEventListener( 'click', this.onConfirm, false );
			this.btnDismiss.removeEventListener( 'click', this.onDismiss, false );

			this.onConfirm = fnConfirm;
			this.onDismiss = fnDismiss;

			this.btnConfirm.addEventListener( 'click', this.onConfirm, false );
			this.btnDismiss.addEventListener( 'click', this.onDismiss, false );
		}

		showAlert() {
			doc.body.classList.add( cssClasses.ALERT_ACTIVE );
		}

		handleKeyDown( e ) {
			if ( e.keyCode === keys.ESCAPE ) {
				this.onDismiss();
			}
		}

		dismissAlert() {
			doc.body.classList.remove( cssClasses.ALERT_ACTIVE );
			doc.body.removeEventListener( 'keydown', this.handleKeyPress, false );
		}
	}

	app.Alert = Alert;

}( document ) );
/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    class Nav {
        static init() {
            this.triggers = app.$$( '.nav-trigger' );

            this.addEventListeners_();
        }

        static addEventListeners_() {
            app.$.forEach( this.triggers, trigger => {
                trigger.addEventListener( 'click', e=> {
                    doc.body.classList.toggle( 'nav-in' );
                } );
            } );
        }

        static close() {
            doc.body.classList.remove( 'nav-in' );
        }
    }

    app.Nav = Nav;

}( document ) );
/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    class Router {
        static init() {
            this.mainContainer = app.$( '#page-container' );
            this.path = window.location.pathname;
            this.addEventListners_();
        }

        static addEventListners_() {
            doc.body.addEventListener( 'click', e => this.handleClick_( e ) );
            window.addEventListener( 'popstate', e => this.popstateHandler_( e ) );
        }

        static handleClick_( e ) {
            if ( e.metaKey || e.ctrlKey || e.button !== 0 ) {
                return;
            }

            var node = e.target;
            do {
                if ( node === null || node.nodeName.toLowerCase() === 'a') {
                    break;
                }

                node = node.parentNode;
            } while ( node );

            if ( node ) {
                const href = node.href;
                const path = node.getAttribute( 'href' );
                
                if ( href.indexOf( window.location.hostname ) !== -1 || path === '/' ) {
                    e.preventDefault();

                    if ( path !== this.path ) {
                        this.path = path;
                        app.Nav.close();
                        this.go_( path, true );
                    }
                }
            }
        }

        static go_( path, updateState ) {
            // need to log GA

            // fade current page out
            // load new page
            // then fade in the new page
            // then update state
            Promise.all([
                this.fadePageOut_(),
                this.loadPageContent_( path )
            ]).then( data => {
                const html = data[1];
                this.mainContainer.innerHTML = html;

                // use request animation to wait for the html to be painted
                requestAnimationFrame( () => {
                    requestAnimationFrame( () => {
                        this.fadePageIn_().then( _ => {
                            if ( updateState ) {
                                this.updateState_();
                            }

                            if ( path !== '/' ) {
                                doc.body.classList.remove( 'home' );
                                doc.body.classList.remove( 'home-top' );
                            }
                            else {
                                doc.body.classList.add( 'home' );
                                doc.body.classList.add( 'home-top' );
                            }
                        } );
                    } );
                } );
            } );
        }

        static fadePageOut_() {
            return new Promise( ( resolve, reject ) => {
                const onTransitionEnd = () => {
                    this.mainContainer.removeEventListener( 'transitionend', onTransitionEnd );
                    resolve();
                };
                
                this.mainContainer.addEventListener( 'transitionend', onTransitionEnd );
                doc.body.classList.add( 'page-out' );
            } );
        }

        static loadPageContent_( path ) {
            return app.$.fetch( '/api/loadControlContent', {
                body: {
                    controlName: path,
                    url: ''
                }
            } ).then( rsp => {
                if ( rsp.success ) {
                    const content = rsp.obj;
                    return content.html;
                }
            } );
        }

        static fadePageIn_() {
            return new Promise( ( resolve, reject ) => {
                const onTransitionEnd = () => {
                    this.mainContainer.removeEventListener( 'transitionend', onTransitionEnd );
                    resolve();
                };

                window.scrollTo( 0, 0 );
                this.mainContainer.addEventListener( 'transitionend', onTransitionEnd );
                doc.body.classList.remove( 'page-out' );
            } );
        }

        static updateState_() {
            history.pushState( { path: this.path }, null, this.path );
        }

        static popstateHandler_() {
            if ( history.state && history.state.path ) {
                console.log( history.state.path );
				this.go_( history.state.path );
			}
        }
    }

    app.Router = Router;

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	const cssClasses = {
		ANIMATABLE: 'animatable',
		NAV_IN: 'side-nav-in'
	};

	class SideNav {
		constructor() {
			this.btnShow = app.$( '.hdr-nav-trigger' );
			this.sideNav = app.$( '.side-nav' );
			this.sideNavContainer = app.$( '.side-nav-container' );
			this.sideNavClose = app.$( '.side-nav-close' );

			this.showSideNav = this.showSideNav.bind( this );
			this.hideSideNav = this.hideSideNav.bind( this );
			this.onTouchStart = this.onTouchStart.bind( this );
			this.onTouchMove = this.onTouchMove.bind( this );
			this.onTouchEnd = this.onTouchEnd.bind( this );
			this.onTransitionEnd = this.onTransitionEnd.bind( this );
			this.update = this.update.bind( this );

			this.startX = 0;
			this.currentX = 0;
			this.touchingSideNav = false;

			this.addEventListeners();
		}

		addEventListeners() {
			this.btnShow.addEventListener( 'click', this.showSideNav );
			this.sideNav.addEventListener( 'click', this.hideSideNav );
			this.sideNavContainer.addEventListener( 'click', this.blockClicks );
			this.sideNavClose.addEventListener( 'click', this.hideSideNav );
			this.sideNav.addEventListener( 'touchstart', this.onTouchStart );

			this.sideNav.addEventListener( 'touchmove', this.onTouchMove );
			this.sideNav.addEventListener( 'touchend', this.onTouchEnd );
		}

		showSideNav( e ) {
			this.sideNav.classList.add( cssClasses.ANIMATABLE );
			doc.body.classList.add( cssClasses.NAV_IN );
			this.sideNav.addEventListener( 'transitionend', this.onTransitionEnd );
			e.preventDefault();
		}

		hideSideNav( e ) {
			this.sideNav.classList.add( 'animatable' );
			doc.body.classList.remove( cssClasses.NAV_IN );
			this.sideNav.addEventListener( 'transitionend', this.onTransitionEnd );

			if ( e ) {
				e.preventDefault();
			}
		}

		blockClicks( e ) {
			e.stopPropagation();
		}

		onTouchStart( e ) {
			if ( !doc.body.classList.contains( cssClasses.NAV_IN ) ) {
				return;
			}

			this.startX = e.touches[0].pageX;
			this.currentX = this.startX;

			this.touchingSideNav = true;
			requestAnimationFrame( this.update );
		}

		onTouchMove( e ) {
			if ( !this.touchingSideNav ) {
				return;
			}

			this.currentX = e.touches[0].pageX;
			const translateX = Math.min( 0, this.currentX - this.startX );

			if ( translateX < 0 ) {
				e.preventDefault();
			}
		}

		onTouchEnd( e ) {
			if ( !this.touchingSideNav ) {
				return;
			}

			this.touchingSideNav = false;

			const translateX = Math.min( 0, this.currentX - this.startX );
			this.sideNavContainer.style.transform = '';

			if ( translateX < 0 ) {
				this.hideSideNav();
			}
		}

		update() {
			if ( !this.touchingSideNav ) {
				return;
			}

			requestAnimationFrame( this.update );

			const translateX = Math.min( 0, this.currentX - this.startX );
			this.sideNavContainer.style.transform = 'translateX(' + translateX + 'px)';
		}

		onTransitionEnd( e ) {
			this.sideNav.classList.remove( cssClasses.ANIMATABLE );
			this.sideNav.removeEventListener( 'transitionend', this.onTransitionEnd );
		}
	}

	if ( app.$( '.side-nav' ) ) {
		new SideNav();
	}

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 */
( function( doc ) {
	'use strict';

	let activeToast = null;

	const cssClasses = {
		ACTIVE: 'active',
		TOAST: 'toast'
	};

	class Toast {
		constructor() {
			if ( activeToast ) {
				console.log( 'A toast already exists.' );
				return activeToast;
			}

			this.container = this.createToastElement();
			this.duration = -1;
			this.defaultDuration = 3000;
			this.hideTimeout = null;

			this.show = this.show.bind( this );
			this.hide = this.hide.bind( this );

			activeToast = this;
		}

		createToastElement() {
			let el = doc.createElement( 'div' );
			el.classList.add( cssClasses.TOAST );
			doc.body.appendChild( el );
			return el;
		}

		show( msg, duration ) {
			let me = this;

			if ( this.hideTimeout ) {
				clearTimeout( this.hideTimeout );
				this.hideTimeout = null;
			}

			this.container.innerHTML = msg;

			setTimeout( function() {
				me.container.classList.add( cssClasses.ACTIVE );
			}, 1 );

			this.duration = duration;
			this.hide();
		}

		hide( now ) {
			let me = this,
        		duration = this.defaultDuration;

			if ( now ) {
				this.container.classList.remove( cssClasses.ACTIVE );
				return;
			}

			if ( this.duration === -1 ) {
				return;
			}

			if ( this.duration && this.duration !== -1 ) {
				duration = this.duration;
			}

			this.hideTimeout = setTimeout( function() {
				me.container.classList.remove( cssClasses.ACTIVE );
			}, duration );
		}
	}

	app.Toast = Toast;
}( document ) );
window.requestAnimationFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
}());
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com)
 * @version: 1.0.0 
 */
( function( doc ) {
	'use strict';

	var MaterialButton = function MaterialButton( element ) {
		this.element_ = element;
		this.init();
	};

	window.MaterialButton = MaterialButton;

	// Definte css classes
	MaterialButton.prototype.cssClasses_ = {
		RIPPLE_BUTTON: 'btn-ripple',
		RIPPLE_CONTAINER: 'btn-ripple-container',
		RIPPLE: 'btn-ripple-element',
		RIPPLE_CENTER: 'btn-ripple-center',
		RIPPLE_IS_ANIMATING: 'is-animating',
		RIPPLE_IS_VISIBLE: 'is-visible'
	};

	MaterialButton.prototype.RippleConstant = {
		INITIAL_SCALE: 'scale(0.0001, 0.0001)',
		INITIAL_SIZE: '1px',
		INITIAL_OPACITY: '0.4',
		FINAL_OPACITY: '0',
		FINAL_SCALE: ''
	};

	// initialize the element
	MaterialButton.prototype.init = function() {
		if ( this.element_ ) {
			
			// if this button needs the ripple effect
			//   add the necessary ripple elements and events
			if ( this.element_.classList.contains( this.cssClasses_.RIPPLE_BUTTON ) ) {
				this.initRipple();
			}
		}
	};

	MaterialButton.prototype.initRipple = function() {
		var recentering;

		// first add the elements
		this.addRippleElements();

		// set defaults and add event handlers
		recentering = this.element_.classList.contains( this.cssClasses_.RIPPLE_CENTER );
		this.frameCount_ = 0;
		this.rippleSize_ = 0;
		this.x_ = 0;
		this.y_ = 0;

		// Touch start produces a compat mouse down event, which would cause a
		// second ripple. To avoid that, we use this property to ignore the first
		// mouse down after a touch start.
		this.ignoringMouseDown_ = false;

		this.boundDownHandler = this.downHandler_.bind( this );
		this.element_.addEventListener( 'mousedown', this.boundDownHandler, false );
		this.element_.addEventListener( 'touchstart', this.boundDownHandler, false );

		this.boundUpHandler = this.upHandler_.bind( this );
		this.element_.addEventListener( 'mouseup', this.boundUpHandler, false );
		this.element_.addEventListener( 'mouseleave', this.boundUpHandler, false );
		this.element_.addEventListener( 'touchend', this.boundUpHandler, false );
		this.element_.addEventListener( 'blur', this.boundUpHandler, false );

		// helpers
		this.getFrameCount = function() {
			return this.frameCount_;
		};

		this.setFrameCount = function( fC ) {
			this.frameCount_ = fC;
		};

		this.getRippleElement = function() {
			return this.rippleElement_;
		};

		this.setRippleXY = function( newX, newY ) {
			this.x_ = newX;
			this.y_ = newY;
		};

		// styles
		this.setRippleStyles = function( start ) {
			if ( this.rippleElement_ !== null ) {
				var transformString, scale, size,
					offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

				if ( start ) {
					scale = this.RippleConstant.INITIAL_SCALE;
					size = this.RippleConstant.INITIAL_SIZE;
				}
				else {
					scale = this.RippleConstant.FINAL_SCALE;
					size = this.rippleSize_ + 'px';

					if ( recentering ) {
						offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
					}
				}

				transformString = 'translate(-50%, -50%) ' + offset + scale;

				this.rippleElement_.style.webkitTransform = transformString;
				this.rippleElement_.style.msTransform = transformString;
				this.rippleElement_.style.transform = transformString;

				if ( start ) {
					this.rippleElement_.classList.remove( this.cssClasses_.RIPPLE_IS_ANIMATING );
				}
				else {
					this.rippleElement_.classList.add( this.cssClasses_.RIPPLE_IS_ANIMATING );
				}
			}
		};

		// RAF
		this.animFrameHandler = function() {
			if ( this.frameCount_-- > 0 ) {
				requestAnimationFrame( this.animFrameHandler.bind( this ) );
			}
			else {
				this.setRippleStyles( false );
			}
		};
	};

	MaterialButton.prototype.addRippleElements = function() {
		var container = doc.createElement( 'span' );
		container.classList.add( this.cssClasses_.RIPPLE_CONTAINER );

		this.rippleElement_ = doc.createElement( 'span' );
		this.rippleElement_.classList.add( this.cssClasses_.RIPPLE );

		container.appendChild( this.rippleElement_ );

		this.boundRippleBlurHandler = this.blurHandler_.bind( this );
		this.rippleElement_.addEventListener( 'mouseup', this.boundRippleBlurHandler );
		this.element_.appendChild( container );
	};

	// blur event handler
	MaterialButton.prototype.blurHandler_ = function( e ) {
		if ( e ) {
			this.element_.blur();
		}
	};

	// disable the button
	MaterialButton.prototype.disable = function() {
		this.element_.disabled = true;
	};

	// button downHandler
	MaterialButton.prototype.downHandler_ = function( e ) {
		var bound, x, y, clientX, clientY;

		if ( !this.rippleElement_.style.width && !this.rippleElement_.style.height ) {
			var rect = this.element_.getBoundingClientRect();
			this.boundHeight = rect.height;
			this.boundWidth = rect.width;
			this.rippleSize_ = Math.sqrt( rect.width * rect.width + rect.height * rect.height ) * 2 + 2;
			this.rippleElement_.style.width = this.rippleSize_ + 'px';
			this.rippleElement_.style.height = this.rippleSize_ + 'px';
		}

		this.rippleElement_.classList.add( this.cssClasses_.RIPPLE_IS_VISIBLE );

		if ( e.type === 'mousedown' && this.ignoringMouseDown_ ) {
			this.ignoringMouseDown_ = false;
		}
		else {
			if ( e.type === 'touchstart' ) {
				this.ignoringMouseDown_ = true;
			}

			var frameCount = this.getFrameCount();
			if ( frameCount > 0 ) {
				return;
			}

			this.setFrameCount( 1 );

			bound = e.currentTarget.getBoundingClientRect();

			// Check if we are handling a keyboard click.
			if ( e.clientX === 0 && e.clientY === 0 ) {
				x = Math.round( bound.width / 2 );
				y = Math.round( bound.height / 2 );
			} else {
				clientX = e.clientX ? e.clientX : e.touches[0].clientX;
				clientY = e.clientY ? e.clientY : e.touches[0].clientY;
				x = Math.round( clientX - bound.left );
				y = Math.round( clientY - bound.top );
			}

			this.setRippleXY( x, y );
			this.setRippleStyles( true );

			window.requestAnimationFrame( this.animFrameHandler.bind( this ) );
		}
	};

	// button upHandler
	MaterialButton.prototype.upHandler_ = function( e ) {
		// Don't fire for the artificial "mouseup" generated by a double-click.
		if ( e && e.detail !== 2 ) {
			this.rippleElement_.classList.remove( this.cssClasses_.RIPPLE_IS_VISIBLE );
		}

		// Allow a repaint to occur before removing this class, so the animation
		// shows for tap events, which seem to trigger a mouseup too soon after mousedown.
		window.setTimeout( function() {
			this.rippleElement_.classList.remove( this.cssClasses_.RIPPLE_IS_VISIBLE );
		}.bind( this ), 0 );
	};

	// enable the button
	MaterialButton.prototype.enable = function() {
		this.element_.disabled = false;
	};

	app.$.forEach( '.btn-ripple', function( btn ) {
		btn.MaterialButton = new MaterialButton( btn );
	} );
}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 */
( function( doc ) {
	'use strict';

	const ckEditorSettings = {
		allowedContent: true,
		height: 350,
		toolbar: 'Simple'
	};

	const formCssClasses = {
		chosenSelect: 'chosen-select',
		ckeditor: 'use-ckeditor',
		errorLabel: 'error-label',
		hidden: 'hidden',
		inputField: 'input-field',
		invalid: 'invalid',
		mediumEditor: 'use-medium-editor',
		required: 'req'
	};

	class Form {
		// When creating a new Form, we can pass in a selected element (i.e. doc.querySelect( '#form' ))
		// or we can pass in a selector (i.e. '#form' )
		constructor( el ) {
			if ( typeof el === 'string' ) {
				el = app.$( el );
			}
			
			this.container = el;
			this.fields = el.querySelectorAll( 'input:not([type="file"]),textarea,.text-editor,select' );
			this.reqFields = el.querySelectorAll( '.' + formCssClasses.required );
			this.inputFields = el.querySelectorAll( '.' + formCssClasses.inputField );

			this.initFormElements = this.initFormElements.bind( this );
			this.initEditors = this.initEditors.bind( this );
			this.checkActiveInputs = this.checkActiveInputs.bind( this );
			this.validateFields = this.validateFields.bind( this );
			this.collectData = this.collectData.bind( this );
			this.setFieldValues = this.setFieldValues.bind( this );
			this.clearForm = this.clearForm.bind( this );

			this.initFormElements();
			this.initEditors();
		}

		// This function will loop through all input field elements to check for
		// inputs and select elements to create our custom TextBox or Select objects
		initFormElements() {
			app.$.forEach( this.inputFields, container => {
				let select = container.querySelector( 'select' );
				let input = container.querySelector( 'input' );
				
				if ( select && !select.Select ) {
					select.Select = new app.Select( select );
				}

				if ( !input ) {
					input = container.querySelector( 'textarea' );
				}

				if ( !input ) {
					input = container.querySelector( '.' + formCssClasses.mediumEditor );
				}

				if ( input ) {
					let tag = input.tagName.toLowerCase();
					let type = input.type.toLowerCase();

					if ( !input.TextBox && type !== 'checkbox' && type !== 'radio' ) {
						input.TextBox = new app.TextBox( input );
					}
				}
			} );
		}

		// Helper functions to initialize textareas with MediumEditor or CKEDITOR
		// depending on specified class
		initEditors() {
			app.$.forEach( this.fields, field => {
				if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					if ( !window.MediumEditor ) {
						console.warn( 'MediumEditor source not found. Unable to use MediumEditor.' );
					}
					else {
						new MediumEditor( field, {
							placeholder: {
								text: ''
							}
						} );
					}
				}
				else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
					if ( !window.CKEDITOR ) {
						console.warn( 'CKEDITOR source not found. Unable to use CKEDITOR' );
					}
					else {
						CKEDITOR.replace( field.id, ckEditorSettings );

						if ( field.classList.contains( 'ckfinder' ) ) {
							CKFinder.setupCKEditor( CKEDITOR.instances[field.id], '/ckfinder/' );
						}
					}
				}
			} );
		}

		// Check if inputs/selects have values to set or remove active class
		// on the sibling label
		checkActiveInputs() {
			app.$.forEach( this.inputFields, container => {
				let lbl = container.querySelector( 'label' );
				let select = container.querySelector( 'select' );
				let input = container.querySelector( 'input' );

				if ( lbl ) {
					lbl.classList.remove( 'active' );
				}

				if ( select && select.Select ) {
					select.Select.checkForValue();
				}

				if ( !input ) {
					input = container.querySelector( 'textarea' );
				}

				if ( !input ) {
					input = container.querySelector( '.' + formCssClasses.mediumEditor );
				}

				if ( input && input.TextBox ) {
					input.TextBox.checkForValue();
				}
			} );
		}

		// Helper function to check if required fields have valid data
		validateFields() {
			let isValid = true;

			app.$.forEach( this.reqFields, field => {
				let val = '';
				let tag = field.tagName.toLowerCase();

				if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					val = field.innerHTML;
				}
				else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
					val = CKEDITOR.instances[field.id].getData().trim();
				}
				else if ( tag === 'select' ) {
					if ( field.Select ) {
						val = field.Select.getValue();
					}
					else if ( !field.classList.contains( formCssClasses.chosenSelect ) ) {
						val = field.options[field.selectedIndex].value;
					}
				}
				else {
					val = field.value.trim();
				}

				if ( val === '' || val === '-1' || val === -1 ) {
					field.classList.add( formCssClasses.invalid );
					isValid = false;
				}
				else {
					field.value = val;
					field.classList.remove( formCssClasses.invalid );
				}
			} );

			return isValid;
		}

		// Helper function to collect data from form fields and return as
		// JSON key/value pair object. Uses the element's name attribute as the key.
		collectData() {
			let params = {};

			app.$.forEach( this.fields, field => {
				let key = field.getAttribute( 'name' );
				let val = '';
				let tag = field.tagName.toLowerCase();
				let type = field.type ? field.type.toLowerCase() : '';

				if ( type === 'checkbox' ) {
					val = field.checked;
				}
				else if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					val = field.innerHTML;
				}
				else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
					val = CKEDITOR.instances[field.id].getData().trim();
				}
				else if ( tag === 'select' ) {
					if ( field.Select ) {
						val = field.Select.getValue();
					}
					else if ( !field.classList.contains( formCssClasses.chosenSelect ) ) {
						val = field.options[field.selectedIndex].value;
					}
				}
				else {
					val = field.value.trim();

					if ( field.classList.contains( 'integer' ) ) {
						val = parseInt( val, 10 );
					}
					else if ( field.classList.contains( 'decimal' ) ) {
						val = parseFloat( val );
					}
				}

				params[key] = val;
			} );

			return params;
		}

		// Helper function to set the values of form fields. Will use the 
		// name attribute of each field element to select the respective value
		// from the obj parameter.
		setFieldValues( obj ) {
			app.$.forEach( this.fields, field => {
				let val = obj[field.getAttribute( 'name' )];
				let type = field.type ? field.type.toLowerCase() : '';
				let tag = field.tagName.toLowerCase();

				if ( !obj ) {
					console.warn( 'Property does not exist for key ' + field.getAttribute( 'name' ) );
				}
				else {
					if ( type === 'checkbox' ) {
						field.checked = val;
					}
					else if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
						field.innerHTML = val;
					}
					else if ( field.classList.contains( formCssClasses.ckeditor ) ) {
						val = CKEDITOR.instances[field.id].setData( val );
					}
					else if ( tag === 'select' && field.Select ) {
						field.Select.setValue( val );
					}
					else {
						if ( field.classList.contains( 'input-date' ) ) {
							if ( obj[field.getAttribute( 'name' ) + 'Str'] ) {
								val = obj[field.getAttribute( 'name' ) + 'Str'];
							}
							else {
								val = moment( val ).format( 'MM/DD/YYYY' );
							}
						}

						field.value = val;
					}
				}
			} );

			this.checkActiveInputs();
		}

		// Helper function to clear out the values of a form. Will additionally
		// remove all HTML from containers with class .row-preview and hide
		// all elements with class .btn-item-upload-delete. It will then
		// run checkActiveInputs to reset the labels.
		clearForm() {
			app.$.forEach( this.fields, field => {
				let lbl = field.querySelector( '.' + formCssClasses.errorLabel );
				let type = field.type ? field.type.toLowerCase() : '';
				let tag = field.tagName.toLowerCase();

				if ( type === 'checkbox' ) {
					field.checked = false;
				}
				else if ( field.classList.contains( formCssClasses.mediumEditor ) ) {
					field.innerHTML = '';
				}
				else if ( tag === 'textarea' ) {
					CKEDITOR.instances[field.id].setData( '' );
				}
				else if ( tag === 'select' ) {
					if ( field.Select ) {
						field.Select.setValue( '-1' );
					}
					else if ( field.multiple && field.classList.contains( formCssClasses.chosenSelect ) ) {
						app.$.forEach( field.querySelectorAll( 'option' ), function( opt ) {
							opt.selected = false;
						} );

						jQuery( field ).trigger( 'chosen:updated' );
					}
					else {
						field.value = '-1';
					}
				}
				else {
					field.value = '';
				}

				field.classList.remove( formCssClasses.invalid );

				if ( lbl ) {
					field.parentNode.removeChild( lbl );
				}
			} );

			app.$.forEach( '.row-preview', row => {
				row.innerHTML = '';
			}, this.container );

			app.$.forEach( '.btn-item-upload-delete', btn => {
				btn.classList.add( 'hidden' );
			}, this.container );

			this.checkActiveInputs();
		}

		hide() {
			this.container.classList.add( formCssClasses.hidden );
		}

		show() {
			this.checkActiveInputs();
			this.container.classList.remove( formCssClasses.hidden );
		}
	}

	// Expose the Form object to the rest of the project
	app.Form = Form;
}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 */
( function( doc ) {
	'use strict';

	const cssClasses = {
		ERROR_LABEL: 'error-label',
		INVALID_REQ_FIELD: 'invalid',
		MD_MENU: 'md-select',
		MENU: 'md-select-menu',
		MENU_OPEN: 'active',
		LIST_ITEM: 'md-select-menu-item',
		LIST_ITEM_HOVER: 'keyover',
		REQUIRED_FIELD: 'req'
	};

	class Select {
		constructor( select ) {
			// if on a touch device, default to native select
			if ( 'ontouchstart' in doc.documentElement && app.$.mq( '(max-width:1024px)' ) ) {
				return;
			}

			// elements
			this.select = select;
			this.select.classList.add( cssClasses.MD_MENU );
			this.container = this.select.parentNode;
			this.label = this.container.querySelector( 'label' );
			this.menu = null;

			// if this is a multiple select
			this.multiple = this.select.multiple;

			this.open = false;
			this.currentIndex = 0;

			this.listItems = [];

			//this.onChange = function() { };

			this.createMenu = this.createMenu.bind( this );
			this.setMenuPosition = this.setMenuPosition.bind( this );
			this.showMenu = this.showMenu.bind( this );
			this.hideMenu = this.hideMenu.bind( this );
			this.changeHandler = this.changeHandler.bind( this );
			this.focusHanlder = this.focusHanlder.bind( this );
			this.blurHandler = this.blurHandler.bind( this );
			this.keyDownHandler = this.keyDownHandler.bind( this );
			this.bodyClickHandler = this.bodyClickHandler.bind( this );
			this.checkIfRequired = this.checkIfRequired.bind( this );

			this.createMenu();
			this.addEventListeners();
		}

		addEventListeners() {
			this.select.addEventListener( 'focus', this.focusHanlder, false );
			this.select.addEventListener( 'blur', this.blurHandler, false );
		}

		// add change event
		setChangeEvent( fn ) {
			this.onChange = fn;
		}

		// create the drop down
		createMenu() {
			let opts = this.select.children;
			let len = opts.length;
			let i;
			let opt;
			let listItem;
			let li;

			this.menu = doc.createElement( 'ul' );
			this.menu.classList.add( cssClasses.MENU );

			// loop through all of the options and create the ListItems
			for ( i = 0; i < len; i++ ) {
				opt = opts[i];

				listItem = new ListItem( opt, i, this );
				this.listItems.push( listItem );
				this.menu.appendChild( listItem.listItem );
			}

			doc.body.appendChild( this.menu );

			this.setMenuPosition();
		}

		// reset the menu
		reloadMenu() {
			let container;

			if ( this.menu ) {
				container = this.menu.parentNode;
				container.removeChild( this.menu );
				this.listItems = [];
				this.createMenu();
			}
		}

		// set the menu position on the page
		setMenuPosition() {
			const rect = this.select.getBoundingClientRect();
			this.menu.style.top = rect.bottom + app.util.getWindowScrollPosition() + 'px';
			this.menu.style.left = rect.left + 'px';
			this.menu.style.width = this.select.offsetWidth + 'px';
		}

		// show the menu
		showMenu() {
			let me = this;

			// always start at the top of the list
			this.menu.scrollTop = 0;

			this.currentIndex = -1;
			this.menu.classList.add( cssClasses.MENU_OPEN );
			this.open = true;

			setTimeout( function() {
				doc.body.addEventListener( 'keydown', me.keyDownHandler, false );
				doc.body.addEventListener( 'click', me.bodyClickHandler, false );

				me.select.blur();
			}, 100 );
						
			// disable window from scrolling
			app.util.disableWindowScroll();
		}

		// hide the menu
		hideMenu() {
			let item;

			this.menu.classList.remove( cssClasses.MENU_OPEN );
			this.open = false;

			// make sure no listItems ahve the keyover class
			item = this.menu.querySelector( '.' + cssClasses.LIST_ITEM_HOVER );

			if ( item ) {
				item.classList.remove( cssClasses.LIST_ITEM_HOVER );
			}

			// remove event listeners
			doc.body.removeEventListener( 'keydown', this.keyDownHandler, false );
			doc.body.removeEventListener( 'click', this.bodyClickHandler, false );

			// re-enable window scrolling
			app.util.enableWindowScroll();
		}

		focusHanlder( e ) {
			this.setMenuPosition();
			this.showMenu();
		}

		blurHandler( e ) {
			
		}

		keyDownHandler( e ) {
			let index = this.currentIndex;
			let keyCode = -1;
			let menuScrollTop = this.menu.scrollTop;
			let menuHeight = this.menu.offsetHeight;
			let li;

			if ( e && e.keyCode ) {
				keyCode = e.keyCode;
				
				if ( keyCode === 9 ) {
					this.hideMenu();
					e.preventDefault();
				}

				// move down the list
				else if ( keyCode === 40 ) {
					e.preventDefault();
					this.currentIndex++;

					if ( this.currentIndex === this.listItems.length ) {
						this.currentIndex--;
						return;
					}

					if ( index >= 0 ) {
						this.listItems[index].listItem.classList.remove( cssClasses.LIST_ITEM_HOVER );
					}

					li = this.listItems[this.currentIndex].listItem;
					li.classList.add( cssClasses.LIST_ITEM_HOVER );

					// check scroll top
					if ( li.offsetTop + li.offsetHeight > menuScrollTop + menuHeight ) {
						this.menu.scrollTop = menuScrollTop + li.offsetHeight;
					}
				}

				// move up the list
				else if ( keyCode === 38 ) {
					e.preventDefault();
					this.currentIndex--;

					if ( this.currentIndex < 0 ) {
						this.currentIndex = -1;
						return;
					}

					if ( index >= 0 ) {
						this.listItems[index].listItem.classList.remove( cssClasses.LIST_ITEM_HOVER );
					}

					if ( this.currentIndex >= 0 ) {
						li = this.listItems[this.currentIndex].listItem;
						li.classList.add( cssClasses.LIST_ITEM_HOVER );

						// check scroll top
						if ( li.offsetTop < menuScrollTop ) {
							this.menu.scrollTop = menuScrollTop - li.offsetHeight;
						}
					}
				}

				// enter key is clicked
				else if ( keyCode === 13 ) {
					e.preventDefault();

					if ( this.currentIndex === -1 ) {
						this.currentIndex = 0;
					}

					// trigger list item click
					this.listItems[this.currentIndex].selectItem();
				}

				// if escape key is clicked
				else if ( keyCode === 27 ) {
					e.preventDefault();
					this.hideMenu();
				}
			}
		}

		changeHandler( e ) {
			if ( this.onChange && typeof this.onChange === 'function' ) {
				this.onChange();
			}
		}

		bodyClickHandler( e ) {
			if ( e && e.target && ( e.target === this.select || e.target.classList.contains( cssClasses.LIST_ITEM ) || e.target.classList.contains( 'btn-ripple-container' ) || e.target.classList.contains( 'btn-ripple-element' ) ) ) {
				// let the list item click event handle this
			}
			else {
				// clicked outside of the menu, hide the menu
				this.hideMenu();
			}
		}

		checkForValue() {

		}

		checkIfRequired() {
			let selected = this.menu.querySelector( '[selected="true"]' );
			let errorLbl = this.container.querySelector( '.' + cssClasses.ERROR_LABEL );
			let lbl;

			// remove any previous error messages
			if ( errorLbl ) {
				this.container.removeChild( errorLbl );
			}

			// if we don't have a selected option and this is a required field
			if ( !selected && this.select.classList.contains( cssClasses.REQUIRED_FIELD ) ) {
				lbl = doc.createElement( 'span ' );
				lbl.classList.add( cssClasses.ERROR_LABEL );
				lbl.textContent = 'Required field.';
				this.container.appendChild( lbl );
				this.select.classList.add( cssClasses.INVALID_REQ_FIELD );
			}

			// if we're all good, rmeove the invalid class
			else {
				this.select.classList.remove( cssClasses.INVALID_REQ_FIELD );
			}
		}

		setValue( value ) {
			let li = this.menu.querySelector( '[data-val="' + value + '"]' );
			let i = 0;
			let len = this.listItems.length;
			let listItem = null;

			if ( li ) {
				for ( i = 0; i < len; i++ ) {
					listItem = this.listItems[i];

					if ( listItem.listItem === li ) {
						if ( !listItem.listItem.getAttribute( 'selected' ) ) {
							listItem.selectItem();
						}
					}
				}
			}
		}

		getValue() {
			if ( !this.multiple ) {
				return this.select.options[this.select.selectedIndex].value;
			}
		}

		getTextValue() {
			if ( !this.multiple ) {
				return this.select.options[this.selectedIndex].text;
			}
		}
	}

	class ListItem {
		constructor( opt, index, select ) {
			this.listItem = doc.createElement( 'li' );
			this.select = select;
			this.index = index;

			this.listItem.classList.add( cssClasses.LIST_ITEM );
			this.listItem.classList.add( 'btn-ripple' );
			this.listItem.textContent = opt.textContent;
			this.listItem.setAttribute( 'data-val', opt.value );

			if ( opt.selected ) {
				this.listItem.setAttribute( 'selected', 'true' );
			}

			this.selectItem = this.selectItem.bind( this );

			this.addEventListeners();

			return this;
		}

		addEventListeners() {
			this.listItem.addEventListener( 'click', this.selectItem, false );
		}

		selectItem( e ) {
			let selected;
			
			// if clicking the currently selected item
			if ( this.listItem.getAttribute( 'selected' ) === 'true' ) {
				this.listItem.removeAttribute( 'selected' );

				if ( !this.select.multiple ) {
					this.select.select.value = '';
				}

				this.select.checkIfRequired();
			}
			else {
				// check if an item is already selected
				selected = this.select.menu.querySelector( '[selected="true"]' );

				// unselect a previously selected item if this is not a multiple select
				if ( selected && !this.select.multiple ) {
					selected.removeAttribute( 'selected' );
				}

				// select the selected item
				this.listItem.setAttribute( 'selected', 'true' );

				// update the selected element
				if ( !this.select.multiple ) {
					this.select.select.value = this.listItem.getAttribute( 'data-val' );
					this.select.checkIfRequired();
				}

				this.select.select.classList.remove( cssClasses.INVALID_REQ_FIELD );

				// hide the menu if this ins not a multiple select
				if ( !this.select.multiple ) {
					this.select.hideMenu();
				}
			}

			this.select.changeHandler();

			if ( e ) {
				e.stopPropagation();
			}
		}
	}

	app.Select = Select;

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2016 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 * @version: 1.0.0
 * 
 * Corresponding HTML should follow:
 * 
 * <div class="input-field">
 *   <input type="text" id="tb-mytb" name="dbCol" />
 *   <label for="tb-mytb">Label Text</label>
 * </div>
 * 
 * To make a field required, add class="req"
 * To make a field use a datepicker, add class="input-date"
 * 
 * To autovalidate email, set type="email"
 * To auotvalidate phone numbers, set type="tel" 
 */
( function( doc ) {
	'use strict';

	const cssClasses = {
		ACTIVE_FIELD_CLASS: 'active',
		DATE_SELECTOR: 'input-date',
		ERROR_LABEL: 'error-label',
		INVALID_REQ_FIELD: 'invalid',
		REQUIRED_FIELD: 'req'
	};

	// Regex's for validating field data
	const regExpressions = {
		EMAIL: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
		TEL: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
		DATE: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/
	};

	class TextBox {
		// Provide the input element for this TextBox
		constructor( input ) {
			// elements
			this.input = input;
			this.container = input.parentNode;
			this.label = this.container.querySelector( 'label' );

			// check for date
			if ( this.input.classList.contains( cssClasses.DATE_SELECTOR ) ) {
				this.initDatePicker();
			}

			// check for initial value
			this.checkForValue();

			this.initDatePicker = this.initDatePicker.bind( this );
			this.focusHandler = this.focusHandler.bind( this );
			this.blurHandler = this.blurHandler.bind( this );
			this.validateField = this.validateField.bind( this );
			this.checkForValue = this.checkForValue.bind( this );
			this.setValue = this.setValue.bind( this );
			this.getValue = this.getValue.bind( this );

			this.addEventListeners();
		}

		// Add the event listeners
		addEventListeners() {
			this.input.addEventListener( 'focus', this.focusHandler, false );
			this.input.addEventListener( 'blur', this.blurHandler, false );
			this.input.addEventListener( 'change', this.checkForValue, false );
		}

		// Initialize the date picker if the input has class .input-date
		initDatePicker() {
			let field = this.input;
			let picker;

			// make sure it is a text input
			field.type = 'text';

			// if touch device use default date picker
			if ( 'ontouchstart' in doc.documentElement ) {
				field.type = 'date';
				return;
			}

			picker = new Pikaday( {
				field: field,
				format: 'MM/DD/YYYY',
				onSelect: function() {
					field.value = this.getMoment().format( 'MM/DD/YYYY' );
				}
			} );
		}

		// OnFocus event handler
		focusHandler() {
			this.label.classList.add( cssClasses.ACTIVE_FIELD_CLASS );
		}

		// OnBlur event handler
		blurHandler() {
			this.checkForValue();
			this.validateField();
		}

		// Helper function to check for a value and handle the active class of the label
		checkForValue() {
			if ( this.getValue() !== '' ) {
				this.label.classList.add( cssClasses.ACTIVE_FIELD_CLASS );
				this.validateField();
			}
			else {
				this.label.classList.remove( cssClasses.ACTIVE_FIELD_CLASS );
			}
		}

		// Helper function to provide validation of field data based on input type and classes
		validateField() {
			let field = this.input;
			let type = field.type.toLowerCase();
			let valid = true;
			let val = this.getValue();
			let minChars = field.getAttribute( 'min-chars' );
			let prevError = this.container.querySelector( '.' + cssClasses.ERROR_LABEL );
			let lbl;
			let msg = '';

			// check for a value in a required field
			if ( field.classList.contains( cssClasses.REQUIRED_FIELD ) && val === '' ) {
				valid = false;
				msg = 'Required field.';
			}

			// check for min characters
			else if ( minChars && val.length < parseInt( minChars, 10 ) ) {
				valid = false;
				msg = minChars + ' characters required.';
			}

			// check for valid email address
			else if ( type === 'email' && !regExpressions.EMAIL.test( val ) ) {
				valid = false;
				msg = 'Invalid email address.';
			}

			// check for valid phone number
			else if ( type === 'tel' && !regExpressions.TEL.test( val ) ) {
				valid = false;
				msg = 'Inavlid phone number.';
			}

			// check for date
			else if ( field.classList.contains( cssClasses.DATE_SELECTOR ) && !regExpressions.DATE.test( val ) ) {
				valid = false;
				msg = 'Incorrect date format.';
			}

			// remove any previous error messages
			if ( prevError ) {
				this.container.removeChild( prevError );
			}

			// if the field is valid
			if ( valid ) {
				field.classList.remove( cssClasses.INVALID_REQ_FIELD );
			}

			// if invalid, make sure it is highlighted
			else {
				field.classList.add( cssClasses.INVALID_REQ_FIELD );

				// if we have a message
				if ( msg !== '' ) {
					lbl = doc.createElement( 'span' );
					lbl.classList.add( cssClasses.ERROR_LABEL );
					lbl.textContent = msg;
					this.container.appendChild( lbl );
				}
			}
		}

		// Helper function to set the value of the input
		setValue( val ) {
			this.input.value = val;
			this.checkForValue();
			this.validateField();
		}

		// Helper function get the value of the input
		getValue() {
			return this.input.value.trim();
		}
	}

	// Expose the TextBox object to the app
	app.TextBox = TextBox;

}( document ) );
/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    // if we're on the front end setup proper handlers
    if ( doc.body.hasAttribute( 'frontend' ) ) {
        app.Router.init();
        app.Nav.init();
    }

}( document ) );
/**
* Copyright 2016 Select Interactive, LLC. All rights reserved.
* @author: The Select Interactive dev team (www.select-interactive.com)
*/
(function( doc ) {
    'use strict';

    const hdr = app.$( '#hdr-main' );

    if ( hdr ) {
        window.addEventListener( 'scroll', e => {
            if ( doc.body.classList.contains( 'home' ) ) {
                let wh = window.innerHeight;
                let y = window.scrollY;

                if ( y >= wh / 2.5 ) {
                    doc.body.classList.remove( 'home-top' );
                }
                else {
                    doc.body.classList.add( 'home-top' );
                }
            }
        } );
    }

}( document ) );
///<reference path="../main.js">
/**
 * Copyright 2015 Select Interactive, LLC. All rights reserved.
 * @author: The Select Interactive dev team (www.select-interactive.com) 
 */
( function( doc ) {
	'use strict';

	if ( 'serviceWorker' in navigator && doc.URL.indexOf( 'localhost' ) === -1 ) {
		navigator.serviceWorker.register( '/serviceworker.js' ).then( registration => {
			console.log( 'serviceworker registration successful with scope: ' + registration.scope );
		} ).catch( err => {
			console.log( 'serviceworker registration failed: ', err );
		} );
	}

}( document ) );