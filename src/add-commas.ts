export function addCommas( numericString: string ): string {

	const rgx = /(\d+)(\d{3})/;
	const x = String( numericString ).split( '.' );
	let integerPart = x[ 0 ];
	const fractionalPart = x.length > 1 ? '.' + x[ 1 ] : '';

	while ( rgx.test( integerPart ) ) {

		integerPart = integerPart.replace( rgx, '$1' + ',' + '$2' );

	}

	return integerPart + fractionalPart;

}
