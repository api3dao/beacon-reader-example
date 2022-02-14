const { getServiceData } = require("@api3/services");

module.exports = async ({ deployments, getChainId }) => {
  const { deploy, log } = deployments;
  const [deployer] = await hre.ethers.getSigners();
  const chainIdToNetwork = {
    3: 'ropsten',
    4: 'rinkeby',
    5: 'goerli',
    31337: 'localhost',
    80001: 'polygon-mumbai'
  };
  const chainId = await getChainId();
  const network = chainIdToNetwork[chainId];
  if (!network) {
    throw new Error(`Invalid network with chain ID ${chainId}`);
  }

  let rrpBeaconServerAddress;
  if (network === 'localhost') {
    // Deploy MockRrpBeaconServer if on localhost...
    const rrpBeaconServerDeployment = await deploy('MockRrpBeaconServer', {
      from: deployer.address,
      log: true,
    });
    rrpBeaconServerAddress = rrpBeaconServerDeployment.address;
    log(`Deployed MockRrpBeaconServer at ${rrpBeaconServerAddress}`);
    // and mock-set a beacon value
    const beaconId = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const beaconValue = 123456;
    const beaconTimestamp = Math.floor(Date.now() / 1000);
    const rrpBeaconServer = new hre.ethers.Contract(
      rrpBeaconServerDeployment.address,
      rrpBeaconServerDeployment.abi,
      deployer
    );
    await rrpBeaconServer.setBeacon(beaconId, beaconValue, beaconTimestamp);
    log(`Mock-set beacon with ID ${beaconId} to value: ${beaconValue}, timestamp: ${beaconTimestamp}`);
  } else {
    // Use the pre-deployed RrpBeaconServer
    const serviceData = getServiceData("Amberdata", "ETH/USD", network);
    rrpBeaconServerAddress = serviceData.contracts.RrpBeaconServer;
  }

  const beaconReaderExampleDeployment = await deploy('BeaconReaderExample', {
    args: [rrpBeaconServerAddress],
    from: deployer.address,
    log: true,
  });
  log(`Deployed BeaconReaderExample at ${beaconReaderExampleDeployment.address}`);
};
module.exports.tags = ['Deploy'];
