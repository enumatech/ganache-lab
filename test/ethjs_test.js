const {expect} = require('./helpers.js')

const Eth = require('ethjs')
const {BN, toBN} = Eth
const EthQuery = require('ethjs-query')

const Ganache = require("ganache-core")
const truffleMnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'

const SimpleStoreABI = JSON
    .parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]')

const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056'


describe('Chain with ethjs', function () {
    let provider, eth, accounts, snapshot, revert, snaps, simpleStore

    before(async () => {
        // Initialize an (ethjs)  client to an empty, in-memory blockchain
        provider = Ganache.provider({mnemonic: truffleMnemonic})
        eth = new Eth(provider)

        // Prepare chain snapshotting
        const query = new EthQuery(eth.currentProvider, eth.options.query)
        snapshot = () => query.rpc.sendAsync({method: 'evm_snapshot'})
        revert = (snapshotId) => query.rpc.sendAsync({method: 'evm_revert', params: [snapshotId]})
        snaps = []

        // Provide synchronous access to test accounts
        accounts = await eth.accounts()

        // Deploy example contract
        const SimpleStore = eth.contract(SimpleStoreABI, SimpleStoreBytecode, {from: accounts[0], gas: 300000})
        simpleStore = await SimpleStore.at((await eth.getTransactionReceipt(await SimpleStore.new())).contractAddress)

        // Prepare some "demo scenario" common to all tests
        await simpleStore.set(5)
    })

    beforeEach(async () => {
        snaps.push(await snapshot())
    })

    afterEach(async () => {
        await revert(snaps.pop())
    })

    it('should see the initial chain state', async () => {
        expect((await simpleStore.get()).storeValue).eq(5)
    })

    it('modify the chain', async () => {
        await simpleStore.set(6)
        expect((await simpleStore.get()).storeValue).eq(6)
    })

    it('chain should be reset to the initial state', async () => {
        expect((await simpleStore.get()).storeValue).eq(5)
    })
})
