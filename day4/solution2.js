console.time('s')
const fs = require('node:fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input'), crlfDelay: Infinity
});

/** @type {Map<number, number>} */
const cardWinnings = new Map()
rl.on('line', (line) => {
    const [winningNumbers, yourNumbers, rowNumber] = parseRow(line)
    cardWinnings.set(rowNumber, countWinnings(winningNumbers, yourNumbers))
});
rl.on('close', () => {

    /**@type {Map<number,number[]>} */
    const cardsWon = new Map()

    const unprocessed = []

    cardWinnings.forEach((v, k) => {
        cardsWon.set(k, Array.from({ length: v }).map((_, i) => i + k + 1))
        unprocessed.push(k)
    })
    for (let i = 0; i < unprocessed.length; i++) {
        unprocessed.push(...cardsWon.get(unprocessed[i]))

    }

    console.log(unprocessed.length)
    console.timeEnd('s')
})


/** @param {string} row */
function parseRow(row) {
    row = row.replace(/Card +|:/, "")
    const rowNumber = +row.split(":")[0]
    const [win, your] = row.split("|")
    return [win.split(" ").filter(Boolean).map(Number), your.split(" ").filter(Boolean).map(Number), rowNumber]
}

/** @param {number[]} winningNumbers @param {number[]} yourNumbers  */
function countWinnings(winningNumbers, yourNumbers) {
    return winningNumbers.filter(n => yourNumbers.includes(n)).length
}
