// normalizeHyphens( '-‐‑‒–—―⁃−─━' );
// -> "‐‐‐‐‐‐‐‐‐‐‐"

const NORMALIZED = '\u2010';
const HYPHEN_LIKE_PATTERN = new RegExp( [
	'\u002D', // hyphen-minus
	'\uFE63', // small hyphen-minus
	'\uFF0D', // fullwidth hyphen-minus (Windows default)

	'\u00AD', // soft hyphen
	'\u2010', // hyphen
	'\u2011', // non-breaking hyphen
	'\u2012', // figure dash
	'\u2013', // en dash
	'\u2014', // fullwidth em dash
	'\u2015', // horizontal bar

	'\u2043', // hyphen bullet
	'\u2212', // minus sign (macOS default)

	'\u2500', // box drawings light horizontal
	'\u2501', // box drawings heavy horizontal

	'\u30FC', // katakana-hiragana prolonged sound mark
	'\uFF70', // halfwidth katakana-hiragana prolonged sound mark
].join( '|' ), 'g' );

export function normalizeHyphens(
	value: string,
	replacement: string = NORMALIZED
): string {

	return value.replace( HYPHEN_LIKE_PATTERN, replacement );

}
