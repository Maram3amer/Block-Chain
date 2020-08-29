
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
              
(async() => {

    let result = null;

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            console.log(error,result);
            display('Operational Status', 'Check if contract is operational', [ { label: 'Operational Status', error: error, value: result} ]);
        });


        // User-submitted transaction
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;
            // Write transaction
            contract.fetchFlightStatus(flight, (error, result) => {
                display('Oracles', 'Trigger oracles', [ { label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp} ]);
            });
        })

        // Rigister-Airline
        DOM.elid('rigister-airline').addEventListener('click', () => {
            let address = DOM.elid('airline-address').value;
            let metamask = DOM.elid('metamask').value;
            // Write transaction
            contract.registerAirline(address,metamask);
    });
           // Fund-Airline
           DOM.elid('fund-airline').addEventListener('click', () => {
            let address = DOM.elid('funded-airline-address').value;
            // Write transaction
            contract.fund(address);
    });
             // Buy-Insurance
             DOM.elid('buy-insurance').addEventListener('click', () => {
                let passengerAddress = DOM.elid('passenger-address').value;
                let amount = DOM.elid('buy-insurance-amount').value;
                // Write transaction
                contract.buy(passengerAddress, amount);
        });
  // credit Insurees
  DOM.elid('creditInsurees').addEventListener('click', () => {
    let address = DOM.elid('passenger-address-credit-Insurees').value;
    // Write transaction
    contract.creditInsurees(address);
});
      // pay insurance
  DOM.elid('payInsurance').addEventListener('click', () => {
    let address = DOM.elid('passenger-address-pay-Insurance').value;
    let amount = DOM.elid('insurance-amount').value;
    // Write transaction
    contract.pay(address,amount);
});

  });


})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({className:'row'}));
        row.appendChild(DOM.div({className: 'col-sm-4 field'}, result.label));
        row.appendChild(DOM.div({className: 'col-sm-8 field-value'}, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);

}
