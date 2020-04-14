pragma solidity >=0.4.21 <0.6.0;
import "./ERC721Mintable.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract VerifierContract {
    function verifyTx(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public returns(bool r);
}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

// TODO define a solutions struct that can hold an index & an address


// TODO define an array of the above struct


// TODO define a mapping to store unique solutions submitted



// TODO Create an event to emit when a solution is added



// TODO Create a function to add the solutions to the array and emit the event



// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

contract SolnSquareVerifier is CustomERC721Token {
    using SafeMath for uint256;

    VerifierContract private verifyContract;

    constructor(address verifierAddress) public {
        verifyContract = VerifierContract(verifierAddress);
    }

    struct Solution {
        uint256 index;
        address _address;
    }

    mapping(bytes32 => Solution) uniqueSolutions;

    event SolutionAdded(bytes32 hash);
    event TokenMinted(uint256 id, address to);

    Solution[] public solutions;
    uint256 private index;

    function addSolution(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input,
        address _address
    ) public {
        bytes32 solutionHash = keccak256(abi.encodePacked(input[0], input[1]));
        uniqueSolutions[solutionHash] = Solution(
            index, 
            _address
        );
        solutions.push(uniqueSolutions[solutionHash]);

        index = index.add(1);
        emit SolutionAdded(solutionHash);
    }

    function mintNewNFT(
        address to,
        uint256 tokenId,
        string memory tokenUri,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public returns (bool) {
        bytes32 solutionHash = keccak256(abi.encodePacked(input[0], input[1]));

        //ensure that the solution is unique
        require(uniqueSolutions[solutionHash]._address == address(0), "This solution is not unique");

        bool verification = verifyContract.verifyTx(a,b,c,input);
        require(verification, "Unable to verify solution");

        addSolution(a,b,c,input, msg.sender);

        super.mint(to, tokenId, tokenUri);
        emit TokenMinted(tokenId, to);
        return true;
    }
}


  


























