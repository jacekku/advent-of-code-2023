console.time('s')
const fs = require('node:fs');
const { parse } = require('node:path');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('../input act'), crlfDelay: Infinity
});
rl.on('line', (line) => { eachLine(line) });
rl.on('close', () => {
    onClose()
    console.timeEnd('s')
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
        this.seeds = line.split(' ').slice(1).map(Number)
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

function onClose() {
    const orderOfMaps = [
        parser.seedToSoil,
        parser.soilToFertilizer,
        parser.fertilizerToWater,
        parser.waterToLight,
        parser.lightToTemperature,
        parser.temperatureToHumidity,
        parser.humidityToLocation
    ]
    const seeds = parser.seeds
    const locations = seeds.map(seed => orderOfMaps.reduce((value, arr) => findAndMap(arr, value), seed))
    console.log(locations)
    console.log(Math.min(...locations))
}

/**
 * 
 * @param {AlmanacMap[]} arr 
 * @param {number} value 
 * @returns number
 */
function findAndMap(arr, value) {
    const found = arr.find(m => value >= m.src && value < m.src + m.len)
    if (!found) return value
    return (value - found.src) + found.dst
}