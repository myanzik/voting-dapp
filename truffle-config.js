const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const mnemonicPhrase = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rumsanTest: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.RUMSAN_TEST_URL
        });
      },
      network_id: process.env.RUMSAN_TEST_ID
    }
  },
  compilers: {
    solc: {
      version: "0.6.4" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
