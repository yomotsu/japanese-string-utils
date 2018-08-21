// ビン -> びん
// （半角カタカナは未サポート）

export function toHiragana( value: string ): string {

	const charArray = [];

	for ( let i = value.length - 1; 0 <= i; i -- ) {

		const charCode = value.charCodeAt( i );
		charArray[ i ] = ( 0x30A1 <= charCode && charCode <= 0x30F6 ) ? charCode - 0x0060 : charCode;

	}
	return String.fromCharCode.apply( null, charArray );

}
