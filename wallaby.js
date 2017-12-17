module.exports = function () {
    return {
        files: [
            'src/*.sol',
            'lib/**/*.sol',
            'test/helpers.js',
            'out/*',
            'contracts.json'
        ],

        tests: [
            'test/*_test.js'
        ],
        env: {
            type: 'node'
        },
        testFramework: 'mocha'
    }
}
