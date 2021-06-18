const rpcUrl = "https://ropsten.infura.io/v3/2486136c6c9846278fe46acadc814e35"; //infura API endpoint
let web3 = new Web3(rpcUrl);

const pubKey = "0x44aDF978C689496C6c0ceDb60ec484f85836d391";
const priKey = "ff441288f855c5ea89e0bab86d9e176e84198034c75bf8f04e246ca67d314338";

const priKeyBuffer = new ethereumjs.Buffer.Buffer(priKey, 'hex');

const abi = [
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
		"name": "getBalance",
		"type": "event"
	},
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
const address = "0x994dA747f06408d79e9DCabF626aA77c0e566674";

var contract = new web3.eth.Contract(abi, address);




const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
	e.preventDefault();
  
	if (text.value.trim() === '' || amount.value.trim() === '') {
	  alert('Please add a text and amount');
	} else {
	  const transaction = {
		id: generateID(),
		text: text.value,
		amount: +amount.value
		
	  };

	  web3.eth.getTransactionCount(pubKey, (err, txCount) => {
	  const objectTx = {
		nonce: web3.utils.toHex(txCount),
		gasLimit: web3.utils.toHex(200000),
		gasPrice: web3.utils.toHex(web3.utils.toWei('120', 'gwei')),
		to: address,
		data: contract.methods.addTransaction(transaction.id, transaction.text, transaction.amount).encodeABI(),
	};
	  const tx = new ethereumjs.Tx(objectTx, {chain: 'ropsten'})
	  tx.sign(priKeyBuffer);
	  const serializedTx = tx.serialize().toString('hex');
	  const raw = '0x' + serializedTx.toString('hex');
	  
	  console.log('serializedTx:', serializedTx)

	  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
		  console.log('Hash: ', txHash, "err: ", err);
	  })
});

	  transactions.push(transaction);
  
	  addTransactionDOM(transaction);
  
	  updateValues();
  
	  updateLocalStorage();
  
	  text.value = '';
	  amount.value = '';
	}
  }

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 1000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>
  `;

  list.appendChild(item);
}

function showTransaction() {

	contract.methods.getTransaction()
	// Get sign
	const sign = transaction.amount < 0 ? '-' : '+';
  
	const item = document.createElement('li');
  
	// Add class based on value
	item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
	item.innerHTML = `
	  ${transaction.text} <span>${sign}${Math.abs(
	  transaction.amount
	)}</span> <button class="delete-btn" onclick="removeTransaction(${
	  transaction.id
	})">x</button>
	`;
  
	list.appendChild(item);
  }

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  web3.eth.getTransactionCount(pubKey, (err, txCount) => {
	  const objectTx = {
		  nonce: web3.utils.toHex(txCount),
		  gasLimit: web3.utils.toHex(200000),
		  gasPrice: web3.utils.toHex(web3.utils.toWei('120', 'gwei')),
		  to: address,
		  data: contract.methods.deleteTransaction(id).encodeABI(),
	  };

	  const tx = new ethereumjs.Tx(objectTx, {chain: 'ropsten'})
	  tx.sign(priKeyBuffer);
	  const serializedTx = tx.serialize();
	  const raw = '0x' + serializedTx.toString('hex');

	  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
		  console.log("Err: ", err, "Hash: ", txHash);
	  })
  })
  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);


let getData = new Array();
var i;

contract.events.getBalance({
    //filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0,
}, function(error, event){ console.log(event); })
.on("connected", function(subscriptionId){
    console.log("connected: ", subscriptionId);
})
.on('data', function(event){
    console.log("data: ", event); // same results as the optional callback above
})
.on('changed', function(event){
	console.log("changed: ", event);
    // remove event from local database
})
.on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
	console.log("error", error, "receipt: ", receipt);
});

// contract.getPastEvents (
	
// 	"AllEvents",
// 	{
// 		fromBlock: 0,
// 		toBlock:'latest',
// 	},
// 	(err, result) => {
// 		for(i = 0; i <= result.length; i++) {
// 			//var a = result.events.getIncome.returnValues['income'];
// 		}

// 		console.log(result);
		
// 	}
// 	)
  

		  

 
