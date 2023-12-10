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
let firstLine = true
let instructions = ""
const Nodes = []
class Node {
    name
    left
    right
    constructor(name, left, right) {
        this.name = name
        this.left = left
        this.right = right
    }
}


function eachLine(line) {
    if (firstLine) {
        instructions = line
        firstLine = false
        return
    }
    if (!line.length) return
    line = line.replaceAll(/=|\(|\)|,/g, '')
    const [name, _, left, right] = line.split(" ")
    Nodes.push(new Node(name, left, right))
}

function onClose() {
    Nodes.forEach(node => {
        node.left = Nodes.find(n => n.name == node.left)
        node.right = Nodes.find(n => n.name == node.right)
    })
    let currentNode = Nodes.find(n => n.name == "AAA")
    let instructionPointer = 0
    let steps = 0
    while (currentNode.name != "ZZZ") {
        if (instructions[instructionPointer] == "L") {
            currentNode = currentNode.left
        } else {
            currentNode = currentNode.right
        }
        instructionPointer++
        if (instructionPointer >= instructions.length) instructionPointer = 0

        steps++
    }
    console.log(steps)
}



