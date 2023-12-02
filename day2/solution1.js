console.time('s')
const fs = require('node:fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input'), crlfDelay: Infinity
});

let sum = 0
rl.on('line', (line) => {
    const { rowId, games } = parseRow(line)
    if (gameIsPossible(rowId, games)) {
        sum += Number(rowId)
    }
});
rl.on('close', () => {
    console.log(sum)
    console.timeEnd('s')
})


// only 12 red cubes, 13 green cubes, and 14 blue cubes
// which games are possible?
// sum the number of IDs of possible games
// row schema
// Game {number}: {number} {color}[,;]


/**
 * @param {string} row 
 */
function parseRow(row) {

    row = row.replaceAll("Game", "")
    row = row.replaceAll(" ", "")
    row = row.replaceAll("red", "r")
    row = row.replaceAll("blue", "b")
    row = row.replaceAll("green", "g")
    row = row.replaceAll(";", ":")
    const [rowId, ...games] = row.split(":")
    return { rowId, games }
}

/**
 * 
 * @param {string} rowId 
 * @param {string[]} games 
 */
function gameIsPossible(rowId, games) {
    for (const game of games) {
        const tokens = game.split(',')
        for (const token of tokens) {
            if (!throwIsWithinBounds(token)) {
                return false
            }
        }
    }
    return true
}

/**
 * 
 * @param {string} cube 
 * @returns {boolean}
*/
function throwIsWithinBounds(cube) {
    const value = Number(cube.slice(0, cube.length - 1))
    if (cube.endsWith("r")) {
        return value <= 12
    }
    if (cube.endsWith('g')) {
        return value <= 13
    }
    if (cube.endsWith('b')) {
        return value <= 14
    }
}