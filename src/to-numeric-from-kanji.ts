
// 三百三三億五万千五五十五 => 33300051555

import { toNumeric } from "to-numeric";

interface normalizeMap {
	[ key: string ]: string;
};

const ONE = '一';

const normalizeMap: normalizeMap = {
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
	'佰': '百', '陌':'百',
	'仟': '千', '阡':'千',
	'萬': '万',
	'．': '.', '。': '.', '・': '.', // 小数点
	'ー': '-', '−': '-',
	'＋': '+',
};

const needsNormalizePattern = new RegExp( `[${ Object.keys( normalizeMap ).join( '|' ) }]`, 'g' );

interface basicNumberMap {
	[ key: string ]: number;
};

interface digitMap {
	[ key: string ]: number;
};

const basicNumber: basicNumberMap = {
	'\u3007': 0, // 〇
	'\u4E00': 1, // 一
	'\u4E8C': 2, // 二
	'\u4E09': 3, // 三
	'\u56DB': 4, // 四
	'\u4E94': 5, // 五
	'\u516D': 6, // 六
	'\u4E03': 7, // 七
	'\u516B': 8, // 八
	'\u4E5D': 9, // 九
};
const basicDigit: digitMap = {
	'\u5341': 1e1, // 十 1e1,
	'\u767E': 1e2, // 百 1e2,
	'\u5343': 1e3, // 千 1e3,
};
const bigDigit: digitMap = {
	'\u4E07': 1e4,  // 万 1e4,
	'\u5104': 1e8,  // 億 1e8,
	'\u5146': 1e12, // 兆 1e12,
	'\u4EAC': 1e16, // 京 1e16,
};

const basicNumberPattern = new RegExp( `[${ Object.keys( basicNumber ).join( '|' ) }]` );
const basicNumberWithDotPattern = new RegExp( `[${ [...Object.keys( basicNumber ), '.' ].join( '|' ) }]` );
const basicDigitPattern = new RegExp( `[${ Object.keys( basicDigit ).join( '|' ) }]` );
const bigDigitPattern = new RegExp( `[${ Object.keys( bigDigit ).join( '|' ) }]` );

export function toNumericFromKanji( value: string ): string {

	let normalizedValue = value.trim();
	const matched = value.match( needsNormalizePattern );
	matched && matched.forEach( ( char ) => {

		normalizedValue = normalizedValue.replace( char, normalizeMap[ char ] );

	} );

	// サインを取得
	const signMatched = normalizedValue.match( /^([+-])/ );
	const sign = signMatched ? signMatched[ 1 ] : '';

	// 処理できる文字以外を削除
	normalizedValue = normalizedValue.replace(
		new RegExp(
			`[^${ [
				'.',
				...Object.keys( basicNumber ),
				...Object.keys( basicDigit ),
				...Object.keys( bigDigit ),
			] }]`,
			'g'
		), ''
	);

	if ( normalizedValue === '' ) return '';

	type Chunk = { letters: string[], digit: number };
	const chunks: Chunk[] = [ {
		letters: [],
		digit: 1,
	} ];
	let currentBigDigit = 1;

	for ( let i = normalizedValue.length - 1; i >= 0; i -- ) {

		const currentChunk = chunks[ chunks.length - 1 ];

		// 〇から九と小数点
		if ( basicNumberWithDotPattern.test( normalizedValue[ i ] ) ) {

			currentChunk.letters.unshift( normalizedValue[ i ] );
			continue;

		}

		// 千、百、十
		if ( basicDigitPattern.test( normalizedValue[ i ] ) ) {

			const hasLeadNumber = normalizedValue[ i - 1 ] && basicNumberPattern.test( normalizedValue[ i - 1 ] );
			const leadNumber = hasLeadNumber ? normalizedValue[ i - 1 ] : ONE;

			chunks.push( {
				letters: [ leadNumber ],
				digit: basicDigit[ normalizedValue[ i ] ] * currentBigDigit,
			} );

			if ( hasLeadNumber ) i --; // 2文字使ったので、1つ余分に進める
			continue;

		}

		// 億、万などの大きな桁の単体
		if ( bigDigitPattern.test( normalizedValue[ i ] ) ) {

			currentBigDigit = bigDigit[ normalizedValue[ i ] ];
			chunks.push( {
				letters: [],
				digit: currentBigDigit,
			} );
			continue;

		}

	}

	const numbers = chunks.reduce( ( acc, current ) => {

		const letters = current.letters.join( '' ) || '0';
		const numbers = + toNumeric( letters.split( '' ).map( ( char ) => {

			return basicNumber[ char ] !== undefined ? basicNumber[ char ] : char;

		} ).join( '' ) );

		return acc + numbers * current.digit;

	}, 0 );

	return `${ sign }${ numbers }`;

}

toNumericFromKanji.validLetters = [ ...new Set( [
  ",",
	...Object.entries( normalizeMap ).flat(),
	...Object.keys(basicNumber),
	...Object.keys(basicDigit),
	...Object.keys(bigDigit),
] ) ];
