const {expect} = require('./test_helpers.js')

const Web3 = require('web3')
const {BN, toBN} = require('web3-utils')

const Ganache = require("ganache-core")
const truffleMnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

const fs = require('fs')

let ExampleABI, ExampleBytecode
try {
    ExampleABI = JSON.parse(fs.readFileSync(require.resolve('../out/Example.abi'), 'utf-8'))
    ExampleBytecode = fs.readFileSync(require.resolve('../out/Example.bin'), 'utf-8')
} catch (e) {
    console.log('No contracts found in the ./out/ folder')
    return
}

describe('Example DSToken test with web3.js 1.x', function () {
    let provider, web3, snaps
    let accounts, DEPLOYER, CUSTOMER, example

    before(async () => {
        // Initialize an empty, in-memory blockchain
        provider = Ganache.provider({mnemonic: truffleMnemonic})

        // Instantiate clients to the in-memory blockchain
        web3 = new Web3(provider)

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
        snaps = []

        // Provide synchronous access to test accounts
        accounts = await web3.eth.getAccounts()
        DEPLOYER = accounts[0]
        CUSTOMER = accounts[1]

        // Deploy example contract
        const Example = new web3.eth.Contract(ExampleABI)
        example = await Example.deploy({data: ExampleBytecode})
            .send({from: DEPLOYER, gas: 3000000})
    })

    beforeEach(async () => {
        snaps.push(await web3.evm.snapshot())
    })

    afterEach(async () => {
        await web3.evm.revert(snaps.pop())
    })

    it('is deployed', async () => {
        let symbol = web3.utils.hexToUtf8((await example.methods.symbol().call()))
        expect(symbol).equal('TOK')
    })

    it('can mint', async () => {
        await example.methods['mint(address,uint256)'](CUSTOMER, toBN(1)).send({from: DEPLOYER})
        expect((await example.methods.balanceOf(CUSTOMER).call())[0]).eq(1)
    })

    it('can burn approved amount', async () => {
        await example.methods['mint(address,uint256)'](CUSTOMER, toBN(10)).send({from: DEPLOYER})
        await example.methods['approve(address,uint256)'](DEPLOYER, toBN(5)).send({from: CUSTOMER})
        await example.methods['burn(address,uint256)'](CUSTOMER, toBN(3)).send({from: DEPLOYER})
        expect((await example.methods.allowance(CUSTOMER, DEPLOYER).call())[0]).eq(2)
        expect((await example.methods.balanceOf(CUSTOMER).call())[0]).eq(7)
    })
})
