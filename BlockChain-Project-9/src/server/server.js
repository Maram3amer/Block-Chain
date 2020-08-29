import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

let fee = 1000000000000000000;
const TEST_ORACLES_COUNT = 20;
let oracles = [];

(async () => {
  try {
    var accounts =  await web3.eth.getAccounts();
      for(let a=0; a<TEST_ORACLES_COUNT; a++) { 
        oracles[a] = await flightSuretyApp.methods.registerOracle()
        .call({from: accounts[a],  value: fee});
        console.log('Oracle Registered:' , oracles[a][1]);
      };
  } catch(err) {
      console.log(err);
  }
})();

    setTimeout(async function(){   
        var accounts =  await web3.eth.getAccounts();
        let status = [0,10,20,30,40,50];
        for(let a=0; a<TEST_ORACLES_COUNT; a++) {
            let random = Math.floor(Math.random() * (5 - 0 + 1) ) + 0; 
            await flightSuretyApp.methods.submitOracleResponse
            ( oracles[a][1], 
              accounts[a], 
              "01202",
              Math.floor(Date.now() / 1000),
              status[random])
             .call({from: accounts[a]})
        }
    }, 9000);

const app = express();
app.get('/', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    });
})

export default app;