# Ganache Core laboratory

This is a demonstration of Ethereum smart-contract exploration environment
combining
 [Ganache Core](https://github.com/trufflesuite/ganache-core)
 (formerly known as TestRPC),
 [ethjs](https://github.com/ethjs/ethjs),
 [Mocha](https://mochajs.org/),
 [Wallaby.js](https://wallabyjs.com/) (_non-free software_).

## Usage

_Note: A macOS environment is assumed_

Install with `yarn install`.

If you want to see external contract loading, then `dapp build`.

For extra convenience you can install [entr](http://entrproject.org/) — a generic file watcher — with `brew install entr`  and use `yarn run build` to continuously compile contracts as their source changes.

Since tests are not automatically re-run on contract recompilation, there is extra auditory feedback reflecting
both the success or failure of the contract recompilation,
with different sounds.
(After contract recompilation we must use IntelliJ's `Rerun` command when using Wallaby.js to avoid false test feedback!)
 
Start the test watcher and runner with `yarn test --watch`.

Change something in `test/chain_test.js` and save the file.

You shall enjoy the feedback within **200 milliseconds**!

Finally, to push joy to its limits, configure Wallaby.js for your editor / IDE
 and save the effort of moving your eyes away from the source code,
 since the test failures appear right next to the source lines ;) 

## Motivation

While [Truffle](http://truffleframework.com/) made quite a progress on
making the smart-contract creation process more accessible, it does quite
a lot of magic in the background.
Such magic gets in the way of utilizing such development conveniences as
[Wallaby.js](https://wallabyjs.com/) for example, which can provide almost
instantaneous feedback, directly inlined into the code editor, while working
on a  [Mocha](https://mochajs.org/) test suite.

`web3.js` is a very versatile, configurable, feature rich library, but it has
accumulated quite some legacy code already...

Truffle builds on the (as of 2017-12-15) latest stable version of the
[web3.js](https://github.com/ethereum/web3.js/) Ethereum RPC client,
which lacks some nice feature already present its upcoming 1.x versions,
like [calling methods with the same name but different parameter lists](https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#id12), eg. `myToken.methods['mint(uint256)'](123)`.

[ethjs](https://github.com/ethjs/ethjs) however is a leaner alternative to
`web3.js`. After seeing even a
[Metamask article](https://medium.com/metamask/metamask-hackathon-guide-a88a161416ce)
was using `ethjs` in their examples, I thought I would give it a try too.

[Ganache Core](https://github.com/trufflesuite/ganache-core) is an
in-memory Ethereum blockchain simulator, so it can be used as a
[test double](https://martinfowler.com/bliki/TestDouble.html)
in automated tests.
While using such a fake version of the chain can speed up tests significantly,
Ganache comes with the wonderful ability to branch its state, by providing
two, non-standard RPC operations `evm_snapshot` and `evm_revert`.
By doing a snapshot before each test and a revert after each test, we can
achieve cheap isolation of unit-test cases.

Truffle [already does utilize](https://github.com/trufflesuite/truffle-core/blob/14c534f5326bb96717e27e5e5725627e7d0346c9/lib/testing/testrunner.js#L196-L205)
this feature of Ganache.
It is however
[buried a bit deep](https://github.com/trufflesuite/truffle-core/blob/3e96337c32aaae6885105661fd1a6792ab4494bf/lib/test.js#L256-L267)
under its hood and it's also coupled to running the test suite through their
command-line interface or interactive console.
I haven't found any clear documentation on how to configure the
automatically managed, built-in `develop` and `test` chains either,
which I needed when I wanted to set different `gas` settings for debugging
purposes.

I've learnt to love the instant feedback loop during development
already _decades_ ago. And by instant, I mean sub-second responses!
 
Back in the nineties, when I was developing for
Microchip PIC microcontrollers in [FlashForth](http://flashforth.com/),
I could directly type code over a serial line to the controller for either
execution or compilation and I saw its effect immediately.
It was a 4 *Mega*, not *Giga* Hertz CPU with 4 *kilo*, not *Mega* word
ROM and 1024 *bytes* of RAM!

Then in the past few years I was doing Clojure/ClojureScript development
using the [Cursive](https://cursive-ide.com/) plugin for the 
[IntelliJ IDE](https://www.jetbrains.com/idea/). Cursive also has a
[tight integration](https://cursive-ide.com/userguide/testing.html)
with Clojure's built-in test framework, providing instant feedback when
running tests.

The [Wallaby.js](https://wallabyjs.com/) plugin promises to provide a
similar, instantaneous testing experience as Cursive. They support other
IDEs too and automatically integrate with all the major Javascript test
frameworks, including Mocha.

But Truffle tests are not pure Mocha tests, because they run in an implicit
environment and defined by a magical `contract` function — instead of
`describe` — as a convenience, which is more of a nuisance,
since Wallaby.js can not recognize and run them...

So I set out to build a minimal example to showcase and also understand
what would it take to tie all these great tools into a smooth development
experience.

You can find the results in this repository.

(Testing YubiKey)
