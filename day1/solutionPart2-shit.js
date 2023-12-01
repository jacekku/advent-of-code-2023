const fs = require('node:fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input'),
    crlfDelay: Infinity
});

sum = 0
rl.on('line', (line) => {
    out = parseRow(line)
    sum += out
    console.log(sum)
});

rl.on('close', () => {
    console.log(sum)
})






/**
 * 
 * @param {string} row 
 * @returns {number}
 * 1,   2,      3,      4,      5,      6,      7,      8,      9,      0
 * one, two,    three,  four,   five,   six,    seven,  eight,  nine,   zero
 */
function parseRow(row) {
    let first, second
    for (let i = 0; i < row.length; i++) {
        if (isDigit(row.slice(i, i + 5))) {
            first = isDigit(row.slice(i, i + 5))
            break
        }
    }
    for (let i = row.length - 1; i >= 0; i--) {
        if (isDigit(row.slice(i, i + 5))) {
            second = isDigit(row.slice(i, i + 5))
            break
        }
    }


    console.log(row, first, second)
    return Number(first + second)
}


/**
 * @param {string} slice 
 * @returns {false|number} */
function isDigit(slice) {
    if (slice.charCodeAt(0) >= 49 && slice.charCodeAt(0) <= 57) {
        return slice[0]
    }
    if (slice.startsWith('one')) return '1'
    if (slice.startsWith('two')) return '2'
    if (slice.startsWith('three')) return '3'
    if (slice.startsWith('four')) return '4'
    if (slice.startsWith('five')) return '5'
    if (slice.startsWith('six')) return '6'
    if (slice.startsWith('seven')) return '7'
    if (slice.startsWith('eight')) return '8'
    if (slice.startsWith('nine')) return '9'
    return false
}

