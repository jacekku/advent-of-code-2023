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
    const attachedSerials = findAttachedSerials(serialNumbers, parts)
    sum = attachedSerials.reduce((acc, next) => acc + next, 0)
    console.log(sum)
    console.timeEnd('s')
    const formatMemoryUsage = (data) => `${Math.round(data / 1024 / 1024 * 100) / 100} MB`;

    const memoryData = process.memoryUsage();

    const memoryUsage = {
        rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
        external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    };

    console.log(memoryUsage);
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
function findAttachedSerials(serials, parts) {
    const out = []
    for (let i = 0; i < serials.length; i++) {
        const row = serials[i]
        for (const serial of row) {
            const aboveRow = parts[i - 1] || []
            const sameRow = parts[i] || []
            const belowRow = parts[i + 1] || []
            const minIdx = serial.index - 1
            const maxIdx = serial.index + serial.length
            const found = [...aboveRow, ...sameRow, ...belowRow].filter(a => a.index >= minIdx && a.index <= maxIdx)
            if (found.length > 0) {
                out.push(serial.value)
                continue
            }
        }
    }
    return out
}