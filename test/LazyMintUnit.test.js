const { assert, expect } = require("chai");
const { ethers, deployments, network } = require("hardhat");
const { META_DATA_URI, createVoucher } = require("../voucherHelper");

const SIGNING_DOMAIN = "Lazy-Domain";
const SIGNING_VERSION = "1";

describe("Lazy Mint NFT Unit Tests", function() {
    let lazyMintContract, deployer, someAccount, mintVoucher, voucher, domain, mintTokenId
    const price = ethers.utils.parseEther("0.1")
    beforeEach(async function() {
        let accounts = await ethers.getSigners();
        deployer = accounts[0];
        someAccount = accounts[1];

        await deployments.fixture(["all"]);
        lazyMintContract = await ethers.getContract("LazyMint");

        domain = {
            name: SIGNING_DOMAIN,
            version: SIGNING_VERSION,
            verifyingContract: lazyMintContract.address,
            chainId: network.config.chainId
        }    
    
        mintTokenId = 0
        voucher = {
            tokenId: mintTokenId,
            price: price,
            uri: META_DATA_URI
        }
    
        const signedVoucher = await createVoucher(deployer, domain, voucher)
        mintVoucher = [mintTokenId, price, META_DATA_URI, signedVoucher]
    });

    it("Should allow to mint nft with valid voucher", async function() {
        await expect(lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        })).to.emit(lazyMintContract, "NewMint");
    });

    it("Should fail to mint nft if price passed is less than voucher price", async function() {
        await expect(lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: ethers.utils.parseEther("0")
        })).to.be.revertedWithCustomError(lazyMintContract, "NotEnoughValue")
    });

    it("Should fail to mint nft with existing tokenId", async function() {
        await lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        });
        await expect(lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        })).to.be.revertedWith("ERC721: token already minted");
    });

    it("Should not allow to mint nft with invalid voucher", async function() {
        const signedVoucher = await createVoucher(someAccount, domain, voucher)
        mintVoucher = [0, price, META_DATA_URI, signedVoucher]
        
        await expect(lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        })).to.be.revertedWithCustomError(lazyMintContract, "OnlyMinter")
    });

    it("Should fetch tokenURI for the given tokenId", async function() {
        await lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        });
        const uri = await lazyMintContract.tokenURI(mintTokenId);
        expect(uri).to.be.equal(META_DATA_URI)
    });

    it("Should fail to fetch tokenURI for invalid tokenId", async function() {
        await expect(lazyMintContract.tokenURI(2)).to.be.revertedWith("ERC721: invalid token ID")
    });

    
    it("Should allow owner to withdraw funds", async () => {
        await lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        });
        await expect(lazyMintContract.withdrawFunds()).to.emit(lazyMintContract, "FundsWithdrawn");
    });

    it("Should not allow to withdraw funds if one is not an owner", async () => {
        await lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        });
        const l = await lazyMintContract.connect(someAccount);
        await expect(l.withdrawFunds()).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Owner's balance should reflect after withdrawing funds", async () => {
        await lazyMintContract.mintNFT(deployer.address, mintVoucher, {
            value: price
        });
        let oldOwnerBalance = await ethers.provider.getBalance(deployer.address);
        const withdrawTxn = await lazyMintContract.withdrawFunds();
        const receipt = await withdrawTxn.wait();
        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
        const currentBalance = await ethers.provider.getBalance(deployer.address);
        //assert.equal(currentBalance.toString(), oldOwnerBalance.add(price.sub(gasUsed)).toString());
        expect(currentBalance.toString()).to.be.equal(oldOwnerBalance.add(price.sub(gasUsed)).toString())
    });

    it("Should return true when checking for ERC721 interface support", async () => {
        const ERC_INTERFACE_ID = "0x80ac58cd";
        const support = await lazyMintContract.supportsInterface(ERC_INTERFACE_ID);
        assert(support);
    })


});