// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const JobPortal = await hre.ethers.getContractFactory("JobPortal");
  const Codesafe = await hre.ethers.getContractFactory("xCode");

  const jobPortal = await JobPortal.deploy();

  const cap = ethers.utils.parseEther("1000000000");
  const codesafe = await Codesafe.deploy(cap);

  await jobPortal.deployed();
  await codesafe.deployed();

  fs.writeFileSync(
    "./config.js",
    `export const contractAddress = "${jobPortal.address}";\nexport const codesafeAddress = "${codesafe.address}";`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
