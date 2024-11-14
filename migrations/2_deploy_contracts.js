const WaterToken = artifacts.require("WaterToken");
const WaterTokenAllocator = artifacts.require("WaterTokenAllocator"); // Changed from WaterTokenAllocate

module.exports = async function(deployer, network, accounts) {
  // Deploy WaterToken first
  await deployer.deploy(WaterToken, accounts[0]);
  const waterToken = await WaterToken.deployed();
  
  // Then deploy WaterTokenAllocator with the WaterToken address
  await deployer.deploy(WaterTokenAllocator, accounts[0], waterToken.address);
};