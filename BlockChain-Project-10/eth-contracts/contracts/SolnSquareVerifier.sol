pragma solidity ^0.5.0;

import "./verifier.sol";
import "./ERC721Mintable.sol";
import 'openzeppelin-solidity/contracts/utils/Address.sol';

// // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {
}
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {

Verifier verifierContract;

constructor(address verifierAddress, string memory name, string memory symbol) CustomERC721Token(name, symbol) public 
    {
        verifierContract = Verifier(verifierAddress);
    }

// TODO define a solutions struct that can hold an index & an address
struct Solutions {
address sender;
uint256 index;
}

// TODO define an array of the above struct
    Solutions[] public arr;

// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solutions) private solutions;

// TODO Create an event to emit when a solution is added
event AddSplution();

// TODO Create a function to add the solutions to the array and emit the event
function addSolutions(address _address, uint256 _index, uint[2] memory A, uint[2] memory A_p,uint[2][2] memory B, uint[2] memory B_p, uint[2] memory C,
                        uint[2] memory C_p, uint[2] memory H, uint[2] memory K, uint[2] memory input) public
{
    bytes32 key = keccak256(abi.encodePacked(A, A_p, B, B_p, C, C_p, H, K, input));
    require(isDuplicate(key) == false, "token already exsits.");
    Solutions memory sol = Solutions({sender: _address, index: _index});
	solutions[key] = sol;
    arr.push(sol);
    emit AddSplution();
}
function isDuplicate(bytes32 key) public view returns (bool){
    bool isDuplicate = true;
    if (solutions[key].sender != address(0)){
        isDuplicate = false;
    }
    return isDuplicate;	
}
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintNFT(address to, uint256 tokenId, uint[2] memory A, uint[2] memory A_p, uint[2][2] memory B,
                uint[2] memory B_p, uint[2] memory C, uint[2] memory C_p, uint[2] memory H, uint[2] memory K, uint[2] memory input) public{
    addSolutions(to, tokenId, A, A_p, B, B_p, C, C_p, H, K, input);
    super.mint(to, tokenId);
    }
}
