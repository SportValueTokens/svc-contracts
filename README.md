# SVC Contracts

This repository contains Solidity smart contracts for the Sport Value Coin and related contracts:

* The ERC20 token
* vesting
* governance

The project uses Hardhat framework.

# Building and Deploying

* Install node.js (20.x)
* Install yarn: ```npm install --global yarn```
* Fetch dependencies: ```yarn install```
* Compile: ```yarn compile```
* Run tests: ```yarn test```

In order to deploy to a live network, you need a private key and a node endpoint. Currently, hardhat.config.js is configured to use Infura.
* Deploy: ```npx hardhat run scripts/deployment.js --network <network name>```

