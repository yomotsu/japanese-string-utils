
// 三百三三億五万千五五十五 => 33300051555

import { toNumeric } from "to-numeric";

interface normalizeMap {
	[ key: string ]: string;
};

const normalizeMap: normalizeMap = {
	'0': '〇', '０': '〇', '零': '〇',
	'1': '一', '１': '一', '壱': '一', '壹':'一', '弌':'一',
	'2': '二', '２': '二', '弐': '二', '貳':'二',
	'3': '三', '３': '三', '参': '三', '參':'三',
	'4': '四', '４': '四', '肆': '四',
	'5': '五', '５': '五', '伍': '五',
	'6': '六', '６': '六', '陸': '六',
	'7': '七', '７': '七', '漆': '七', '柒':'七', '質':'七',
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
const largeDigit: digitMap = {
	'\u4E07': 1e4,  // 万 1e4,
	'\u5104': 1e8,  // 億 1e8,
	'\u5146': 1e12, // 兆 1e12,
};

// const basicNumberPattern = new RegExp( `[${ Object.keys( basicNumber ).join( '|' ) }]` );
const basicDigitPattern = new RegExp( `[${ Object.keys( basicDigit ).join( '|' ) }]` );
const largeDigitPattern = new RegExp( `[${ Object.keys( largeDigit ).join( '|' ) }]` );
const simpleDigitPattern = new RegExp( `[${ [...Object.keys( basicDigit ), ...Object.keys( largeDigit )].join( '|' ) }]` );
// 十億、百万などの桁の組み合わせ
const complexLargeDigitPattern = new RegExp( `([${ Object.keys( basicDigit ).join( '|' ) }][${ Object.keys( largeDigit ).join( '|' ) }])` );

export function toNumericFromKanji( value: string ): string {

	let normalizedValue = value.trim();
	const matched = value.match( needsNormalizePattern );
	matched && matched.forEach( ( char ) => {

		normalizedValue = normalizedValue.replace( char, normalizeMap[ char ] );

	} );

	const chunks: number[] = [];

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
				...Object.keys( largeDigit ),
			] }]`,
			'g'
		), ''
	);

	if ( normalizedValue === '' ) return '';

	console.log(complexLargeDigitPattern.test( normalizedValue ));
	

	// 桁ごとに分解
	// 十億、百万などの桁の組み合わせ
	do {

		const matched = normalizedValue.match( complexLargeDigitPattern );
		if ( ! matched ) break;

		const digit = matched[ 0 ];
		const hasLeadDigit = digit.match( basicDigitPattern );
		const leadDigit = hasLeadDigit ? basicDigit[ hasLeadDigit[ 0 ] ] : 1;

		const hasMainDigit = digit.match( largeDigitPattern );
		const mainDigit = hasMainDigit ? largeDigit[ hasMainDigit[ 0 ] ] : 1;
		const numbers = normalizedValue.slice( 0, matched.index ) || '1';

		const normalizedNumbers = + toNumeric( numbers.split('').map( ( char ) => {

			return basicNumber[ char ] || char;

		} ).join( '' ) );

		chunks.push( normalizedNumbers * leadDigit * mainDigit );
		normalizedValue = normalizedValue.slice( matched.index! + digit.length );

	} while ( complexLargeDigitPattern.test( normalizedValue ) );

	// 億、万、百、十などの単体の桁
	do {

		const matched = normalizedValue.match( simpleDigitPattern );
		if ( ! matched ) break;

		const digit = matched[ 0 ];
		const mainDigit = largeDigit[ digit ] || basicDigit[ digit ] || 1;
		const numbers = normalizedValue.slice( 0, matched.index ) || '1';

		const normalizedNumbers = + toNumeric( numbers.split('').map( ( char ) => {

			return basicNumber[ char ] || char;

		} ).join( '' ) );

		chunks.push( normalizedNumbers * mainDigit );
		normalizedValue = normalizedValue.slice( matched!.index! + digit.length );

	} while ( simpleDigitPattern.test( normalizedValue ) );

	// 一の位
	const numbers = normalizedValue || '0';
	const normalizedNumbers = + toNumeric( numbers.split('').map( ( char ) => {

		return basicNumber[ char ] || char;

	} ).join( '' ) );
	chunks.push( normalizedNumbers );


	const result = chunks.reduce( ( acc, current ) => acc + current, 0 );
	return `${ sign }${ result }`;

}
