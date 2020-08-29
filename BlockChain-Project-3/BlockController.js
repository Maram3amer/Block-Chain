const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const myBlockChain = new BlockChain.Blockchain();
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} server
   */
  constructor(server) {
    this.server = server;
    this.initializeMockData();
    this.getBlockByIndex();
    this.postNewBlock();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
  getBlockByIndex() {
    this.server.route({
      method: 'GET',
      path: '/api/block/{index}',
      handler: (request, h) => {
        return myBlockChain.getBlock([request.params.index]);
      }
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
      this.server.route({
          method: 'POST',
          path: '/api/block',
          handler: async (request, h) => {
            if (request.payload)
            {
            let newBlock = new Block.Block(request.payload.body);
            let addedBlock = await myBlockChain.addBlock(newBlock);
            let height = JSON.parse(addedBlock).height;
            return await myBlockChain.getBlock(height);
          }
          else {
            return h.response('Empty Body, You Have to Send Body In JSON Format').code(404);
          }
          }
      });
  }

  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks db
   */
  async initializeMockData() {
    setTimeout(async function(){
      if (await myBlockChain.getBlockHeight() === 0) {
    for (let i = 0; i < 10; i++) {
      const index = await myBlockChain.getBlockHeight();
        let blockAux = new Block.Block(`Test Data #${index+1}`);
        await myBlockChain.addBlock(blockAux);
      }
  }
},3000);
}
}
/**
 * Exporting the BlockController class
 * @param {*} server
 */
module.exports = (server) => {
  return new BlockController(server);
}
