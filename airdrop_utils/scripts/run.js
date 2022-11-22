const { ethers } = require("hardhat");
const hre = require("hardhat");
const { getSpanningAddress } = require("@spanning/utils");

async function main() {

  // Define a list of wallets to airdrop NFTs
  // Note: These should be 32Byte Spanning Addresses
  // https://docs.spanning.network/docs/concepts/address
  const airdropAddresses = [
    // Here is Goerli user: 0x4bd0f88ccaacffacb05c83a0fb400f90120bc7db
    getSpanningAddress(5, "4bd0f88ccaacffacb05c83a0fb400f90120bc7db"),
    // Here is Ethereum user: 0x4bd0f88ccaacffacb05c83a0fb400f90120bc7db
    getSpanningAddress(1, "4bd0f88ccaacffacb05c83a0fb400f90120bc7db"),
    // Here is Harmony user: 0x4bd0f88ccaacffacb05c83a0fb400f90120bc7db
    getSpanningAddress(1666600000, "4bd0f88ccaacffacb05c83a0fb400f90120bc7db"),
  ];

  // Create Spanning Utils library
  // Note: if already deploy, this can be replaced with a known library deployment
  // address
  const SpanningAddressFactory = await ethers.getContractFactory("SpanningAddress");
  const spanningAddress = await SpanningAddressFactory.deploy();

  // Create Delegate deployment - FOR TESTING ONLY
  const SpanningDelegate = await ethers.getContractFactory(
    "SpanningDelegate",
    {
        libraries: { SpanningAddress: spanningAddress.address },
    }
  );
  const chainId = 1;
  const delegate = await SpanningDelegate.deploy(
      ethers.utils.hexZeroPad(`0x${chainId.toString(16)}`, 4)
  );

  await delegate.deployed();
  const delegate_address = delegate.address;

  // Set the Spanning Delegate contract (i.e., the multichain API endpoint)
  // See https://docs.spanning.network/docs/deployment
  // const delegate_address = "";

  const factory = await hre.ethers.getContractFactory(
      "NFTAirdrop",
      {
          libraries: { SpanningAddress: spanningAddress.address },
      }
      );
  const [owner] = await hre.ethers.getSigners();
  const contract = await factory.deploy(delegate_address);

  await contract.deployed();
  console.log("Contract deployed to: ", contract.address);
  console.log("Contract deployed by (Owner): ", owner.address, "\n");

  let txn;
  txn = await contract.airdropNfts(airdropAddresses);
  await txn.wait();
  console.log("NFTs airdropped successfully!");

  console.log("\nCurrent NFT balances:")
  for (let i = 0; i < airdropAddresses.length; i++) {
    // Note: we must specify ['balanceOf(bytes32)'] as oppose to
    // calling `.balanceOf` because it is an overridden function
    let bal = await contract['balanceOf(bytes32)'](airdropAddresses[i]);
    console.log(`${i + 1}. ${airdropAddresses[i]}: ${bal}`);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });