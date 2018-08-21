// 濁点や半濁点が別の合成文字(NFD)を単体の文字(NFC)に変換（結合）
// は゛-> ば
// カ゛ハ゜オ -> ガパオ

const DAKUTEN = 0x309B;
const HAN_DAKUTEN = 0x309C;

export function toNFC( value: string ): string {

	const charArray = [];

	for ( let i = 0; i < value.length; i ++ ) {

		const charCode = value.charCodeAt( i );

		switch ( true ) {

			case ( 0x304B <= charCode && charCode <= 0x3062 && ( charCode % 2 === 1 ) ):
			case ( 0x30AB <= charCode && charCode <= 0x30C2 && ( charCode % 2 === 1 ) ):
			case ( 0x3064 <= charCode && charCode <= 0x3069 && ( charCode % 2 === 0 ) ):
			case ( 0x30C4 <= charCode && charCode <= 0x30C9 && ( charCode % 2 === 0 ) ): {
				const nextChar = value.charCodeAt( i + 1 );
				charArray.push( charCode + ( nextChar === DAKUTEN ? 1 : 0 ) );
				if ( charArray[ charArray.length - 1 ] !== charCode ) i ++;
				break;
			}
			case ( 0x306F <= charCode && charCode <= 0x307F && ( charCode % 3 === 0 ) ):
			case ( 0x30CF <= charCode && charCode <= 0x30DD && ( charCode % 3 === 0 ) ): {
				const nextChar = value.charCodeAt( i + 1 );
				charArray.push( charCode + ( nextChar === DAKUTEN ? 1 : nextChar === HAN_DAKUTEN ? 2 : 0 ) );
				if ( charArray[ charArray.length - 1 ] !== charCode ) i ++;
				break;
			}
			case ( 0x3046 === charCode || 0x30a6 === charCode ): {
				const nextChar = value.charCodeAt( i + 1 );
				charArray.push( charCode + ( nextChar === DAKUTEN ? 78 : 0 ) );
				if ( charArray[ charArray.length - 1 ] != charCode ) i ++;
				break;
			}
			default:
				charArray.push( charCode );
				break;

		}

	}
	return String.fromCharCode.apply( null, charArray );

}
