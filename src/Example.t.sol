pragma solidity ^0.4.18;

import "ds-test/test.sol";

import "./Example.sol";

contract ExampleTest is DSTest {
    Example lab;

    function setUp() public {
        lab = new Example();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
