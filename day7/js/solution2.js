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

const Types = {
    FiveOfAKind: { value: 7, map: [5] },
    FourOfAKind: { value: 6, map: [4, 1] },
    FullHouse: { value: 5, map: [3, 2] },
    ThreeOfAKind: { value: 4, map: [3, 1, 1] },
    TwoPair: { value: 3, map: [2, 2, 1] },
    OnePair: { value: 2, map: [2, 1, 1, 1] },
    HighCard: { value: 1, map: [1, 1, 1, 1, 1] },
}

const Cards = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A',]

class Bet {
    cards = []
    bet = 1
    rank = 1
    type
    constructor(cards, bet) {
        this.cards = cards.split("")
        this.bet = bet
        this.type = this.findType()
    }

    /** @param {Bet} other */
    compare(other) {
        const type = this.type - other.type
        if (type != 0) return type
        for (let i = 0; i < 5; i++) {
            const c = Cards.indexOf(this.cards[i]) - Cards.indexOf(other.cards[i])
            if (c != 0) return c
        }
    }

    findType() {
        const map = new Map()
        this.cards.forEach(c => {
            if (c == 'J') return
            if (map.has(c)) map.set(c, map.get(c) + 1)
            else map.set(c, 1)
        })
        const jokers = this.cards.filter(c => c == 'J').length
        const entries = Array.from(map.values())
        entries.sort().reverse()
        if (entries.length == 0) entries[0] = 0
        entries[0] += jokers
        for (const type of Object.values(Types)) {
            const m = type.map
            if (
                entries[0] == m[0] &&
                entries[1] == m[1] &&
                entries[2] == m[2] &&
                entries[3] == m[3] &&
                entries[4] == m[4]
            ) {
                return type.value
            }
        }

    }

    get winnings() {
        return this.bet * this.rank
    }

}

function betsSort(a, b) {
    return a.compare(b)
}

const bets = []

function eachLine(line) {
    const [cards, bet] = line.split(" ")
    bets.push(new Bet(cards, Number(bet)))
}

function onClose() {
    bets.sort(betsSort).forEach((bet, idx) => bet.rank = idx + 1)
    const winnings = bets.map(bet => bet.winnings)
    // console.log(bets)
    // console.log(winnings)
    console.log(winnings.reduce((a, c) => a + c, 0))
}



