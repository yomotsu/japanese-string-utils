/*!
 * japanese-string-utils
 * https://github.com/yomotsu/japanese-string-utils
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */
function toAscii(value) {
    const charArray = [];
    for (let i = value.length - 1; 0 <= i; i--) {
        const charCode = charArray[i] = value.charCodeAt(i);
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
    const charArray = [];
    for (let i = value.length - 1; 0 <= i; i--) {
        const charCode = charArray[i] = value.charCodeAt(i);
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

const DAKUTEN = 0x309B;
const HAN_DAKUTEN = 0x309C;
function toNFC(value) {
    const charArray = [];
    for (let i = 0; i < value.length; i++) {
        const charCode = value.charCodeAt(i);
        switch (true) {
            case (0x304B <= charCode && charCode <= 0x3062 && (charCode % 2 === 1)):
            case (0x30AB <= charCode && charCode <= 0x30C2 && (charCode % 2 === 1)):
            case (0x3064 <= charCode && charCode <= 0x3069 && (charCode % 2 === 0)):
            case (0x30C4 <= charCode && charCode <= 0x30C9 && (charCode % 2 === 0)): {
                const nextChar = value.charCodeAt(i + 1);
                charArray.push(charCode + (nextChar === DAKUTEN ? 1 : 0));
                if (charArray[charArray.length - 1] !== charCode)
                    i++;
                break;
            }
            case (0x306F <= charCode && charCode <= 0x307F && (charCode % 3 === 0)):
            case (0x30CF <= charCode && charCode <= 0x30DD && (charCode % 3 === 0)): {
                const nextChar = value.charCodeAt(i + 1);
                charArray.push(charCode + (nextChar === DAKUTEN ? 1 : nextChar === HAN_DAKUTEN ? 2 : 0));
                if (charArray[charArray.length - 1] !== charCode)
                    i++;
                break;
            }
            case (0x3046 === charCode || 0x30a6 === charCode): {
                const nextChar = value.charCodeAt(i + 1);
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

const fullwidthKanaMap = {
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
    const charArray = [];
    for (let i = value.length - 1; 0 <= i; i--) {
        const charCode = value.charCodeAt(i);
        if (fullwidthKanaMap[charCode]) {
            charArray[i] = fullwidthKanaMap[charCode];
        }
        else {
            charArray[i] = charCode;
        }
    }
    return toNFC(String.fromCharCode.apply(null, charArray));
}

const halfwidthKanaMap = {
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
    const charArray = [];
    for (let i = 0; i < value.length; i++) {
        const charCode = value.charCodeAt(i);
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
    const charArray = [];
    for (let i = value.length - 1; 0 <= i; i--) {
        const charCode = value.charCodeAt(i);
        charArray[i] = (0x30A1 <= charCode && charCode <= 0x30F6) ? charCode - 0x0060 : charCode;
    }
    return String.fromCharCode.apply(null, charArray);
}

function toKatakana(value) {
    const charArray = [];
    for (let i = value.length - 1; 0 <= i; i--) {
        const charCode = value.charCodeAt(i);
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
    const asciiString = toAscii(value)
        .replace(/[^0-9.-]/g, '')
        .replace(/(?!^)-/g, '')
        .replace(/\.+/, '.')
        .replace(/^(-)?0+/, '$10')
        .replace(/^(-)?0([1-9]+)/, '$1$2');
    const contains2MoreDot = /\..*\./.test(asciiString);
    if (!contains2MoreDot)
        return asciiString;
    const array = asciiString.split('.');
    const intPart = array.shift();
    const fractPart = array.join('');
    if (fractPart)
        return `${intPart}.${fractPart}`;
    return intPart;
}

const ONE = '一';
const normalizeMap = {
    '0': '〇', '０': '〇', '零': '〇',
    '1': ONE, '１': ONE, '壱': ONE, '壹': ONE, '弌': ONE,
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
const needsNormalizePattern = new RegExp(`[${Object.keys(normalizeMap).join('|')}]`, 'g');
const basicNumber = {
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
const basicDigit = {
    '\u5341': 1e1,
    '\u767E': 1e2,
    '\u5343': 1e3,
};
const bigDigit = {
    '\u4E07': 1e4,
    '\u5104': 1e8,
    '\u5146': 1e12,
    '\u4EAC': 1e16,
};
const basicNumberPattern = new RegExp(`[${Object.keys(basicNumber).join('|')}]`);
const basicNumberWithDotPattern = new RegExp(`[${[...Object.keys(basicNumber), '.'].join('|')}]`);
const basicDigitPattern = new RegExp(`[${Object.keys(basicDigit).join('|')}]`);
const bigDigitPattern = new RegExp(`[${Object.keys(bigDigit).join('|')}]`);
function toNumericFromKanji(value) {
    let normalizedValue = value.trim();
    const matched = value.match(needsNormalizePattern);
    matched && matched.forEach((char) => {
        normalizedValue = normalizedValue.replace(char, normalizeMap[char]);
    });
    const signMatched = normalizedValue.match(/^([+-])/);
    const sign = signMatched ? signMatched[1] : '';
    normalizedValue = normalizedValue.replace(new RegExp(`[^${[
        '.',
        ...Object.keys(basicNumber),
        ...Object.keys(basicDigit),
        ...Object.keys(bigDigit),
    ]}]`, 'g'), '');
    if (normalizedValue === '')
        return '';
    const chunks = [{
            letters: [],
            digit: 1,
        }];
    let currentBigDigit = 1;
    for (let i = normalizedValue.length - 1; i >= 0; i--) {
        const currentChunk = chunks[chunks.length - 1];
        if (basicNumberWithDotPattern.test(normalizedValue[i])) {
            currentChunk.letters.unshift(normalizedValue[i]);
            continue;
        }
        if (basicDigitPattern.test(normalizedValue[i])) {
            const hasLeadNumber = normalizedValue[i - 1] && basicNumberPattern.test(normalizedValue[i - 1]);
            const leadNumber = hasLeadNumber ? normalizedValue[i - 1] : ONE;
            chunks.push({
                letters: [leadNumber],
                digit: basicDigit[normalizedValue[i]] * currentBigDigit,
            });
            if (hasLeadNumber)
                i--;
            continue;
        }
        if (bigDigitPattern.test(normalizedValue[i])) {
            currentBigDigit = bigDigit[normalizedValue[i]];
            chunks.push({
                letters: [],
                digit: currentBigDigit,
            });
            continue;
        }
    }
    const numbers = chunks.reduce((acc, current) => {
        const letters = current.letters.join('') || '0';
        const numbers = +toNumeric(letters.split('').map((char) => {
            return basicNumber[char] !== undefined ? basicNumber[char] : char;
        }).join(''));
        return acc + numbers * current.digit;
    }, 0);
    return `${sign}${numbers}`;
}

function addCommas(numericString) {
    const rgx = /(\d+)(\d{3})/;
    const x = String(numericString).split('.');
    let integerPart = x[0];
    const fractionalPart = x.length > 1 ? '.' + x[1] : '';
    while (rgx.test(integerPart)) {
        integerPart = integerPart.replace(rgx, '$1' + ',' + '$2');
    }
    return integerPart + fractionalPart;
}

const NORMALIZED = '\u2010';
const HYPHEN_LIKE_PATTERN = new RegExp([
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
function normalizeHyphens(value, replacement = NORMALIZED) {
    return value.replace(HYPHEN_LIKE_PATTERN, replacement);
}

export { addCommas, normalizeHyphens, toAscii, toFullwidth, toFullwidthKana, toHalfwidthKana, toHiragana, toKatakana, toNFC, toNumeric, toNumericFromKanji };
