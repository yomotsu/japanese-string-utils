# japanese-string-utils

The utils convert Japanese strings to other forms, such as Hiragana, Katakana, Full-width, Half-width, numeric and others.

日本語テキストをひらがな、カタカナ、全角、半角、数字などへの変換をするためのユーティリティー。

[![Latest NPM release](https://img.shields.io/npm/v/japanese-string-utils.svg)](https://www.npmjs.com/package/japanese-string-utils)
![MIT License](https://img.shields.io/npm/l/japanese-string-utils.svg)

## Usage

### with NPM

```shell
$ npm install --save japanese-string-utils
```

```javascript
import {
  toAscii,
  toFullwidth,
  toHiragana,
  toKatakana,
  toFullwidthKana,
  toHalfwidthKana,
  toNfc,
  toNumeric,
  toNumericFromKanji,
  addCommas,
  normalizeHyphens,
} from 'japanese-string-utils';

console.log( toAscii( 'ＡＢＣDEFａｂｃdef０１２345' ) );
// -> 'ABCDEFabcdef012345'

console.log( toFullwidth( 'ＡＢＣDEFａｂｃdef０１２345' ) );
// -> 'ＡＢＣＤＥＦａｂｃｄｅｆ０１２３４５'

console.log( toHiragana( 'ジャバすくりぷと' ) );
// -> 'じゃばすくりぷと'

console.log( toKatakana( 'ジャバすくりぷと' ) );
// -> 'ジャバスクリプト'

console.log( toFullwidthKana( 'ジャバｽｸﾘﾌﾟﾄ' ) );
// -> 'ジャバスクリプト'

console.log( toHalfwidthKana( 'ジャバｽｸﾘﾌﾟﾄ' ) );
// -> 'ｼﾞｬﾊﾞｽｸﾘﾌﾟﾄ'

console.log( toNFC( 'シ゛ャハ゛スクリフ゜ト' ) );
// -> 'ジャバスクリプト'

console.log( toNumeric( '３．１４15' ) );
// -> '3.1415'

console.log( toNumericFromKanji( '百二三億四十万千五六十七' ) );
// -> '12300401567'
console.log( toNumericFromKanji( '1億5600万' ) );
// -> '156000000'

console.log( addCommas( '12345678.90' ) );
// -> '12,345,678.90'

console.log( normalizeHyphens( '-‐‑‒–—―⁃−─━ and some letters' ) );
// -> '‐‐‐‐‐‐‐‐‐‐‐ and some letters'
console.log( normalizeHyphens( '123ー456−789', 'H' ) );
// -> '123H456H789'

```
