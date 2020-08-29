var HDWalletProvider = require("truffle-hdwallet-provider");

const infuraKey = "5975d2d20e6743d6ba179b76f11eeab8";
// Be sure to match this mnemonic with that in Ganache!
var mnemonic = "spirit supply whale amount human item harsh scare congress discover talent hamster";


module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
       provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
         network_id: 4,       // rinkeby's id
         gas: 4500000,        // rinkeby has a lower block limit than mainnet
         gasPrice: 10000000000
     },
  },
  compilers: {
    solc: {
      version: "0.4.23",
    },
  },
};
