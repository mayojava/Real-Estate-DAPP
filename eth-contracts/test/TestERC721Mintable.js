var ERC721MintableComplete = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            let token1 = await this.contract.mint(account_two, 1, "");
            let token2 = await this.contract.mint(accounts[2], 2, ""); 
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 2, "Total supply is incorrect");
        })

        it('should get token balance', async function () { 
            let tokenBalance = await this.contract.balanceOf(account_two);
            assert.equal(tokenBalance, 1, "Token balance should be 1");
            
            await this.contract.mint(account_two, 3, "");
            await this.contract.mint(account_two, 4, "");
            tokenBalance = await this.contract.balanceOf(account_two);
            assert.equal(tokenBalance, 3, "Token balance should be 1");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let token1Uri = await this.contract.tokenURI(1);
            let token2Uri = await this.contract.tokenURI(2);

            assert.equal(token1Uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Incorrect token 1 uri");
            assert.equal(token2Uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", "Incorrect token 2 uri");
        })

        it('should transfer token from one owner to another', async function () { 
            let address = await this.contract.ownerOf(2);
            assert.equal(address, accounts[2], "Token is not owned by account 2");

            await this.contract.transferFrom(accounts[2], accounts[3], 2, {from: accounts[2]});
            
            address = await this.contract.ownerOf(2);
            assert.equal(address, accounts[3], "Token was not transferred successfully to account 3");

            let balance1 = await this.contract.balanceOf(accounts[2]);
            let balance2 = await this.contract.balanceOf(accounts[3]);

            assert.equal(balance1, 0, "Account 2 still has tokens");
            assert.equal(balance2, 1, "Token was not transferred correctly to account");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
                await this.contract.mint(account[3], 6, "", {from: account[3]});
            } catch(e) {
                failed = true;
            }

            assert.equal(failed, true, "Did not fail, was able to mint from a non-owner address");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert.equal(owner, account_one, "Account one is not the owner");
        })

    });
})