const { ethers, deployments } = require("hardhat");
const fs = require('fs');


async function distributeTokens(tokenOwner, to, amount){
    const tokenAddress = await deployments.get("KoinBX");
    console.log("^add^", to);
    console.log("^amount^", amount.toString());
    const kBXToken = await ethers.getContractAt("KoinBX", tokenAddress.address);
    const tx = await(await kBXToken.connect(tokenOwner).transfer(to, amount)).wait();
    console.log(`${amount} of token distributed to ${to} with txn status: ${tx.status}`);

}
async function main() {
    const [owner] = await ethers.getSigners();
    const jsonData = fs.readFileSync('PubPvt.json', 'utf8');

    try {
        const keyPairs = JSON.parse(jsonData);

        for (const address of Object.keys(keyPairs)) {
            let amount = Math.floor(Math.random() * 999) + 1; // Random amount between 1 to 999
            // amount = ethers.parseUnits(amount.toString(), 4) // random no * 10^4 so to prevent over/underflow
            // // console.log("Address: " + address);
            // // console.log("Amount: " + amount);
            await distributeTokens(owner, address, amount);
        }
    } catch (error) {
        console.error('Error parsing or reading JSON data:', error);
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })