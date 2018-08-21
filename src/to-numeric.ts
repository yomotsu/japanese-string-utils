import { toAscii } from './to-ascii';

export function toNumeric( value: string ): string {

	const asciiString = toAscii( value );
	return asciiString.replace( /[^0-9.]/g, '' );

}
