// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

var CustomERC721Token = artifacts.require('CustomERC721Token');

module.exports = function(deployer) {
  deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier, "0x27D8D15CbC94527cAdf5eC14B69519aE23288B95", "Maram", "Udacity");
    deployer.deploy(CustomERC721Token,"Maram", "Udacity");

};
