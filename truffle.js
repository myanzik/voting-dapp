const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonicPhrase = "";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
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
          providerOrUrl: "https://testnetwork.esatya.io"
        });
      },
      network_id: "2020"
    },
    compilers: {
      solc: {
        version: "0.6.4" // Fetch exact version from solc-bin (default: truffle's version)
      }
    }
  }
};
