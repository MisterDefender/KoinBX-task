const { ethers } = require("hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const owner = deployer;
  console.log(`Network invoked is::: ==>  ${hre.network.name}`);
  const koinBXToken = await deploy("KoinBX", {
    from: deployer,
    args: [owner, "KoinBXToken", "kBXT", "18"],
    log: true,
    deterministicDeployment: true,
  });
};

module.exports.tags = ["kBXToken"];
