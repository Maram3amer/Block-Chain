/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');
class Blockchain {

  constructor() {
    this.db = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  async generateGenesisBlock() {
    const height = await this.getBlockHeight();
    if (height === -1)
      await this.addBlock(new Block.Block("First block in the chain - Genesis block"));
  }

  // Get block height, it is a helper method that return the height of the blockchain
  async getBlockHeight() {
    return await this.db.getBlockHeight();
  }

  // Get Block By Height
  async getBlockByHeight(height) {
    return await this.db.getBlockByHeightFromLevelDB(height);
  }

  // Get Block By Hash
  async getBlockByHash(hash) {
    return await this.db.getBlockByHashFromLevelDB(hash.toString());
  }

  // Get Blocks By Wallet Address
  async getBlockByWalletAddress(address) {
    return await this.db.getBlockByWalletAddress(address);
  }

  // Add new block
  async addBlock(newBlock) {
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0, -3);
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    const height = await this.getBlockHeight() + 1;
    newBlock.height = height;
    if (newBlock.height > 0) {
      const block = await this.getBlockByHeight(newBlock.height - 1);
      newBlock.previousBlockHash = JSON.parse(block).hash;
    }
    return this.db.addBlockToLevelDB(newBlock.height, JSON.stringify(newBlock));
  }

  // Validate if Block is being tampered by Block Height
  async validateBlock(height) {
    let block = JSON.parse(await this.getBlock(height));
    let blockHash = block.hash;
    block.hash = '';
    block.height = 0;
    block.previousBlockHash = '';
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    if (blockHash === validBlockHash) {
      return true;
    } else {
      return false;
    }
  }

  // Validate Blockchain
  async validateChain() {
    const blockHeight = await this.getBlockHeight();
    let errorLog = [];
    for (let i = 0; i < blockHeight; i++) {
      const validateBlock = await this.validateBlock(i);
      // validate block
      if (!validateBlock) errorLog.push(i);
      // compare blocks hash link
      let blockHash = this.getBlock(i).hash;
      let previousHash = this.getBlock(i + 1).previousBlockHash;
      if (blockHash !== previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: ' + errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

module.exports.Blockchain = Blockchain;
