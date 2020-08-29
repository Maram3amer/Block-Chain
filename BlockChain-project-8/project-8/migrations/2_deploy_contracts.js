// migrating the appropriate contracts
var FarmerRole = artifacts.require("./FarmerRole.sol");
var SellerRole = artifacts.require("./SellerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FarmerRole);
  deployer.deploy(SellerRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
