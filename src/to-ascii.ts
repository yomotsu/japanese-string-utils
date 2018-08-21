
// Ａ -> A
// １ -> 1
export function toAscii( value: string ): string {

	const charArray: number[] = [];

	for ( let i = value.length - 1; 0 <= i; i -- ) {

		const charCode = charArray[ i ] = value.charCodeAt( i );

		switch ( true ) {

			case ( charCode <= 0xff5e && 0xff01 <= charCode ) :
				charArray[ i ] -= 0xfee0;
				break;
			case ( charCode === 0x3000 ):
				charArray[ i ] = 0x0020;
				break;
			case ( charCode === 0x30FC ):
				charArray[ i ] = 0x002D;
				break;

		}

	}
	return String.fromCharCode.apply( null, charArray );

}
