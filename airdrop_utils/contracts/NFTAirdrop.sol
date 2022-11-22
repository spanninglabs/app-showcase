//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@spanning/contracts/SpanningUtils.sol";
import "@spanning/contracts/token/ERC721/SpanningERC721.sol";

contract NFTAirdrop is SpanningERC721 {
    using Counters for Counters.Counter;
    using SpanningAddress for bytes32;
    
    Counters.Counter private _tokenIds;
    
    constructor(address delegate_) SpanningERC721("NFT Aidrop Demo", "NAD", delegate_) {
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