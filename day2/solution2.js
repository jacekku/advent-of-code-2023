const fs = require('node:fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input'), crlfDelay: Infinity
});

let sum = 0
console.time('s')
rl.on('line', (line) => {
    const { rowId, games } = parseRow(line)
    sum += gamePower(rowId, games)
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
function gamePower(rowId, games) {
    const out = {
        red: 0,
        grn: 0,
        blu: 0,
    }
    for (const game of games) {
        const tokens = game.split(',')
        for (const token of tokens) {
            const { value, color } = getColorAndValue(token)
            if (out[color] < value) {
                out[color] = value
            }
        }
    }
    return out.red * out.grn * out.blu
}

/**
 * 
 * @param {string} cube 
*/
function getColorAndValue(cube) {
    const value = Number(cube.slice(0, cube.length - 1))
    if (cube.endsWith("r")) {
        return { value, color: 'red' }
    }
    if (cube.endsWith('g')) {
        return { value, color: 'grn' }
    }
    if (cube.endsWith('b')) {
        return { value, color: 'blu' }
    }
}