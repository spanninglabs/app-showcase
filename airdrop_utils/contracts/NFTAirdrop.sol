//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@spanning/contracts/utils/Counters.sol";
import "@spanning/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFTAirdrop is SpanningERC721Enumerable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    constructor() ERC721("NFT Aidrop Demo", "NAD") {
        console.log("Contract has been deployed!");
    }

    // Airdrop NFTs
    function airdropNfts(bytes32[] calldata wAddresses) public onlyOwner {

        for (uint i = 0; i < wAddresses.length; i++) {
            _mintSingleNFT(wAddresses[i]);
        }
    }
    
    function _mintSingleNFT(bytes32 wAddress) private {
        uint newTokenID = _tokenIds.current();
        _safeMint(wAddress, newTokenID);
        _tokenIds.increment();
    }
}