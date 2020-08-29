
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {
    await config.flightSuretyData.registerFirstAirline(config.owner);
    await config.flightSuretyData.fund(config.owner, {from: config.owner,value: 10000000000000000000});
        
      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try
      {
         await config.flightSuretyData.setOperatingStatus(false, { from: config.owner});
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {
    await config.flightSuretyData.registerFirstAirline(accounts[3]);
    await config.flightSuretyData.fund(accounts[3], {from: config.owner,value: 10000000000000000000});
    
     await config.flightSuretyData.setOperatingStatus(false, { from: accounts[3] });
      let reverted = false;
      try
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");
  });

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

    // ARRANGE
    let newAirline = accounts[2];
    let isFunded = true;

    // ACT
    try {
        await config.flightSuretyData.registerAirline(newAirline, true, {from: accounts[1]});
    }
    catch(e) {
       isFunded = false;
    }
    // ASSERT
    assert.equal(isFunded, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('function call is made when multi-party threshold is reached', async () => {
     await config.flightSuretyData.registerFirstAirline(config.owner);
     await config.flightSuretyData.fund(config.owner, {from: config.owner,value: 10000000000000000000});
     
     // ARRANGE
     let admin1 = accounts[4];
     let admin2 = accounts[5];
     let admin3 = accounts[6];
     let admin4 = accounts[7];
     let admin5 = accounts[8];

     await config.flightSuretyData.registerAirline(admin1, true, config.owner, {from: config.owner});
     await config.flightSuretyData.registerAirline(admin2, true, config.owner, {from: config.owner});
     await config.flightSuretyData.registerAirline(admin3, true, config.owner, {from: config.owner});
     await config.flightSuretyData.registerAirline(admin4, true, config.owner, {from: config.owner});
     await config.flightSuretyData.registerAirline(admin5, true, config.owner, {from: config.owner});

     let startStatus = await config.flightSuretyData.isOperational.call();
     let changeStatus = !startStatus;

     // ACT
     await config.flightSuretyData.setOperatingStatus(changeStatus, {from: admin1});
     await config.flightSuretyData.setOperatingStatus(changeStatus, {from: admin2});
     await config.flightSuretyData.setOperatingStatus(changeStatus, {from: admin3});
     await config.flightSuretyData.setOperatingStatus(changeStatus, {from: admin4});
     await config.flightSuretyData.setOperatingStatus(changeStatus, {from: admin5});

     let newStatus = await config.flightSuretyData.isOperational.call();

     // ASSERT
     assert.equal(changeStatus, newStatus, "Multi-party call failed");

   });
});
