# Task 1: Creating and Deploying kBXToken Contract
---
## Overview
In this task, we will create a contract following the ERC20 token standard and deploy it to the Arbitrum Sepolia testnet. The token will be named kBXToken (KoinBX token).

## Contract Deployment Details
- Contract Address: [0x00cf6c168E79Cd7a6bf139E90B1Ea22b4Ef3fe18](https://sepolia.arbiscan.io/address/0x00cf6c168E79Cd7a6bf139E90B1Ea22b4Ef3fe18#code)
- Network: Arbitrum Sepolia testnet

## Deployment Instructions
1. Ensure you have the necessary environment setup.
2. Modify `env.example` to `.env` and update `OWNER_PVT_KEY` with your deployer/owner private key.
3. Run `npm run deploy` command to initiate deployment.

## Note
- Ensure that you have configured the environment variables correctly before deployment.
- Replace `OWNER_PVT_KEY` with your private key to deploy the contract.
- Deployment process requires Node.js and npm.

# Task 2: Generating Public/Private Keys
---
## Overview
This task involves generating public/private key pairs using a command line interface (CLI) utility. The generated keys will be stored in a JSON file.

## Command
Run `npm run generate-keys` to start the CLI for generating key pairs.

## Output
A JSON file will be created containing all the generated public/private key pairs.

## Note
- You can generate as many key pairs as needed from a single seed.
- These keys will be utilized in the subsequent task for distributing tokens.

# Task 3: Distributing Tokens
---
## Overview
This task focuses on distributing tokens to the public keys generated in Task 2.

## Command
Execute `npm run distribute-tokens` to initiate the token distribution process.

## Note
- Ensure that the public keys generated in Task 2 are accessible for token distribution.
- Distribution process requires access to the generated public/private key pairs.

