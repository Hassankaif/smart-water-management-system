const WaterToken = artifacts.require("WaterToken");

module.exports = function(deployer) {
  const accounts = [
    "0x787392DdFb0f86a598e5dA041d65F9341C3899D8", // Replace with your desired account
    // Add more accounts if needed
  ];
  deployer.deploy(WaterToken, "Water Token", "WATER", 1000000 * (10 ** 18), { from: accounts[0] });
}; 