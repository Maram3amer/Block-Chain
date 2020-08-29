var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const proof = require('./proof');

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Test SolnSquareVerifier', function () {
        beforeEach(async function () { 
            this.SolnSquareVerifier = await SolnSquareVerifier.new(account_one, "Maram", "Udacity",{from: account_one});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('Test add new solution', async function () { 
            var added = false;
            try {
                // will be added
                await this.SolnSquareVerifier.addSolutions.call(
                    account_one,
                    1,
                    proof.proof.A,
                    proof.proof.A_p,
                    proof.proof.B,
                    proof.proof.B_p,
                    proof.proof.C,
                    proof.proof.C_p,
                    proof.proof.H,
                    proof.proof.K,
                    proof.input,
                    {from:account_one});
                // will show an exception because it is duplicated 
                await this.SolnSquareVerifier.addSolutions.call(
                account_one,
                1,
                proof.proof.A,
                proof.proof.A_p,
                proof.proof.B,
                proof.proof.B_p,
                proof.proof.C,
                proof.proof.C_p,
                proof.proof.H,
                proof.proof.K,
                proof.input,
                {from:account_one});
            }
            catch(e){
                added = true;
            }
            assert.equal(added, true);
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

        it('Test mintNFT', async function () { 
            await this.SolnSquareVerifier.mintNFT.call(
                account_two,
                1,
                proof.proof.A,
                proof.proof.A_p,
                proof.proof.B,
                proof.proof.B_p,
                proof.proof.C,
                proof.proof.C_p,
                proof.proof.H,
                proof.proof.K,
                proof.input,
                {from:account_one});
            assert.equal(verifyTx, false);
            let owner = await this.contract.ownerOf(1);
            assert.equal(account_two, owner);
    });

                    });
                });

            });
    


