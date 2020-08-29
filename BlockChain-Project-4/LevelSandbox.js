//  Persist data with LevelDB 

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get block from levelDB by height
  async getBlockByHeightFromLevelDB(height) {
    return await this.db.get(height);
  }

  // Get block from levelDB by hash
  async getBlockByHashFromLevelDB(hash) {
    let self = this;
    let block = null;
    return new Promise(function(resolve, reject) {
      self.db.createReadStream()
        .on('data', function(data) {
          if (JSON.parse(data.value).hash === hash) {
            block = JSON.parse(data.value);
          }
        })
        .on('error', function(err) {
          reject(err)
        })
        .on('close', function() {
          resolve(block);
        });
    });
  }

  // Get blocks from levelDB by address
  async getBlockByWalletAddress(address) {
    let self = this;
    let blocks = [];
    return new Promise(function(resolve, reject) {
      self.db.createReadStream()
        .on('data', function(data) {
          if (JSON.parse(data.value).body.address === address) {
            blocks.push(JSON.parse(data.value));
          }
        })
        .on('error', function(err) {
          reject(err)
        })
        .on('close', function() {
          resolve(blocks);
        });
    });
  }

  // Add block to levelDB with key and value
  async addBlockToLevelDB(key, value) {
    await this.db.put(key, value);
    return value;
  }

  // Method that return the height
  async getBlockHeight() {
    let self = this;
    let heightCount = -1;
    return new Promise(function(resolve, reject) {
      self.db.createReadStream()
        .on('data', function(data) {
          heightCount++;
        })
        .on('error', function(err) {
          console.log('err!', err)
        })
        .on('close', function() {
          resolve(heightCount);
        })
    })
  }
}


module.exports.LevelSandbox = LevelSandbox;
