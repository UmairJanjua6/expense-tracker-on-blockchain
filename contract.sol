pragma solidity ^0.8.0;

contract ExpenseTracker {
    
    int256 balance;
    int256 income;
    int256 expense;
    
    event transactionData(uint256 id, string text, int256 amount);
    event getExpense(int256 expense);
    event getIncome(int256 income);
    event getBalance(int256 balance);
    
    struct Transaction {
        string text;
        int256 amount;
    }
    mapping (uint256 => Transaction) transaction;
    
    function addTransaction(uint256 id, string memory _text, int256 _amount) public returns (bool) {
        transaction[id].text = _text;
        transaction[id].amount = _amount;
        if(_amount > 0) {
            income = income + _amount;
            balance = balance + _amount;
            emit getIncome(income);
            emit getBalance(balance);
        }
        else {
            expense = expense + _amount;
            balance = balance + _amount;
            emit getExpense(expense);
            emit getBalance(balance);
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
        return true;
    }
}