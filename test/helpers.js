const {Assertion} = require('chai')
const Web3 = require('web3')
const {BN} = require('web3-utils')
const Ganache = require("ganache-core")
const solc = require('solc')
const path = require('path')
const fs = require('fs')

Assertion.addMethod('eq', function (N) {
    this.assert(new BN(this._obj).eq(new BN(N)),
        'expected #{act} to equal #{exp}',
        'expected #{act} NOT to equal #{exp}',
        N, this._obj)
})

const readImport = (file) => {
    const fullPath = path.join(process.env.PWD, file)
    try {
        const contents = fs.readFileSync(fullPath, 'utf-8')
        return {contents: contents}
    } catch (e) {
        return {error: e}
    }
}

const solcJSON = (plan) => {
    const compiled = JSON.parse(solc.compileStandardWrapper(JSON.stringify(plan), readImport))
    if (compiled.errors) {
        const msg = ({formattedMessage}) => formattedMessage
        throw new Error('\n' + compiled.errors.map(msg).join('\n'))
    } else {
        return compiled
    }
}

const ganacheWeb3 = () => {
    const truffleMnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
    const provider = Ganache.provider({mnemonic: truffleMnemonic})
    const web3 = new Web3(provider)

    // Prepare chain snapshotting
    web3.extend({
        property: 'evm',
        methods: [{
            name: 'snapshot',
            call: 'evm_snapshot',
            params: 0,
            outputFormatter: web3.utils.hexToNumber
        }, {
            name: 'revert',
            call: 'evm_revert',
            params: 1,
            inputFormatter: [web3.utils.numberToHex]
        }]
    })

    return web3
}

module.exports = {
    expect: require('chai').expect,
    solcJSON,
    ganacheWeb3
}
