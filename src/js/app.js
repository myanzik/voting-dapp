App = {
  web3Provider: null,
  contracts: {},
  networkId: null,

  init: function () {
    return App.initWeb3();
  },

  // Instance Web3
  initWeb3: function () {
    // Is there an injected web3 instance?
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      App.networkId = ethereum.networkVersion;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      // Only useful in a development environment
      App.networkId = 5777;
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  // Instance contract
  initContract: function () {
    $.getJSON("Voting.json", function (data) {
      let abi = data.abi;
      let contractAddress = data.networks[App.networkId].address;
      let instance = new web3.eth.Contract(abi, contractAddress);
      App.contracts.Voting = { abi, contractAddress, instance };
      App.getAllProposals();
    });
    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-value", async function (e) {
      let $this = $(this);
      App.btnLoading($this);
      try {
        await App.handleAddProposal(e);
      } catch (e) {
        App.btnReset($this);
      }
      App.btnReset($this);
    });

    $(document).on("click", ".btn-vote", async function (e) {
      var $this = $(this);
      App.btnLoading($this);
      try {
        await App.handleAddVote(e);
      } catch (e) {
        App.btnReset($this);
      }
      App.btnReset($this);
    });

    window.ethereum.on("accountsChanged", function (account) {
      App.getAllProposals();
    });
  },

  getAccount: async function () {
    let accounts = await web3.eth.getAccounts();
    return accounts[0];
  },

  getAllProposals: async function () {
    let instance = App.contracts.Voting.instance;
    let account = await App.getAccount();
    let numProposals = await instance.methods.getNumProposals().call();
    let wrapperProposals = $("#wrapperProposals");
    wrapperProposals.empty();
    let proposalTemplate = $("#proposalTemplate");

    for (var i = 0; i < numProposals; i++) {
      let data = await instance.methods.getProposal(i).call();
      var idx = data[0];
      proposalTemplate.find(".title").text(data[1]);
      proposalTemplate.find(".proposed-by").text(data[2]);
      proposalTemplate.find(".numVotesPos").text(data[3]);
      proposalTemplate.find(".numVotesNeg").text(data[4]);
      proposalTemplate.find(".btn-vote").attr("data-proposal", idx);
      proposalTemplate.find(".btn-vote").attr("disabled", false);
      let voterStatus = await App.getVoterStatus(i);
      if (voterStatus) {
        proposalTemplate.find(".btn-vote").attr("disabled", true);
      }
      wrapperProposals.append(proposalTemplate.html());
    }
  },

  getVoterStatus: async function (proposalId) {
    let instance = App.contracts.Voting.instance;
    let account = await App.getAccount();
    let voterStatus = await instance.methods.hasVoted(proposalId, account).call();
    return voterStatus;
  },

  handleAddProposal: async function (event) {
    event.preventDefault();

    let instance = App.contracts.Voting.instance;
    let value = $(".input-value").val();
    let account = await App.getAccount();
    if (value === "") {
      $(".toast").toast("show");
      return;
    }

    try {
      let tx = await instance.methods.addProposal(value).send({ from: account });
      if (tx.status) {
        App.getAllProposals();
        $(".input-value").val("");
      }
    } catch (e) {
      throw Error(e);
    }
  },

  handleAddVote: async function (event) {
    event.preventDefault();
    let instance = App.contracts.Voting.instance;
    let voteValue = $(event.target).data("vote");
    let proposalInt = parseInt($(event.target).data("proposal"));
    let account = await App.getAccount();

    try {
      let voteTx = await instance.methods.vote(proposalInt, voteValue).send({ from: account });
      if (voteTx.status) {
        App.getAllProposals();
      }
    } catch (e) {
      throw Error(e);
    }
  },

  btnLoading: function (elem) {
    $(elem).attr("data-original-text", $(elem).html());
    $(elem).prop("disabled", true);
    $(elem).html('<i class="spinner-border spinner-border-sm"></i> Processing...');
  },

  btnReset: function (elem) {
    $(elem).prop("disabled", false);
    $(elem).html($(elem).attr("data-original-text"));
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
