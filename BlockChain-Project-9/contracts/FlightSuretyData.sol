pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner; // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    uint256 constant WEI_PER_TOKEN = 1000000000;

    address[] multiCalls = new address[](0);

    struct Flight {
        uint flightNo;
        uint8 statusCode;
        uint256 updatedTimestamp;
    }

    struct Airline {
      bool isAdmin;
      address airline;
      bool isRegistered;
      bool isFunded;
      uint flight;
    }

    struct Passenger {
        bool isPaidInsurance;
        address passengerAddress;
        uint payidAmount;
    }

    mapping(uint => Flight) private flights;
    mapping(address => Airline) private airlines;
    mapping(address => Passenger) private passengers;


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                )
                                public
    {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**

    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isFunded(address airline)
                        public
                        returns(bool)
    {
      return airlines[airline].isFunded;
    }
    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */
    function isOperational()
                            public
                            view
                            returns(bool)
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */
    function setOperatingStatus
                            (
                                bool mode
                            )
                            external
     {
      require( airlines[msg.sender].isAdmin, "Caller is not Admin");
      bool isDuplicate = false;
      for(uint c=0; c<multiCalls.length; c++) {
          if (multiCalls[c] == msg.sender) {
              isDuplicate = true;
              break;
          }
      }
      require(!isDuplicate, "Caller has already called this function.");

      multiCalls.push(msg.sender);
      if (multiCalls.length >= 4) {
          operational = mode;
          multiCalls = new address[](0);
     }
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function registerFlight
                                (
                                )
                                external
                                returns (uint flightNo) 

    {
     flights[0] =  Flight({
        flightNo:1,
        statusCode:STATUS_CODE_UNKNOWN,
        updatedTimestamp:0
        });
        return flights[0].flightNo;
    }
    function registerFirstAirline(
      address firstAirline
    )
    external
    {
        //register first airline
        airlines[firstAirline] = Airline({
                                                  isRegistered: true,
                                                  airline:firstAirline,
                                                  isFunded:false,
                                                  isAdmin:true,
                                                  flight:1
                                              });
    }
   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */
    function registerAirline
                            (
                              address airline,
                              bool isAdmin,
                              address metamask
                            )
                            requireIsOperational
                            external
    {
      require(airlines[airline].isRegistered == false, "Airline is already registered");
      require(metamask != airline, "Airline can not register itself");
      require(airlines[metamask].isRegistered == true, "Only existing airline may register a new airline.");
      require(airlines[metamask].isFunded == true, "Airline has not provided funding.");
      airlines[airline] = Airline({
                                                isRegistered:true,
                                                airline:airline,
                                                isFunded:false,
                                                isAdmin:isAdmin,
                                                flight:flights[0].flightNo
                                            });
    }


   /**
    * @dev Buy insurance for a flight
    *
    */
    function buy
                            (
                              uint amount,
                              address passenger
                               )
                            external
                            payable
    {
      require(passengers[passenger].isPaidInsurance == false,  "Passenger has paid insurance ");
      require(amount >= WEI_PER_TOKEN, 'Not enough ether');
      msg.value - amount;
      address(contractOwner).transfer(amount);
      passengers[passenger] = Passenger({
                                          isPaidInsurance:true,
                                          passengerAddress:passenger,
                                          payidAmount:amount
                                      });
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                  address passenger
                                )
                                external
    {
      require(flights[0].statusCode != 0 && flights[0].statusCode != 10, "The flight is not delayed");
      require(passengers[passenger].isPaidInsurance == true,  "Passenger has not paid insurance ");
      passengers[passenger].payidAmount.mul(uint(1).div(uint(5)));
}


    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                              address passenger,
                              uint amount
                            )
                            external
                            payable
    {
      require(passengers[passenger].payidAmount >= amount, "Exceeds amount limit");
      passengers[passenger].payidAmount = passengers[passenger].payidAmount.sub(uint(amount));
      address(passenger).transfer(amount);
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */
    function fund
                            (
                              address _address
                            )
                            external
                            payable
    {
        require(airlines[_address].isRegistered == true, "Airline not Registered.");
        require(airlines[_address].isFunded == false, "Airline has been funded.");
        uint256 returnAmount = msg.value - 10000000000000000000;
        address(contractOwner).transfer(10000000000000000000);
        _address.transfer(returnAmount);
        airlines[_address].isFunded = true;
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }
}
