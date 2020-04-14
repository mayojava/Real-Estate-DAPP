// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Verifier = artifacts.require("Verifier");

contract('TestSolnSquareVerifier', accounts => {

    describe('test ability to mint token and add solutions', function () {
        beforeEach(async function () {
            var verifierContract = await Verifier.new({from: accounts[0]});
            this.contract = await SolnSquareVerifier.new(verifierContract.address);
        })

        it('should be able to mint coin with unique solution', async function () {
            let res = await this.contract.mintNewNFT.call(
                accounts[1],
                10,
                "",
                ["0x2f72cbd7e0852bc92b679bf11259108f0ac787869da19b4bb76e55ef3535c177", "0x0414e7e4095b9d390f7a4bb0a181d621d9c0be5aedb044557c11ba830f52341b"],
                [["0x0c6d3ec9cebdc5fa3e57eabbd8bfe26cea6873c133d8cf835f9c4c14b332979f", "0x1cbb904036e3521a944f147e0dae0b006144f55d6b72863cbea06ef2410cb222"], ["0x1731c80bd00b909f5e3e7539138a2d1ff01a9d31db37b452236bee576f0ecb69", "0x2da55a6f8cea1616cd5c116fa286772812542a6e8d7fe7f2cc485089510e261a"]],
                ["0x258f11e93a47963235db7bbe253aca36fd49401f54cd63dd9f0ad1f4aa0837a0", "0x2e40536ab25b1e8c61b7d79cd39bc06b8cf5530cb00bfd63a44914460ab23645"],
                ["0x000000000000000000000000000000000000000000000000000000000002c4e4", "0x0000000000000000000000000000000000000000000000000000000000000001"]
            );

            this.contract.TokenMinted(function (err, res) {
                console.log("Token was minted");
            });

            assert.equal(res, true, "Token was not minted");
        });

        it('should not be able to mint coin with already used solution', async function () {
           //add a solution
            await this.contract.addSolution(
            ["0x2f72cbd7e0852bc92b679bf11259108f0ac787869da19b4bb76e55ef3535c177", "0x0414e7e4095b9d390f7a4bb0a181d621d9c0be5aedb044557c11ba830f52341b"],
            [["0x0c6d3ec9cebdc5fa3e57eabbd8bfe26cea6873c133d8cf835f9c4c14b332979f", "0x1cbb904036e3521a944f147e0dae0b006144f55d6b72863cbea06ef2410cb222"], ["0x1731c80bd00b909f5e3e7539138a2d1ff01a9d31db37b452236bee576f0ecb69", "0x2da55a6f8cea1616cd5c116fa286772812542a6e8d7fe7f2cc485089510e261a"]],
            ["0x258f11e93a47963235db7bbe253aca36fd49401f54cd63dd9f0ad1f4aa0837a0", "0x2e40536ab25b1e8c61b7d79cd39bc06b8cf5530cb00bfd63a44914460ab23645"],
            ["0x000000000000000000000000000000000000000000000000000000000002c4e4", "0x0000000000000000000000000000000000000000000000000000000000000001"],
            accounts[2]
           );

            let minted = false;
            
            //try minting with already existing solution
            try {
                minted = await this.contract.mintNewNFT(
                    accounts[2],
                    10,
                    "",
                    ["0x2f72cbd7e0852bc92b679bf11259108f0ac787869da19b4bb76e55ef3535c177", "0x0414e7e4095b9d390f7a4bb0a181d621d9c0be5aedb044557c11ba830f52341b"],
                    [["0x0c6d3ec9cebdc5fa3e57eabbd8bfe26cea6873c133d8cf835f9c4c14b332979f", "0x1cbb904036e3521a944f147e0dae0b006144f55d6b72863cbea06ef2410cb222"], ["0x1731c80bd00b909f5e3e7539138a2d1ff01a9d31db37b452236bee576f0ecb69", "0x2da55a6f8cea1616cd5c116fa286772812542a6e8d7fe7f2cc485089510e261a"]],
                    ["0x258f11e93a47963235db7bbe253aca36fd49401f54cd63dd9f0ad1f4aa0837a0", "0x2e40536ab25b1e8c61b7d79cd39bc06b8cf5530cb00bfd63a44914460ab23645"],
                    ["0x000000000000000000000000000000000000000000000000000000000002c4e4", "0x0000000000000000000000000000000000000000000000000000000000000001"]
                );
            } catch(e) {}

            assert.equal(minted, false, "Coin was minted with an existing solution");
        })
    });

});