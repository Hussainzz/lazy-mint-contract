module.exports = async ({getNamedAccounts, deployments}) => {
    const {deployer} = await getNamedAccounts();
    const {deploy, log} = deployments;

    log('-----------------------------------------');

    const minter = deployer // can add different address as minter, using deployer it self in my case
    const lazyMint = await deploy("LazyMint",{
        from: deployer,
        args:[minter],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });

    log('-----------------------------------------');

    //need to add verify task
}

module.exports.tags = ["all","lazyMint"];