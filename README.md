
# Lazy Ghost NTFs 

## Demo
My full article explaining lazy minting can be found on https://dev.to

https://dev.to/hussainzz/lazy-minting-nft-solidity-hardhat-30l1

[https://dev.to/hussainzz](https://dev.to/hussainzz)

Dapp [https://ghost-mint-57sbttrch-hussainzz.vercel.app/](https://ghost-mint-57sbttrch-hussainzz.vercel.app/)

## Installation

```
> yarn install
```

Next,rename `env.example` to `.env` and populate values
```
PRIVATE_KEY=<Your Wallet Private Key>
MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/<API_KEY>
POLYSCAN_API_KEY=<PolyScan API KEY>
```


## Contract Deployment

```
> yarn hardhat deploy --network <network_name_defined_in_config>
```

deployment script should also verify the contract,In case it fails you can manually verify by running

```
yarn hardhat verify --network <networkName> <deployedContractAddress>  "<constructorArgument>[in this case minterAddress]"
```
## Creating Sales Order [Signed Vouchers]

Run,
```
> yarn hardhat run scripts/createSalesOrder.js --network <network_name>
```

This will create file in `/lazymintdapp/src/NFTVouchers.json`


## Unit Tests

```
> yarn hardhat test

 Lazy Mint NFT Unit Tests
    ✔ Should allow to mint nft with valid voucher (94ms)
    ✔ Should fail to mint nft if price passed is less than voucher price (85ms)
    ✔ Should fail to mint nft with existing tokenId (99ms)
    ✔ Should not allow to mint nft with invalid voucher (48ms)
    ✔ Should fetch tokenURI for the given tokenId (62ms)
    ✔ Should fail to fetch tokenURI for invalid tokenId
    ✔ Should allow owner to withdraw funds (61ms)
    ✔ Should not allow to withdraw funds if one is not an owner (71ms)
    ✔ Owner's balance should reflect after withdrawing funds (68ms)
    ✔ Should return true when checking for ERC721 interface support (44ms)
```
## [Lazy NFTs Dapp readme](https://github.com/Hussainzz/lazy-mint-contract/tree/main/lazymintdapp#readme)


<img src="https://user-images.githubusercontent.com/13753141/188255178-bfc2507f-faee-4a4b-93f6-ac6cca3cab01.png" width="800" height="500">
