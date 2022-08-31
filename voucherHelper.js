const types = {
    LazyMintVoucher:[
        {name: "tokenId", type:"uint256"},
        {name: "price", type:"uint256"},
        {name: "uri", type:"string"}
    ]
}

module.exports.META_DATA_URI= "https://ipfs.io/ipfs/QmPE9bwcVXiCxtH5q5R3mC2DpDkyDbJUZKmNAbAkhZVfWE"

module.exports.createVoucher = async (signer, domain, voucher) => {
    const signature = await signer._signTypedData(domain, types, voucher);
    return signature
}
