const {Assertion} = require('chai')
const {BN} = require('web3-utils')
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
    return JSON.parse(solc.compileStandardWrapper(JSON.stringify(plan), readImport))
}

module.exports = {
    expect: require('chai').expect,
    solcJSON
}
