const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const myBlockChain = new BlockChain.Blockchain();
const TimeoutRequestsWindowTime = 5 * 60 * 1000;
const bitcoin = require('bitcoinjs-lib');
const hex2ascii = require('hex2ascii');
const bitcoinMessage = require('bitcoinjs-message');

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
    this.mempool = [];
    this.timeoutRequests = [];
    this.mempoolValid = [];
    this.registerStar = [];
    this.status = {};
    this.postNewBlock();
    this.getBlockByHeight();
    this.getBlockByHash();
    this.getBlockByWalletAddress();
    this.requestValidation();
    this.validateRequest();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by height, url: "/block/:height"
   */
  getBlockByHeight() {
    this.server.route({
      method: 'GET',
      path: '/block/{height}',
      handler: async (request, h) => {
        let block = await myBlockChain.getBlockByHeight(request.params.height);
        let obj = JSON.parse(block);
        obj['body']['star'].storyDecoded = hex2ascii(obj['body']['star']['story']);
        return obj;
      }
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by hash, url: "/stars/hash/:hash"
   */
  getBlockByHash() {
    this.server.route({
      method: 'GET',
      path: '/stars/hash/{hash}',
      handler: async (request, h) => {
        let block = await myBlockChain.getBlockByHash(request.params.hash);
        block.body.star.storyDecoded = hex2ascii(block.body.star.story);
        return block;
      }
    });
  }

  /**
   * Implement a GET Endpoint to retrieve blocks by wallet address, url: "/stars/address/:address"
   */
  getBlockByWalletAddress() {
    this.server.route({
      method: 'GET',
      path: '/stars/address/{address}',
      handler: async (request, h) => {
        let blocks = await myBlockChain.getBlockByWalletAddress(request.params.address);
        let values = []
        for (var block in blocks) {
          blocks[block].body.star.storyDecoded = hex2ascii(blocks[block].body.star.story);
          values.push(blocks[block]);
        }
        return values;
      }
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/block"
   */
  postNewBlock() {
    this.server.route({
      method: 'POST',
      path: '/block',
      handler: async (request, h) => {

        if (request.payload) {
          if (this.registerStar[request.payload.address]) {
            let data = {
              address: request.payload.address,
              star: {
                ra: request.payload.star.ra,
                dec: request.payload.star.dec,
                story: Buffer.from(request.payload.star.story).toString('hex'),
              }
            };
            let newBlock = new Block.Block(data);
            let addedBlock = await myBlockChain.addBlock(newBlock);
            let height = JSON.parse(addedBlock).height;
            let block = await myBlockChain.getBlockByHeight(height);
            let obj = JSON.parse(block);
            obj['body']['star'].storyDecoded = hex2ascii(obj['body']['star']['story']);
            return obj;
          } else {
            return h.response('You Have To Validate Request Before Added it To The Blocks.').code(400);
          }

        } else {
          return h.response('Empty Address, Star Info, You Have to Send Address, Star Info In JSON Format.').code(404);
        }
      }
    });
  }

  /**
   * Implement a request validation End point url: "/requestValidation"
   */
  requestValidation() {
    this.server.route({
      method: 'POST',
      path: '/requestValidation',
      handler: (request, h) => {
        let exist = false;
        if (request.payload) {
          for (var address in this.mempool) {
            if (address == request.payload.address)
              exist = true;
          }

          if (!exist) {
            this.mempool[request.payload.address] = new Date().getTime().toString().slice(0, -3);
            this.timeoutRequests[request.payload.address] = setTimeout(() => delete this.mempool[request.payload.address], TimeoutRequestsWindowTime);
          }
          let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.mempool[request.payload.address];
          let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
          let data = {
            walletAddress: request.payload.address,
            requestTimeStamp: this.mempool[request.payload.address],
            message: request.payload.address + ":" + this.mempool[request.payload.address] + ":starRegistry",
            validationWindow: timeLeft
          }
          return data;
        } else {
          return h.response('Empty Wallet Address, You Have to Send Wallet Address In JSON Format').code(404);
        }
      }
    });
  }

  /**
   * Implement a POST Endpoint to validate request, url: "/message-signature/validate"
   */
  validateRequest() {
    this.server.route({
      method: 'POST',
      path: '/message-signature/validate',
      handler: async (request, h) => {
        if (request.payload) {
          let timeElapse = (new Date().getTime().toString().slice(0, -3)) - this.mempool[request.payload.address];
          let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
          let address = request.payload.address;
          let signature = request.payload.signature;
          let message = request.payload.address + ":" + this.mempool[request.payload.address] + ":starRegistry";
          if (timeLeft >= 0) {
            this.registerStar[request.payload.address] = true;
            this.status = {
              address: address,
              requestTimeStamp: this.mempool[address],
              message: message,
              validationWindow: timeLeft,
              messageSignature: bitcoinMessage.verify(message, address, signature)
            }
            let data = {
              registerStar: this.registerStar[request.payload.address],
              status: this.status
            }
            this.mempoolValid[address] = data;
            this.timeoutRequests = [];
            return data;
          } else {
            return h.response('Time Out').code(408);
          }

        } else {
          return h.response('Empty Address, Signature, You Have to Send Address, Signature In JSON Format.').code(404);
        }
      }
    });
  }
}
/**
 * Exporting the BlockController class
 * @param {*} server
 */
module.exports = (server) => {
  return new BlockController(server);
}
