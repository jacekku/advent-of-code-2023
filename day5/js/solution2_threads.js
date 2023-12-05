console.time('s')
const fs = require('node:fs');
const readline = require('readline');
const { Worker } = require("worker_threads");

const rl = readline.createInterface({
    input: fs.createReadStream('../input act'), crlfDelay: Infinity
});
rl.on('line', (line) => { eachLine(line) });
rl.on('close', async () => {
    await onClose()
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
// #####################################

class MapParserInator {
    seeds = []

    /**
     * @typedef AlmanacMap 
     * @property {number} dst
     * @property {number} src
     * @property {number} len
     */
    /**  @type AlmanacMap[] */
    seedToSoil = []
    soilToFertilizer = []
    fertilizerToWater = []
    waterToLight = []
    lightToTemperature = []
    temperatureToHumidity = []
    humidityToLocation = []

    currentParser = this.seedParser
    emptyLine(line) { return line == "" }
    /** @param {string} line */
    changeParser(line) {
        if (line.startsWith("seed-to-soil")) {
            return this.currentParser = (line) => this.mapParser(line, this.seedToSoil)
        }
        if (line.startsWith("soil-to-fertilizer")) {
            return this.currentParser = (line) => this.mapParser(line, this.soilToFertilizer)
        }
        if (line.startsWith("fertilizer-to-water")) {
            return this.currentParser = line => this.mapParser(line, this.fertilizerToWater)
        }
        if (line.startsWith("water-to-light")) {
            return this.currentParser = line => this.mapParser(line, this.waterToLight)
        }
        if (line.startsWith("light-to-temperature")) {
            return this.currentParser = line => this.mapParser(line, this.lightToTemperature)
        }
        if (line.startsWith("temperature-to-humidity")) {
            return this.currentParser = line => this.mapParser(line, this.temperatureToHumidity)
        }
        if (line.startsWith("humidity-to-location")) {
            return this.currentParser = line => this.mapParser(line, this.humidityToLocation)
        }
        return false
    }
    /** @param {string} line */
    parse(line) {
        if (this.emptyLine(line)) return
        if (this.changeParser(line)) return
        this.currentParser(line)
    }

    /** @param {string} line */
    seedParser(line) {
        const seeds = line.split(' ').slice(1).map(Number)
        for (let i = 0; i < seeds.length; i += 2) {
            this.seeds.push({
                src: seeds[i],
                len: seeds[i + 1]
            })
        }
    }

    mapParser(line, field) {
        const [dst, src, len] = line.split(" ").map(Number)
        field.push({ dst, src, len })
    }

}


const parser = new MapParserInator()

/** @param {string} line  */
function eachLine(line) {
    parser.parse(line)
}

async function onClose() {
    const orderOfMaps = [
        parser.seedToSoil,
        parser.soilToFertilizer,
        parser.fertilizerToWater,
        parser.waterToLight,
        parser.lightToTemperature,
        parser.temperatureToHumidity,
        parser.humidityToLocation
    ]
    const seedRanges = parser.seeds

    let min = Infinity

    const workers = []
    for (const range of seedRanges) {
        console.log(range)
        const worker = createWorker(JSON.parse(JSON.stringify({ range, orderOfMaps })))
        workers.push(worker)
    }

    const res = await Promise.all(workers)
    console.log(Math.min(...res))
}


function createWorker(data) {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./worker.js", { workerData: data })
        worker.on('message', data => resolve(data))
    })
}