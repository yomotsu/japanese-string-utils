import { toAscii } from './to-ascii';

export function toNumeric( value: string ): string {

	const asciiString = toAscii( value )
		.replace( /[^0-9.-]/g, '' )     // remove non numeric letters
		.replace(/(?!^)-/g, '' )        // --1-0 -> -10
		.replace( /\.+/, '.' )          // 0..0 -> 0.0
		.replace( /^(-)?0+/, '$10' )     // 000.000 -> 0.000
		.replace( /^(-)?0([1-9])+/, '$1$2' )  // 01.000 -> 1.000

	const contains2MoreDot = /\..*\./.test( asciiString );
	
	if ( ! contains2MoreDot )  return asciiString;

	const array = asciiString.split( '.' );
	const intPart = array.shift()!;
	const fractPart = array.join( '' );

	if ( fractPart ) return `${ intPart }.${ fractPart }`
	
	return intPart;

}
