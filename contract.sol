pragma solidity ^0.8.0;

contract ExpenseTracker {
    
    int256 balance;
    int256 income;
    int256 expense;
    
    event transactionData(uint256 id, string text, int256 amount);
    
    struct Transaction {
        uint256 id;
        string text;
        int256 amount;
    }
    mapping (uint256 => Transaction) transaction;
    uint256[] indexArr;
    
    function addTransaction(uint256 id, string memory _text, int256 _amount) public returns (bool) {
        transaction[id].text = _text;
        transaction[id].amount = _amount;
        transaction[id].id = id;
        indexArr.push(id);
        if(_amount > 0) {
            income = income + _amount;
            balance = balance + _amount;
        }
        else {
            expense = expense + _amount;
            balance = balance + _amount;
        }
        emit transactionData(id, _text, _amount);
        return true;
    }
    
    function deleteTransaction(uint256 id) public returns(bool) {
        int256 amount = transaction[id].amount;
        if(amount > 0) {
            income = income - transaction[id].amount;
            balance = balance - transaction[id].amount;
        }
        else {
            expense = expense - transaction[id].amount;
            balance = balance - transaction[id].amount;
        }
        delete transaction[id];
        for(uint256 i= 0; i< indexArr.length; i++) {
            if(indexArr[i] == id) {
                indexArr[i] = indexArr[indexArr.length - 1];
                delete indexArr[indexArr.length - 1];
                indexArr.pop();
            }
        }
        return true;
    }
    
    function getTransaction(uint256 id) public view returns(Transaction memory txData){
        return transaction[id];
    }
    
    function getBalance() public view returns (int256) {
        return balance;
    }
    
    function getIncome() public view returns (int256) {
        return income;
    }
    
    function getExpense() public view returns (int256) {
        return expense;
    }
    
    function getIndexArray() public view returns(uint256[] memory) {
        return indexArr;
    }
}