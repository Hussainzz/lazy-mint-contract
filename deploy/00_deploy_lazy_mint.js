const { developmentChains } = require("../helper-hardhat");
const { verify } = require("../task/verify");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deployer} = await getNamedAccounts();
    const {deploy, log} = deployments;

    log('-----------------------------------------');

    const minter = deployer // can add different address as minter, using deployer[as minter] in my case
    const lazyMint = await deploy("LazyMint",{
        from: deployer,
        args:[minter],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });
    

    log('-----------------------------------------');

    //verify contract
    if (!developmentChains.includes(network.name) && process.env.POLYSCAN_API_KEY) {
        log("Verifying...")
        await verify(lazyMint.address, [deployer])
    }
}

module.exports.tags = ["all","lazyMint"];