console.time('s')
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
});

rl.on('close', () => {
    console.log(sum)
    console.timeEnd('s')
})





/**
 * 
 * @param {string} row 
 * @returns {number}
 */
function parseRow(row) {
    let first, second
    for (let i = 0; i < row.length; i++) {
        if (row.charCodeAt(i) >= 48 && row.charCodeAt(i) <= 57) {
            first = row[i]
            break
        }
    }
    for (let i = row.length - 1; i >= 0; i--) {
        if (row.charCodeAt(i) >= 48 && row.charCodeAt(i) <= 57) {
            second = row[i]
            break
        }
    }
    console.log(first, second)

    return Number(first + second)
}