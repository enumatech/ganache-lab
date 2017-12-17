module.exports = function () {
    return {
        files: [
            'src/*.sol',
            'lib/**/*.sol',
            './test/test_helpers.js',
            'out/*'
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
