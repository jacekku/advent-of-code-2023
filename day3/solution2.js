console.time('s')
const fs = require('node:fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('input'), crlfDelay: Infinity
});

let sum = 0
const serialNumbers = []
const parts = []
rl.on('line', (line) => {
    const [lineSerialNumbers, lineParts] = parseRow(line)
    serialNumbers.push(lineSerialNumbers)
    parts.push(lineParts)
});
rl.on('close', () => {
    const gearRatios = findGearRatios(serialNumbers, parts)
    sum = gearRatios.reduce((acc, next) => acc + next, 0)
    console.log(sum)
    console.timeEnd('s')
})


/**
 * 
 * @param {string} row 
 */
function parseRow(row) {
    const parts = []
    const serials = []
    const matches = row.matchAll(/[0-9]+|[^0-9.]/g)
    for (const match of matches) {
        if (isNaN(Number(match[0]))) {
            parts.push({
                value: match[0],
                index: match.index
            })
        }
        else {
            serials.push({
                value: Number(match[0]),
                index: match.index,
                length: match[0].length
            })
        }
    }
    return [serials, parts]
}

/**
 * @param {{value:number,index:number,length:number}[][]} serials 
 * @param {{value:string,index:number}[][]} parts
 * @returns {number[]}
 */
function findGearRatios(serials, parts) {
    const out = []
    for (let i = 0; i < parts.length; i++) {
        const row = parts[i]
        for (const part of row) {
            if (part.value != '*') continue
            const aboveRow = serials[i - 1] || []
            const sameRow = serials[i] || []
            const belowRow = serials[i + 1] || []
            const minIdx = part.index - 1
            const maxIdx = part.index + 1
            const found = [...aboveRow, ...sameRow, ...belowRow].filter(a => a.index >= (minIdx - a.length + 1) && (a.index) <= maxIdx)
            if (found.length == 2) {
                out.push(found[0].value * found[1].value)
                continue
            }
        }
    }
    return out
}