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
    let currentNodes = Nodes.filter(n => n.name.endsWith("A"))
    let instructionPointer = 0
    const steps = Array.from({ length: currentNodes.length }).fill(0)
    while (!currentNodes.every(n => n.name.endsWith('Z'))) {
        for (let i = 0; i < currentNodes.length; i++) {
            if (currentNodes[i].name.endsWith('Z')) continue
            if (instructions[instructionPointer] == "L") {
                currentNodes[i] = currentNodes[i].left
            } else {
                currentNodes[i] = currentNodes[i].right
            }
            steps[i]++
        }

        instructionPointer++
        if (instructionPointer >= instructions.length) instructionPointer = 0
    }
    console.log(steps)
    console.log(nww(steps))
}



//--------- FUNKCJA NWD ----------
function nwd(a, b) {
    var reszta;
    while (b) {
        reszta = a % b;
        a = b;
        b = reszta;
    }
    return a;
}

//--------- FUNKCJA NWW ----------
function nww(numbers) {
    if (numbers.length == 2) {
        const [a, b] = numbers
        return a * b / nwd(a, b);
    }
    const [first, ...rest] = numbers
    return nww([first, nww(rest)])
}
