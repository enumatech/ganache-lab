const {expect, solcJSON, ganacheWeb3} = require('./helpers.js')
const contracts = require('../contracts.json')

describe('Workflow with solc-js', function () {
    let web3, snaps, accounts, DEPLOYER, CUSTOMER, example

    before(async function () {
        web3 = ganacheWeb3()
        snaps = []
        accounts = await web3.eth.getAccounts()
        ;[DEPLOYER, CUSTOMER] = accounts

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
        const symbol = web3.utils.hexToUtf8((await example.methods.symbol().call()))
        expect(symbol).equal('TOK')
    })

    it('gives up to date answer', async () => {
        expect((await example.methods.meaningOfLife().call())).eq(42)
    })
})
