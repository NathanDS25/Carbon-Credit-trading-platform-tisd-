import hre from "hardhat";

async function main() {
  const CarbonCredit = await hre.ethers.getContractFactory("CarbonCredit");
  const carbonCredit = await CarbonCredit.deploy();

  await carbonCredit.waitForDeployment();

  console.log(`CarbonCredit deployed to: ${await carbonCredit.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
