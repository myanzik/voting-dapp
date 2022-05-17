const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const mnemonicPhrase = process.env.MNEMONIC;
const BSCSCANAPIKEY = process.env.BSCSCANAPIKEY; 


module.exports = {
  plugins: [ 'truffle-plugin-verify'],
  api_keys: {
		bscscan: BSCSCANAPIKEY
	},
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rumsanTest: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.RUMSAN_TEST_URL
        });
      },
      network_id: process.env.RUMSAN_TEST_ID
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.ROPSTEN_URL
        });
      },
      network_id: 3
    },
    binance: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: mnemonicPhrase
          },
          providerOrUrl: process.env.BINANCE_TEST_URL
        });
      },
      network_id: 97
    }
  },
  compilers: {
    solc: {
      version: "0.6.4" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
