const { ethers, deployments } = require("hardhat");
const fs = require("fs");

async function distributeTokens(tokenOwner, to, amount) {
  const tokenAddress = await deployments.get("KoinBX");
  const kBXToken = await ethers.getContractAt("KoinBX", tokenAddress.address);
}
async function main() {
  const [owner] = await ethers.getSigners();
  const tokenAddress = await deployments.get("KoinBX");
  const kBXToken = await ethers.getContractAt("KoinBX", tokenAddress.address);
  const tokenOwner = owner.address;

  const jsonData = fs.readFileSync("PubPvt.json", "utf8");

  try {
    const keyPairs = JSON.parse(jsonData);

    const addresses = Object.keys(keyPairs).map((address) => address);

    var i = 0;
    while (i < addresses.length) {
      // console.log(i);
      for (let j = i + 1; j <= i + 10; j++) {
        let set = 0;
        if (j % 7 == 0) {
          // Multiple of 7
          // console.log("J: ", j);
          let amount = Math.floor(Math.random() * 999) + 1; // Random amount between 1 to 999
          amount = ethers.parseUnits(amount.toString(), 18); // random no * 10^18 decimals

          const mintTx = await await kBXToken
            .connect(owner)
            .mintToken(tokenOwner, amount);

          const tx = await (
            await kBXToken.connect(owner).transfer(addresses[j], amount)
          ).wait();
          console.log(
            `${amount} of token distributed to ${to} with txn status: ${tx.status}\n``${amount} of token distributed to ${to} with txn hash: ${tx.transactionHash}`
          );

          set = 1;
          break; //break since taking only first multiple
        }
      }
      i += 10;
    }

    // for (const address of Object.keys(keyPairs)) {
    //   let amount = Math.floor(Math.random() * 999) + 1; // Random amount between 1 to 999
    //   amount = ethers.parseUnits(amount.toString(), 18); // random no * 10^18 decimals

    //   await distributeTokens(owner, address, amount);
    // }
  } catch (error) {
    console.error("Error parsing or reading JSON data:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
