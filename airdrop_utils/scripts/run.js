const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

  // Define a list of wallets to airdrop NFTs
  // Note: These should be 32Byte Spanning Addresses
  // https://docs.spanning.network/docs/concepts/address
  const airdropAddresses = [
    // Here is Rinkeby user: 0x4bd0f88ccaacffacb05c83a0fb400f90120bc7db
    "0x0000000400000000000000004bd0f88ccaacffacb05c83a0fb400f90120bc7db",
    // Here is Ethereum user: 0x4bd0f88ccaacffacb05c83a0fb400f90120bc7db
    "0x0000000100000000000000004bd0f88ccaacffacb05c83a0fb400f90120bc7db",
    // Here is Harmony user: 0x4bd0f88ccaacffacb05c83a0fb400f90120bc7db
    "0x63564C4000000000000000004bd0f88ccaacffacb05c83a0fb400f90120bc7db",
  ];

  const factory = await hre.ethers.getContractFactory("NFTAirdrop");
  const [owner] = await hre.ethers.getSigners();
  const contract = await factory.deploy();

  await contract.deployed();
  console.log("Contract deployed to: ", contract.address);
  console.log("Contract deployed by (Owner): ", owner.address, "\n");

  let txn;
  txn = await contract.airdropNfts(airdropAddresses);
  await txn.wait();
  console.log("NFTs airdropped successfully!");

  console.log("\nCurrent NFT balances:")
  for (let i = 0; i < airdropAddresses.length; i++) {
    let bal = await contract.balanceOf(airdropAddresses[i]);
    console.log(`${i + 1}. ${airdropAddresses[i]}: ${bal}`);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });