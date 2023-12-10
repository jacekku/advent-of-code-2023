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

let time;
let distance;

function eachLine(line) {
    line = line.replaceAll(" ", "")
    if (line.startsWith("Time:")) {
        time = line.split(":").slice(1).filter(Boolean).map(Number)[0]
    } else {
        distance = line.split(":").slice(1).filter(Boolean).map(Number)[0]
    }
}

function onClose() {
    let sum = 0

    for (let i = 0; i < time; i++) {
        if ((i * (time - i)) > distance) {
            sum += 1
        }
    }
    console.log(sum)
    console.log(sum == 43364472)

}



