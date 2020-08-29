var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('CustomERC721Token', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.CustomERC721Token = await CustomERC721Token.new("Maram", "Udacity", {from: account_one});

            // TODO: mint multiple tokens
            await this.CustomERC721Token.mint(account_two, 100,  {from: account_one});
            await this.CustomERC721Token.mint(account_two, 200,  {from: account_one});
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.CustomERC721Token.totalSupply.call();
            assert.equal(totalSupply, 2);
                    })

        it('should get token balance', async function () { 
            const balanceOf = await this.CustomERC721Token.balanceOf.call(account_two);
            assert.equal(balanceOf, 2);
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/
        it('should return token uri', async function () { 
            const tokenURI = await this.CustomERC721Token.tokenURI.call(100, {from: account_one});
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.CustomERC721Token.transferFrom(account_two, account_one, 100,  {from: account_two});
            const ownerOf = await this.CustomERC721Token.ownerOf.call(100);
            assert.equal(ownerOf, account_one);

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.CustomERC721Token = await CustomERC721Token.new("Maram", "Udacity", {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let fail = false;
            try{
                await this.CustomERC721Token.mint.call(account_two, 1, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", {from: account_two});
            }
            catch(e){
                fail = true;
            }
            assert.equal(fail, true);
        })

        it('should return contract owner', async function () { 
            const owner = await this.CustomERC721Token.getOwner.call({from: account_one});
            assert.equal(owner, account_one);
        });

    });
})