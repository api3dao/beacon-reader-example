import { writeFileSync } from "fs";
import hre from "hardhat";
import path from "path";
import deploymentJson from "../deployments/0.3.1/localhost.json";

async function main() {
  // TODO: move these two steps to beacon-setup-guide repo
  // 1.deploying RrpBeaconServerReaderWhitelister
  const airnodeWallet = hre.ethers.Wallet.fromMnemonic(
    "achieve climb couple wait accident symbol spy blouse reduce foil echo label"
  ).connect(hre.ethers.provider);
  const RrpBeaconServerReaderWhitelister = await hre.ethers.getContractFactory(
    "RrpBeaconServerReaderWhitelister"
  );
  const rrpBeaconServerReaderWhitelister =
    await RrpBeaconServerReaderWhitelister.deploy(
      "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e" // TODO: read from @services repo
    );
  await rrpBeaconServerReaderWhitelister.deployed();

  const rrpBeaconServer = await hre.ethers.getContractAt(
    "RrpBeaconServer",
    "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e" // TODO: read from @services repo
  );

  const accessControlRegistry = await hre.ethers.getContractAt(
    "IAccessControlRegistry",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // TODO: read from @services repo
  );

  // 2. Grant INDEFINITE_WHITELISTER_ROLE_DESCRIPTION to RrpBeaconServerReaderWhitelister
  const rrpBeaconServerAdminRoleDescription = "RrpBeaconServer admin";
  const managerRootRole = await accessControlRegistry.deriveRootRole(
    airnodeWallet.address
  );
  const adminRole = await rrpBeaconServer.adminRole();
  const tx = await accessControlRegistry
    .connect(airnodeWallet)
    .initializeAndGrantRoles(
      [managerRootRole, adminRole],
      [
        rrpBeaconServerAdminRoleDescription,
        await rrpBeaconServer.INDEFINITE_WHITELISTER_ROLE_DESCRIPTION(),
      ],
      [airnodeWallet.address, rrpBeaconServerReaderWhitelister.address]
    );
  await tx.wait();

  writeFileSync(
    path.join("./deployments/0.3.1", "localhost.json"),
    JSON.stringify(
      {
        ...deploymentJson,
        RrpBeaconServerReaderWhitelister:
          rrpBeaconServerReaderWhitelister.address,
      },
      null,
      2
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
