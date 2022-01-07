import hre from "hardhat";
import * as abi from "@api3/airnode-abi";
// TODO: replace with @services/...
import deploymentJson from "../deployments/0.3.1/localhost.json";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

async function main() {
  const template = {
    endpoint: "convertToUSD",
    oisTitle: "Currency Converter API",
    parameters: [
      { type: "bytes32", name: "to", value: "USD" },
      { type: "bytes32", name: "_type", value: "int256" },
      { type: "bytes32", name: "_path", value: "result" },
      { type: "bytes32", name: "_times", value: "1000000" },
    ],
  };
  const endpointId = hre.ethers.utils.keccak256(
    hre.ethers.utils.defaultAbiCoder.encode(
      ["string", "string"],
      [template.oisTitle, template.endpoint]
    )
  );
  const airnodeRrp = await hre.ethers.getContractAt(
    "IAirnodeRrp",
    deploymentJson["AirnodeRrp"]
  );
  let tx = await airnodeRrp.createTemplate(
    deploymentJson["Airnode"],
    endpointId,
    abi.encode(template.parameters)
  );
  const logs = await hre.ethers.provider.getLogs({
    fromBlock: 0,
    address: airnodeRrp.address,
  });
  const log = logs.find((log) => log.transactionHash === tx.hash);
  const parsedLog = airnodeRrp!.interface.parseLog(log!);
  const templateId = parsedLog.args.templateId;
  const parameters = abi.encode([
    { type: "bytes32", name: "from", value: "ETH" },
  ]);
  // Derive beaconId
  const beaconId = hre.ethers.utils.keccak256(
    hre.ethers.utils.solidityPack(
      ["bytes32", "bytes"],
      [templateId, parameters]
    )
  );
  console.log("BeaconId: ", beaconId);

  const destinationDir = "./beacons";
  const fileName = "convertToUSD.json";
  try {
    mkdirSync(destinationDir, { recursive: true });
  } catch (e) {
    console.log("Cannot create folder ", e);
  }
  writeFileSync(
    path.join(destinationDir, fileName),
    JSON.stringify({ beaconId }, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
