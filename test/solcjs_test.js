const {expect} = require('./test_helpers.js')
const solc = require('solc')
const path = require('path')
const fs = require('fs')

const contracts = {
    language: "Solidity",
    sources: {
        'Example.sol': {
            urls: [
                "src/Example.sol"
            ]
        }
    },
    settings: {
        remappings: [
            "ds-test/=lib/ds-test/src/",
            "ds-token/=lib/ds-token/src/",
            "erc20/=lib/ds-token/lib/erc20/src/",
            "ds-math/=lib/ds-token/lib/ds-math/src/",
            "ds-stop/=lib/ds-token/lib/ds-stop/src/",
            "ds-auth/=lib/ds-token/lib/ds-stop/lib/ds-auth/src/",
            "ds-note/=lib/ds-token/lib/ds-stop/lib/ds-note/src/"
        ],
        outputSelection: {
            "Example.sol": {
                "*": ["metadata", "abi", "evm.bytecode", "evm.sourceMap"]
            }
        }
    }
}

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
    return JSON.parse(solc.compileStandardWrapper(JSON.stringify(plan), readImport))
}
describe('solcjs', () => {
    it('compiles', function () {
        const compiled = solcJSON(contracts)
        expect(compiled).contains.keys('contracts', 'sources')
        expect(compiled.contracts['Example.sol'].Example.evm.bytecode.object).to.be.a('string')
    })
})
