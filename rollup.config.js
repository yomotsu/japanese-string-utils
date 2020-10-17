import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const license = `/*!
 * ${ pkg.name }
 * https://github.com/${ pkg.repository }
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */`;

export default {
	input: 'src/index.ts',
	output: [
		{
			format: 'umd',
			file: pkg.main,
			name: 'japaneseStringUtils',
			banner: license,
			indent: '\t',
		},
		{
			format: 'es',
			file: pkg.module,
			banner: license,
			indent: '\t',
		}
	],
	plugins: [
		typescript( {
			typescript: require( 'typescript' ),
		} ),
	],
};
