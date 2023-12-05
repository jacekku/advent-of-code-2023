
const { workerData, parentPort } = require("worker_threads");

let min = Infinity
range = workerData.range
orderOfMaps = workerData.orderOfMaps
// findAndMap = workerData.findAndMap
for (let i = range.src; i < range.src + range.len; i++) {
    location = orderOfMaps.reduce((value, arr) => findAndMap(arr, value), i)
    if (location < min) {
        min = location
    }
}

parentPort.postMessage(min);
function findAndMap(arr, value) {
    const found = arr.find(m => value >= m.src && value < m.src + m.len)
    if (!found) return value
    return (value - found.src) + found.dst
}