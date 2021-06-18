if( typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
}
else {
	web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2486136c6c9846278fe46acadc814e35"));
}

web3.eth.defaultAccount = web3.eth.accounts[0]; 

const ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "int256",
				"name": "balance",
				"type": "int256"
			}
		],
		"name": "getBalance",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "int256",
				"name": "expense",
				"type": "int256"
			}
		],
		"name": "getExpense",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "int256",
				"name": "income",
				"type": "int256"
			}
		],
		"name": "getIncome",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "amount",
				"type": "int256"
			}
		],
		"name": "transactionData",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_text",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "_amount",
				"type": "int256"
			}
		],
		"name": "addTransaction",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "deleteTransaction",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const address = "0x96a2525aD9357bB1E7E9E05c2aE8442441E2D4DE";

var contract = new web3.eth.Contract (ABI, address);


const handleBalanceEvent = async() => {
	let getBalanceEvents = await contract.getPastEvents("getBalance", {
		fromBlock: 0,
		toBlock: "latest"
	});

	for(let i= 0; i< getBalanceEvents.length; i++) {
		let filtered = getBalanceEvents[i].returnValues;
		var returnBalance = {
			balance: filtered.balance,
		}
	}
	$('#balance').html("$" + returnBalance.balance);
};

const handleExpenseEvent = async() => {
	let getExpenseEvents = await contract.getPastEvents("getExpense", {
		fromBlock: 0,
		toBlock: "latest"
	});

	for(let i= 0; i< getExpenseEvents.length; i++) {
		let filtered = getExpenseEvents[i].returnValues;
		var returnExpense = {
			expense: filtered.expense,
		}
	}
	$('#money-minus').html("$" + returnExpense.expense);
};

const handleIncomeEvent = async() => {
	let getIncomeEvents = await contract.getPastEvents("getIncome", {
		fromBlock: 0,
		toBlock: "latest"
	});

	for(let i= 0; i< getIncomeEvents.length; i++) {
		let filtered = getIncomeEvents[i].returnValues;
		var returnIncome = {
			income: filtered.income,
		}
	}
	$('#money-plus').html("$" + returnIncome.income);
};

handleBalanceEvent();
handleExpenseEvent();
handleIncomeEvent();