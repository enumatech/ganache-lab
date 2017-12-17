pragma solidity ^0.4.18;


import 'ds-token/token.sol';


contract Example is DSToken {
    function Example() DSToken('TOK') public {
    }

    function meaningOfLife() public pure returns (uint256) {
        return 42;
    }
}
