#!/bin/bash
solc --standard-json --allow-paths $PWD/src/,$PWD/lib < contracts.json
