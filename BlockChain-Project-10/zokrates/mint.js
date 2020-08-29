const proofs = require('./proof');
const api0 = require('./test');
const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require('web3');
const MNEMONIC = 'spirit supply whale amount human item harsh scare congress discover talent hamster';
const INFURA_KEY = "5975d2d20e6743d6ba179b76f11eeab8";
const NFT_CONTRACT_ADDRESS = "0x27D8D15CbC94527cAdf5eC14B69519aE23288B95";
const NETWORK = 'rinkeby';
const OWNER_ADDRESS = '0x27D8D15CbC94527cAdf5eC14B69519aE23288B95';


if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}
const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "name": "A",
        "type": "uint256[2]"
      },
      {
        "name": "A_p",
        "type": "uint256[2]"
      },
      {
        "name": "B",
        "type": "uint256[2][2]"
      },
      {
        "name": "B_p",
        "type": "uint256[2]"
      },
      {
        "name": "C",
        "type": "uint256[2]"
      },
      {
        "name": "C_p",
        "type": "uint256[2]"
      },
      {
        "name": "H",
        "type": "uint256[2]"
      },
      {
        "name": "K",
        "type": "uint256[2]"
      },
      {
        "name": "input",
        "type": "uint256[2]"
      }
    ],
    "name": "mintNFT",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

async function main() {
    const provider =  new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`);
    const web3Instance =  new web3(provider);

    if (NFT_CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })


        for (var i = 0; i < 10; i++) {
            let proof = proofs[i].proof;
            let input = proofs[i].input;
            try{
                const result = await nftContract.methods.mintNFT(
                    OWNER_ADDRESS,
                    i + 1,
                    proof.A,
                    proof.A_p,
                    proof.B,
                    proof.B_p,
                    proof.C,
                    proof.C_p,
                    proof.H,
                    proof.K,
                    input

                ).send({ from: OWNER_ADDRESS, gas: 5510328 });
                console.log("Minted creature. Transaction: " + result.transactionHash)
            }
            catch(e)
            {
                console.log("Error minting: " + e);
            }

        }
    } 
}
main();