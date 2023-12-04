console.time('s')
const fs = require('node:fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input'), crlfDelay: Infinity
});

let sum = 0
rl.on('line', (line) => {
    const [winningNumbers, yourNumbers] = parseRow(line)
    sum += countWinnings(winningNumbers, yourNumbers)
});
rl.on('close', () => {
    console.log(sum)
    console.timeEnd('s')
})


/**
 * 
 * @param {string} row 
 */
function parseRow(row) {
    row = row.replace(/Card |:/, "")
    const [win, your] = row.split("|")
    return [win.split(" ").filter(Boolean).map(Number), your.split(" ").filter(Boolean).map(Number)]
}

/**
 * 
 * @param {number[]} winningNumbers 
 * @param {number[]} yourNumbers 
 */
function countWinnings(winningNumbers, yourNumbers) {
    return winningNumbers.filter(n => yourNumbers.includes(n)).reduce((acc, next) => !acc ? 1 : acc * 2, 0)
}
