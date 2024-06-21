/*!
 * japanese-string-utils
 * https://github.com/yomotsu/japanese-string-utils
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.japaneseStringUtils = {}));
}(this, (function (exports) { 'use strict';

	function toAscii(value) {
	    var charArray = [];
	    for (var i = value.length - 1; 0 <= i; i--) {
	        var charCode = charArray[i] = value.charCodeAt(i);
	        switch (true) {
	            case (charCode <= 0xff5e && 0xff01 <= charCode):
	                charArray[i] -= 0xfee0;
	                break;
	            case (charCode === 0x3000):
	                charArray[i] = 0x0020;
	                break;
	            case (charCode === 0x30FC):
	                charArray[i] = 0x002D;
	                break;
	        }
	    }
	    return String.fromCharCode.apply(null, charArray);
	}

	function toFullwidth(value) {
	    var charArray = [];
	    for (var i = value.length - 1; 0 <= i; i--) {
	        var charCode = charArray[i] = value.charCodeAt(i);
	        switch (true) {
	            case (charCode <= 0x007E && 0x0021 <= charCode):
	                charArray[i] += 0xFEE0;
	                break;
	            case (charCode === 0x0020):
	                charArray[i] = 0x3000;
	                break;
	        }
	    }
	    return String.fromCharCode.apply(null, charArray);
	}

	var DAKUTEN = 0x309B;
	var HAN_DAKUTEN = 0x309C;
	function toNFC(value) {
	    var charArray = [];
	    for (var i = 0; i < value.length; i++) {
	        var charCode = value.charCodeAt(i);
	        switch (true) {
	            case (0x304B <= charCode && charCode <= 0x3062 && (charCode % 2 === 1)):
	            case (0x30AB <= charCode && charCode <= 0x30C2 && (charCode % 2 === 1)):
	            case (0x3064 <= charCode && charCode <= 0x3069 && (charCode % 2 === 0)):
	            case (0x30C4 <= charCode && charCode <= 0x30C9 && (charCode % 2 === 0)): {
	                var nextChar = value.charCodeAt(i + 1);
	                charArray.push(charCode + (nextChar === DAKUTEN ? 1 : 0));
	                if (charArray[charArray.length - 1] !== charCode)
	                    i++;
	                break;
	            }
	            case (0x306F <= charCode && charCode <= 0x307F && (charCode % 3 === 0)):
	            case (0x30CF <= charCode && charCode <= 0x30DD && (charCode % 3 === 0)): {
	                var nextChar = value.charCodeAt(i + 1);
	                charArray.push(charCode + (nextChar === DAKUTEN ? 1 : nextChar === HAN_DAKUTEN ? 2 : 0));
	                if (charArray[charArray.length - 1] !== charCode)
	                    i++;
	                break;
	            }
	            case (0x3046 === charCode || 0x30a6 === charCode): {
	                var nextChar = value.charCodeAt(i + 1);
	                charArray.push(charCode + (nextChar === DAKUTEN ? 78 : 0));
	                if (charArray[charArray.length - 1] != charCode)
	                    i++;
	                break;
	            }
	            default:
	                charArray.push(charCode);
	                break;
	        }
	    }
	    return String.fromCharCode.apply(null, charArray);
	}

	var fullwidthKanaMap = {
	    0xFF66: 0x30F2, 0xFF67: 0x30A1, 0xFF68: 0x30A3, 0xFF69: 0x30A5, 0xFF6A: 0x30A7,
	    0xFF6B: 0x30A9, 0xff6c: 0x30e3, 0xff6d: 0x30e5, 0xff6e: 0x30e7, 0xff6f: 0x30c3,
	    0xFF70: 0x30FC, 0xFF71: 0x30A2, 0xFF72: 0x30A4, 0xFF73: 0x30A6, 0xFF74: 0x30A8,
	    0xFF75: 0x30AA, 0xFF76: 0x30AB, 0xFF77: 0x30AD, 0xFF78: 0x30AF, 0xFF79: 0x30B1,
	    0xFF7A: 0x30B3, 0xFF7B: 0x30B5, 0xFF7C: 0x30B7, 0xFF7D: 0x30B9, 0xFF7E: 0x30BB,
	    0xFF7F: 0x30BD, 0xFF80: 0x30BF, 0xFF81: 0x30C1, 0xFF82: 0x30C4, 0xFF83: 0x30C6,
	    0xFF84: 0x30C8, 0xFF85: 0x30CA, 0xFF86: 0x30CB, 0xFF87: 0x30CC, 0xFF88: 0x30CD,
	    0xFF89: 0x30CE, 0xFF8A: 0x30CF, 0xFF8B: 0x30D2, 0xFF8C: 0x30D5, 0xFF8D: 0x30D8,
	    0xFF8E: 0x30DB, 0xFF8F: 0x30DE, 0xFF90: 0x30DF, 0xFF91: 0x30E0, 0xFF92: 0x30E1,
	    0xFF93: 0x30E2, 0xFF94: 0x30E4, 0xFF95: 0x30E6, 0xFF96: 0x30E8, 0xFF97: 0x30E9,
	    0xFF98: 0x30EA, 0xFF99: 0x30EB, 0xFF9A: 0x30EC, 0xFF9B: 0x30ED, 0xFF9C: 0x30EF,
	    0xFF9D: 0x30F3, 0xFF9E: 0x309B, 0xFF9F: 0x309C,
	};
	function toFullwidthKana(value) {
	    var charArray = [];
	    for (var i = value.length - 1; 0 <= i; i--) {
	        var charCode = value.charCodeAt(i);
	        if (fullwidthKanaMap[charCode]) {
	            charArray[i] = fullwidthKanaMap[charCode];
	        }
	        else {
	            charArray[i] = charCode;
	        }
	    }
	    return toNFC(String.fromCharCode.apply(null, charArray));
	}

	var halfwidthKanaMap = {
	    0x30A1: 0xFF67, 0x30A3: 0xFF68, 0x30A5: 0xFF69, 0x30A7: 0xFF6A, 0x30A9: 0xFF6B,
	    0x30e3: 0xff6c, 0x30e5: 0xff6d, 0x30e7: 0xff6e, 0x30c3: 0xff6f, 0x30FC: 0xFF70,
	    0x30A2: 0xFF71, 0x30A4: 0xFF72, 0x30A6: 0xFF73, 0x30A8: 0xFF74, 0x30AA: 0xFF75,
	    0x30AB: 0xFF76, 0x30AD: 0xFF77, 0x30AF: 0xFF78, 0x30B1: 0xFF79, 0x30B3: 0xFF7A,
	    0x30B5: 0xFF7B, 0x30B7: 0xFF7C, 0x30B9: 0xFF7D, 0x30BB: 0xFF7E, 0x30BD: 0xFF7F,
	    0x30BF: 0xFF80, 0x30C1: 0xFF81, 0x30C4: 0xFF82, 0x30C6: 0xFF83, 0x30C8: 0xFF84,
	    0x30CA: 0xFF85, 0x30CB: 0xFF86, 0x30CC: 0xFF87, 0x30CD: 0xFF88, 0x30CE: 0xFF89,
	    0x30CF: 0xFF8A, 0x30D2: 0xFF8B, 0x30D5: 0xFF8C, 0x30D8: 0xFF8D, 0x30DB: 0xFF8E,
	    0x30DE: 0xFF8F, 0x30DF: 0xFF90, 0x30E0: 0xFF91, 0x30E1: 0xFF92, 0x30E2: 0xFF93,
	    0x30E4: 0xFF94, 0x30E6: 0xFF95, 0x30E8: 0xFF96, 0x30E9: 0xFF97, 0x30EA: 0xFF98,
	    0x30EB: 0xFF99, 0x30EC: 0xFF9A, 0x30ED: 0xFF9B, 0x30EF: 0xFF9C, 0x30F3: 0xFF9D,
	    0x309B: 0xFF9E, 0x309C: 0xFF9F, 0x30F2: 0xFF66,
	};
	function toHalfwidthKana(value) {
	    var charArray = [];
	    for (var i = 0; i < value.length; i++) {
	        var charCode = value.charCodeAt(i);
	        switch (true) {
	            case (charCode in halfwidthKanaMap):
	                charArray.push(halfwidthKanaMap[charCode]);
	                break;
	            case (0x30AB <= charCode && charCode <= 0x30C9):
	                charArray.push(halfwidthKanaMap[charCode - 1], 0xFF9E);
	                break;
	            case (0x30CF <= charCode && charCode <= 0x30DD):
	                charArray.push(halfwidthKanaMap[charCode - charCode % 3], [0xFF9E, 0xFF9F][charCode % 3 - 1]);
	                break;
	            case (0x30f4 === charCode):
	                charArray.push(0xff73, 0xFF9E);
	                break;
	            default:
	                charArray.push(charCode);
	                break;
	        }
	    }
	    return String.fromCharCode.apply(null, charArray);
	}

	function toHiragana(value) {
	    var charArray = [];
	    for (var i = value.length - 1; 0 <= i; i--) {
	        var charCode = value.charCodeAt(i);
	        charArray[i] = (0x30A1 <= charCode && charCode <= 0x30F6) ? charCode - 0x0060 : charCode;
	    }
	    return String.fromCharCode.apply(null, charArray);
	}

	function toKatakana(value) {
	    var charArray = [];
	    for (var i = value.length - 1; 0 <= i; i--) {
	        var charCode = value.charCodeAt(i);
	        if (0x3041 <= charCode && charCode <= 0x3096) {
	            charArray[i] = charCode + 0x0060;
	        }
	        else {
	            charArray[i] = charCode;
	        }
	    }
	    return String.fromCharCode.apply(null, charArray);
	}

	function toNumeric(value) {
	    var asciiString = toAscii(value)
	        .replace(/[^0-9.-]/g, '')
	        .replace(/(?!^)-/g, '')
	        .replace(/\.+/, '.')
	        .replace(/^(-)?0+/, '$10')
	        .replace(/^(-)?0([1-9]+)/, '$1$2');
	    var contains2MoreDot = /\..*\./.test(asciiString);
	    if (!contains2MoreDot)
	        return asciiString;
	    var array = asciiString.split('.');
	    var intPart = array.shift();
	    var fractPart = array.join('');
	    if (fractPart)
	        return intPart + "." + fractPart;
	    return intPart;
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

	function __spreadArrays() {
	    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	    for (var r = Array(s), k = 0, i = 0; i < il; i++)
	        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
	            r[k] = a[j];
	    return r;
	}

	var normalizeMap = {
	    '0': '〇', '０': '〇', '零': '〇',
	    '1': '一', '１': '一', '壱': '一', '壹': '一', '弌': '一',
	    '2': '二', '２': '二', '弐': '二', '貳': '二',
	    '3': '三', '３': '三', '参': '三', '參': '三',
	    '4': '四', '４': '四', '肆': '四',
	    '5': '五', '５': '五', '伍': '五',
	    '6': '六', '６': '六', '陸': '六',
	    '7': '七', '７': '七', '漆': '七', '柒': '七', '質': '七',
	    '8': '八', '８': '八', '捌': '八',
	    '9': '九', '９': '九', '玖': '九',
	    '拾': '十',
	    '廿': '二十',
	    '卅': '三十',
	    '丗': '三十',
	    '卌': '四十',
	    '佰': '百', '陌': '百',
	    '仟': '千', '阡': '千',
	    '萬': '万',
	    '．': '.', '。': '.', '・': '.',
	    'ー': '-', '−': '-',
	    '＋': '+',
	};
	var needsNormalizePattern = new RegExp("[" + Object.keys(normalizeMap).join('|') + "]", 'g');
	var basicNumber = {
	    '\u3007': 0,
	    '\u4E00': 1,
	    '\u4E8C': 2,
	    '\u4E09': 3,
	    '\u56DB': 4,
	    '\u4E94': 5,
	    '\u516D': 6,
	    '\u4E03': 7,
	    '\u516B': 8,
	    '\u4E5D': 9,
	};
	var basicDigit = {
	    '\u5341': 1e1,
	    '\u767E': 1e2,
	    '\u5343': 1e3,
	};
	var largeDigit = {
	    '\u4E07': 1e4,
	    '\u5104': 1e8,
	    '\u5146': 1e12,
	};
	var basicDigitPattern = new RegExp("[" + Object.keys(basicDigit).join('|') + "]");
	var largeDigitPattern = new RegExp("[" + Object.keys(largeDigit).join('|') + "]");
	var simpleDigitPattern = new RegExp("[" + __spreadArrays(Object.keys(basicDigit), Object.keys(largeDigit)).join('|') + "]");
	var complexLargeDigitPattern = new RegExp("([" + Object.keys(basicDigit).join('|') + "][" + Object.keys(largeDigit).join('|') + "])");
	function toNumericFromKanji(value) {
	    var normalizedValue = value.trim();
	    var matched = value.match(needsNormalizePattern);
	    matched && matched.forEach(function (char) {
	        normalizedValue = normalizedValue.replace(char, normalizeMap[char]);
	    });
	    var chunks = [];
	    var signMatched = normalizedValue.match(/^([+-])/);
	    var sign = signMatched ? signMatched[1] : '';
	    normalizedValue = normalizedValue.replace(new RegExp("[^" + __spreadArrays([
	        '.'
	    ], Object.keys(basicNumber), Object.keys(basicDigit), Object.keys(largeDigit)) + "]", 'g'), '');
	    if (normalizedValue === '')
	        return '';
	    do {
	        var matched_1 = normalizedValue.match(complexLargeDigitPattern);
	        if (!matched_1)
	            break;
	        var digit = matched_1[0];
	        var hasLeadDigit = digit.match(basicDigitPattern);
	        var leadDigit = hasLeadDigit ? basicDigit[hasLeadDigit[0]] : 1;
	        var hasMainDigit = digit.match(largeDigitPattern);
	        var mainDigit = hasMainDigit ? largeDigit[hasMainDigit[0]] : 1;
	        var numbers_1 = normalizedValue.slice(0, matched_1.index) || '1';
	        var normalizedNumbers_1 = +toNumeric(numbers_1.split('').map(function (char) {
	            return basicNumber[char] !== undefined ? basicNumber[char] : char;
	        }).join(''));
	        chunks.push(normalizedNumbers_1 * leadDigit * mainDigit);
	        normalizedValue = normalizedValue.slice(matched_1.index + digit.length);
	    } while (complexLargeDigitPattern.test(normalizedValue));
	    do {
	        var matched_2 = normalizedValue.match(simpleDigitPattern);
	        if (!matched_2)
	            break;
	        var digit = matched_2[0];
	        var mainDigit = largeDigit[digit] || basicDigit[digit] || 1;
	        var numbers_2 = normalizedValue.slice(0, matched_2.index) || '1';
	        var normalizedNumbers_2 = +toNumeric(numbers_2.split('').map(function (char) {
	            return basicNumber[char] !== undefined ? basicNumber[char] : char;
	        }).join(''));
	        chunks.push(normalizedNumbers_2 * mainDigit);
	        normalizedValue = normalizedValue.slice(matched_2.index + digit.length);
	    } while (simpleDigitPattern.test(normalizedValue));
	    var numbers = normalizedValue || '0';
	    var normalizedNumbers = +toNumeric(numbers.split('').map(function (char) {
	        return basicNumber[char] !== undefined ? basicNumber[char] : char;
	    }).join(''));
	    chunks.push(normalizedNumbers);
	    var result = chunks.reduce(function (acc, current) { return acc + current; }, 0);
	    return "" + sign + result;
	}

	function addCommas(numericString) {
	    var rgx = /(\d+)(\d{3})/;
	    var x = String(numericString).split('.');
	    var integerPart = x[0];
	    var fractionalPart = x.length > 1 ? '.' + x[1] : '';
	    while (rgx.test(integerPart)) {
	        integerPart = integerPart.replace(rgx, '$1' + ',' + '$2');
	    }
	    return integerPart + fractionalPart;
	}

	var NORMALIZED = '\u2010';
	var HYPHEN_LIKE_PATTERN = new RegExp([
	    '\u002D',
	    '\uFE63',
	    '\uFF0D',
	    '\u00AD',
	    '\u2010',
	    '\u2011',
	    '\u2012',
	    '\u2013',
	    '\u2014',
	    '\u2015',
	    '\u2043',
	    '\u2212',
	    '\u2500',
	    '\u2501',
	    '\u30FC',
	    '\uFF70',
	].join('|'), 'g');
	function normalizeHyphens(value, replacement) {
	    if (replacement === void 0) { replacement = NORMALIZED; }
	    return value.replace(HYPHEN_LIKE_PATTERN, replacement);
	}

	exports.addCommas = addCommas;
	exports.normalizeHyphens = normalizeHyphens;
	exports.toAscii = toAscii;
	exports.toFullwidth = toFullwidth;
	exports.toFullwidthKana = toFullwidthKana;
	exports.toHalfwidthKana = toHalfwidthKana;
	exports.toHiragana = toHiragana;
	exports.toKatakana = toKatakana;
	exports.toNFC = toNFC;
	exports.toNumeric = toNumeric;
	exports.toNumericFromKanji = toNumericFromKanji;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
