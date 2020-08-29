/* ===== Executable Test ==================================
|  Use this file to test project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

let myBlockChain = new BlockChain.Blockchain();

setTimeout(async function test() {
  console.log("***** Function For Create Tests Blocks *****");
  for (var i = 0; i < 10; i++) {
    const height = await myBlockChain.getBlockHeight();
    const blockTest = new Block.Block("Test Block - " + (height + 1));
    await myBlockChain.addBlock(blockTest);
    console.log("********************************************");
  }
  console.log("** Function to get the Height of the Chain **");
  console.log('Block Height: ', await myBlockChain.getBlockHeight());

  console.log("************** Function To Get a Block *****");
  console.log(await myBlockChain.getBlock(0));

  console.log("**** Function To Validate Block ************");
  if (await myBlockChain.validateBlock(2))
    console.log('block is valid')
  else
    console.log('block is not valid')

  console.log("*** Function To Validate Chain **************");
  await myBlockChain.validateChain();
}, 1000);
