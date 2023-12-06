console.time('s')
const fs = require('node:fs');
const { parse } = require('node:path');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('../input'), crlfDelay: Infinity
});
rl.on('line', (line) => { eachLine(line) });
rl.on('close', () => {
    onClose()
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
// ##########################

const TIMES = []
const DISTANCES = []

function eachLine(line) {
    line = line.replaceAll(" ", "")
    console.log(line)
    if (line.startsWith("Time:")) {
        TIMES.push(...line.split(":").slice(1).filter(Boolean).map(Number))
    } else {
        DISTANCES.push(...line.split(":").slice(1).filter(Boolean).map(Number))
    }
}

function onClose() {
    console.log(TIMES, DISTANCES)

    const distances = []
    TIMES.map((time, idx) => {
        const d = []
        for (let i = 0; i < time; i++) {
            d.push((i * (time - i)) > DISTANCES[idx] ? 1 : null)
        }
        distances.push(d.filter(Boolean).length)
    })
    console.log(distances.reduce((acc, next) => acc * next, 1))
}



