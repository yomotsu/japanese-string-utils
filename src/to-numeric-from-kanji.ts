
// 三百三三億五万千五五十五 => 33300051555

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
	'\u5341': 2, // 十 1e1,
	'\u767E': 3, // 百 1e2,
	'\u5343': 4, // 千 1e3,
};
const largeDigit: digitMap = {
	'\u4E07': 5,  // 万 1e4,
	'\u5104': 9,  // 億 1e8,
	'\u5146': 13, // 兆 1e12,
};

const basicNumberPattern = new RegExp( `^[${ Object.keys( basicNumber ).join( '|' ) }]` );
const basicDigitPattern = new RegExp( `^[${ Object.keys( basicDigit ).join( '|' ) }]` );
const largeDigitPattern = new RegExp( `^[${ Object.keys( largeDigit ).join( '|' ) }]` );
// 十億、百万などの桁の組み合わせ
const complexLargeDigitPattern = new RegExp( `^([${ Object.keys( basicDigit ).join( '|' ) }][${ Object.keys( largeDigit ).join( '|' ) }])` );

function next10DigitLength( currentDigitLength: number ): number {

	// 十(2桁)、十万(6桁)、十億(10桁)...
	if ( currentDigitLength < 2 ) return 2;
	const gap = 4 - Math.ceil( ( currentDigitLength - 2  ) % 4 );
	return currentDigitLength + gap;

}

function next100DigitLength( currentDigitLength: number ): number {

	if ( currentDigitLength < 3 ) return 3;
	const gap = 4 - Math.ceil( ( currentDigitLength - 3  ) % 4 );
	return currentDigitLength + gap;

}

function next1000DigitLength( currentDigitLength: number ): number {

	// 千(4桁)、千万(8桁)、千億(12桁)
	if ( currentDigitLength < 4 ) return 4;
	const gap = 4 - Math.ceil( ( currentDigitLength - 4  ) % 4 );
	return currentDigitLength + gap;

}

export function toNumericFromKanji( value: string ): string {

	const result: number[] = [];

	let nomalizedValue = value;
	const matched = value.match( needsNormalizePattern );
	matched && matched.forEach( ( char ) => {

		nomalizedValue = nomalizedValue.replace( char, normalizeMap[ char ] );

	} );

	// TODO 文字列 nomalizedValue で、最初に登場した数字形式のみをパースする

	for ( let i = nomalizedValue.length - 1; i >= 0; i -- ) {

		// 〇から九
		if ( basicNumberPattern.test( nomalizedValue[ i ] ) ) {

			result.unshift( basicNumber[ nomalizedValue[ i ] ] );
			continue;

		}

		// 千、百、十
		if ( basicDigitPattern.test( nomalizedValue[ i ] ) ) {

			// 一つ前が基本数字の場合（つまり、二千、五百、三百となる場合）一つ前を利用する。
			// それ以外は「一」とする
			let digitLength = - 1;
			const currentDigitLength = result.length;
			const hasLeadNumber = nomalizedValue[ i - 1 ] && basicNumberPattern.test( nomalizedValue[ i - 1 ] );
			const leadNumber = hasLeadNumber ? ( basicNumber[ nomalizedValue[ i - 1 ] ] ) | 0 : 1;
			if ( nomalizedValue[ i ] === '十' ) digitLength = next10DigitLength( currentDigitLength );
			if ( nomalizedValue[ i ] === '百' ) digitLength = next100DigitLength( currentDigitLength );
			if ( nomalizedValue[ i ] === '千' ) digitLength = next1000DigitLength( currentDigitLength );

			// 不足桁を0で埋める
			for ( let ii = 0, ll = digitLength - currentDigitLength; ii < ll; ii ++ ) {

				result.unshift( 0 );

			}

			result[ 0 ] = leadNumber;
			if ( hasLeadNumber ) i --; // 2文字使ったので、1つ余分に進める
			continue;

		}

		// 十億、百万などの桁の組み合わせ
		if ( nomalizedValue[ i - 1 ] && complexLargeDigitPattern.test( `${ nomalizedValue[ i - 1 ] }${ nomalizedValue[ i ] }` ) ) {

			const currentDigitLength = result.length;
			const hasLeadNumber = nomalizedValue[ i - 2 ] && basicNumberPattern.test( nomalizedValue[ i - 2 ] );
			const leadNumber = hasLeadNumber ? ( basicNumber[ nomalizedValue[ i - 2 ] ] ) | 0 : 1;

			// 桁数で埋める
			const digitLength = basicDigit[ nomalizedValue[ i - 1 ] ] + largeDigit[ nomalizedValue[ i ] ] - 1;
			for ( let ii = 0, ll = digitLength - currentDigitLength; ii < ll; ii ++ ) {

				result.unshift( 0 );

			}

			result[ 0 ] = leadNumber;
			if ( hasLeadNumber ) i -= 2; // 3文字使ったので、2つ余分に進める
			continue;

		}

		// 億、万などの大きな桁の単体
		if ( largeDigitPattern.test( nomalizedValue[ i ] ) ) {

			const currentDigitLength = result.length;
			const hasLeadNumber = nomalizedValue[ i - 1 ] && basicNumberPattern.test( nomalizedValue[ i - 1 ] );
			const leadNumber = hasLeadNumber ? ( basicNumber[ nomalizedValue[ i - 1 ] ] ) | 0 : 1;

			// 桁数で埋める
			const digitLength = largeDigit[ nomalizedValue[ i ] ];
			for ( let ii = 0, ll = digitLength - currentDigitLength; ii < ll; ii ++ ) {

				result.unshift( 0 );

			}

			result[ 0 ] = leadNumber;
			if ( hasLeadNumber ) i --; // 2文字使ったので、1つ余分に進める
			continue;

		}

	}

	return result.join( '' );

}
