module.exports = function () {
    return {
        files: [
            'src/*.js',
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
