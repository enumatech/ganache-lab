const {expect, solcJSON} = require('./helpers.js')
const contracts = require('../contracts.json')
const Web3 = require('web3')
const {BN, toBN} = require('web3-utils')

const Ganache = require("ganache-core")
const truffleMnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

describe('Workflow with solc-js', function () {
    let provider, web3, snaps
    let accounts, DEPLOYER, CUSTOMER, example

    before(async function () {
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
        // console.log('Compiling...', Date())
        const compiled = solcJSON(contracts)
        const Example = compiled.contracts['Example.sol'].Example
        const ExampleContract = new web3.eth.Contract(Example.abi)
        example = await ExampleContract.deploy({data: Example.evm.bytecode.object})
            .send({from: DEPLOYER, gas: 3000000})
    })

    beforeEach(async () => {
        snaps.push(await web3.evm.snapshot())
    })

    afterEach(async () => {
        await web3.evm.revert(snaps.pop())
    })

    it('can deploy', async () => {
        let symbol = web3.utils.hexToUtf8((await example.methods.symbol().call()))
        expect(symbol).equal('TOK')
    })

    it('gives up to date answer', async () => {
        expect((await example.methods.meaningOfLife().call())).eq(42)
    })
})
