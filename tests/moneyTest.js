import {formatCurrency} from '../script/utils/money.js';

console.log('Test suite`: formatCurrency');

console.log('convert cents into dollers');

if (formatCurrency(2095) === '20.95') {
    console.log('passed');
} else{
    console.log('failed');
}

console.log('works with 0');

if (formatCurrency(0) === '0.00') {
    console.log('passed');
} else {
    console.log('failed');
}

console.log('rounds up to the nearest cent');

if (formatCurrency(2000.4 === '20.00')) {
    console.log('passed');
} else {
    console.log('failed');
}