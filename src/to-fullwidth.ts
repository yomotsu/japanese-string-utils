// A -> Ａ
// 1 -> １
export function toFullwidth( value: string ): string {

	const charArray = [];

	for ( let i = value.length - 1; 0 <= i; i -- ) {

		const charCode = charArray[ i ] = value.charCodeAt( i );

		switch ( true ) {

			case ( charCode <= 0x007E && 0x0021 <= charCode ):
				charArray[ i ] += 0xFEE0;
				break;
			case ( charCode === 0x0020 ):
				charArray[ i ] = 0x3000;
				break;

		}

	}
	return String.fromCharCode.apply( null, charArray );

}
