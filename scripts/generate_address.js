const fs = require('fs-extra')

const letters = ["A", "B", "C", "D", "E", "F"]

function getRandomAddress() {
  const ret = []
  for (let i = 0; i < 40; i += 1) {
    const r = Math.floor(Math.random() * 10000) % 16;
    ret.push(r < 10 ? r.toString() : letters[r - 10])
  }
  return "('0x" + ret.join('') + "')"
}

const addresses = []
for (let i = 0; i < 7000; i += 1) {
  addresses.push(getRandomAddress())
}

fs.writeFileSync("./addr.txt", addresses.join(",\n"))