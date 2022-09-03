require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();


module.exports = {
  defaultNetwork: "hardhat",
  networks:{
    localhost:{
      chainId: 31337,
      blockConfirmation:1
    },
    hardhat:{
      chainId: 31337,
      blockConfirmation:1
    },
    mumbai:{
      url: process.env.MUMBAI_RPC_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      blockConfirmation:1
    }
  },
  solidity:{
    compilers:[
      {version:  "0.8.4"},
      {version:  "0.8.9"}
    ]
  },
  namedAccounts:{
    deployer:{
      default:0
    }
  },
  etherscan:{
    apiKey: process.env.POLYSCAN_API_KEY
  },
  mocha:{
    timeout: 1000000
  }
};
