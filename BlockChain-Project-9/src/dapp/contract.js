import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
}

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
            let firstAirline = '0xf17f52151EbEF6C7334FAD080c5704D77216b732';
            this.flightSuretyApp.methods.
            registerFlight()
            .call({ from: firstAirline }, (error, result) => {
                console.log(result);
            });
                  // Register First Airline
                  if (this.airlines.length == 0) {
                    try {
                        this.flightSuretyApp.methods.
                        registerFirstAirline(firstAirline)
                            .send({ from: firstAirline, gas:150000});
                    } catch (error) {
                        console.log(error);
                    }
                    try {
                        this.flightSuretyApp.methods.
                        fund(firstAirline)
                            .send({ from: firstAirline, value: 10000000000000000000});
                    } catch (error) {
                        console.log(error);
                    }
                }
            this.owner = accts[0];
            this.airlines.push(accts[0]);
            this.airlines.push(accts[1]);
            console.log("Airlines: " + this.airlines);

            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    fetchFlightStatus(flight) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .call({ from: self.owner })
            .then(console.log);  
    }

    registerAirline(address,metamask) {
        let self = this;
        self.flightSuretyApp.methods
            .registerAirline(address, true,metamask)
            .send({ from: metamask, gas:150000 });
    }
    fund(address) {
        let self = this;
        self.flightSuretyApp.methods
            .fund(address)
            .send({ from: address, value: 10000000000000000000}, (error) => {
                console.log(error);
            });
    }
    buy(passengerAddress, amount) {
        let self = this;
        self.flightSuretyApp.methods
            .buy(passengerAddress, amount)
            .send({ from: passengerAddress, value: 10000000000000000000});
    }
    creditInsurees(passengerAddress) {
        let self = this;
        self.flightSuretyApp.methods
            .creditInsurees(passengerAddress)
            .send({ from: passengerAddress}, (error,result) => {
                console.log(result);
                console.log(error);
            });
    }
    pay(passengerAddress,amount) {
        let self = this;
        self.flightSuretyApp.methods
            .pay(passengerAddress,amount)
            .send({ from: passengerAddress, value: 10000000});
    }
}
