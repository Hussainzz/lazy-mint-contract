const { ethers } = require("hardhat");
const { createVoucher, META_DATA_URI } = require("../voucherHelper");

const TOKEN_ID_TO_MINT = 0;

const lazyMintNFT = async () => {
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

    const price = ethers.utils.parseEther("0.1")
    const voucher = {
        tokenId: TOKEN_ID_TO_MINT,
        price: price,
        uri: META_DATA_URI
    }

    const signedVoucher = await createVoucher(MINTER, domain, voucher)

    const mintVoucher = [TOKEN_ID_TO_MINT, price, META_DATA_URI, signedVoucher];
    const mintTxn = await lazyMint.mintNFT(signer.address, mintVoucher,{ 
        value: ethers.utils.parseEther("0.2") 
    });
    const receipt = await mintTxn.wait(1);

    //find event NewMint emitted on new NFT mint
    const newMintEvent = receipt.events.find(e => e.event === "NewMint");
    console.log(`Minted new NFT to address: ${newMintEvent.args['to']} | TokenID: ${newMintEvent.args.tokenId.toString()}`)
}

lazyMintNFT().then(() => process.exit(0)).catch((err) => {
    console.log(err);
    process.exit(1);
})

