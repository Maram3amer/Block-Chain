/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key
  async getLevelDBData(key) {
    return await this.db.get(key);
  }

  // Add data to levelDB with key and value
  async addLevelDBData(key, value) {
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
