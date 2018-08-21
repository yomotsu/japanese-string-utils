
export function toKatakana( value: string ): string {

	const charArray: number[] = [];

	for ( let i = value.length - 1; 0 <= i; i -- ) {

		const charCode = value.charCodeAt( i );

		if ( 0x3041 <= charCode && charCode <= 0x3096 ) {

			charArray[ i ] = charCode + 0x0060;

		} else {

			charArray[ i ] = charCode;

		}

	}

	return String.fromCharCode.apply( null, charArray );

}
