const { ethers, network } = require("hardhat");
const metadata = require("../ghost_metadata.json");
const { createVoucher, META_DATA_URI } = require("../voucherHelper");
const fs = require("fs");
const path = require("path");

const PRICE = ethers.utils.parseEther("0.1");
const TOTAL_NFT_VOUCHERS = 5;

const createSalesOrder = async () => {
    const [signer] = await ethers.getSigners();

    const SIGNING_DOMAIN = "Lazy-Domain";
    const SIGNING_VERSION = "1";
    const MINTER = signer;

    const lazyMint = await ethers.getContract("LazyMint");

    const domain = {
        name: SIGNING_DOMAIN,
        version: SIGNING_VERSION,
        verifyingContract: lazyMint.address,
        chainId: network.config.chainId
    }    

    let salesOrders = [];

    for (let i = 0; i <= TOTAL_NFT_VOUCHERS; i++) {
        let voucher = {
            tokenId: i,
            price: PRICE,
            uri: META_DATA_URI
        }
        let signedVoucher = await createVoucher(MINTER, domain, voucher);
        let nftOrder = {
            tokenID: i,
            price: PRICE.toString(),
            meta: metadata,
            uri: META_DATA_URI,
            signedVoucher
        }
        salesOrders.push(nftOrder)
    }

    if(salesOrders.length){
       try {
        fs.writeFileSync(path.join(__dirname, '../NFTVouchers.json'), JSON.stringify(salesOrders));
       } catch (error) {
        console.log(error);
        
       }
    }
    console.log('Sales Orders Created ---> in NFTVouchers.json');
}

createSalesOrder().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1);
})