let transactions = [];

// Retrieve transactions array from localStorage on page load
window.addEventListener('load', function () {
    let storedTransactions = localStorage.getItem('transactions');
    transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    // Call onClickCalculate to update the table and totals
    onClickCalculate("reload");
});

// Store transactions array in localStorage before page unload
window.addEventListener('beforeunload', function () {
    localStorage.setItem('transactions', JSON.stringify(transactions));
});

function onClickCalculate(prop) {
    let selectTransaction = document.getElementById('selectTransaction').value;
    let heading = document.getElementById('heading').value;
    let amount = document.getElementById('amount').value;
    let date = document.getElementById('date').value;
    let tableBody = document.getElementById('transactionsTableBody');

    if ((amount > 0 && selectTransaction && heading && date) || prop) {
        let data = {
            id: transactions.length,
            selectTransaction,
            heading,
            amount,
            date
        };

        data.amount && transactions.push(data);

        // Clear the existing table rows
        tableBody.innerHTML = '';

        // Update the total income and expense
        let totalIncome = 0;
        let totalExpense = 0;
        let totalBalance = 0;

        transactions.forEach(function (transaction) {
            let row = document.createElement('tr');
            row.innerHTML = `
        <td>${transaction.selectTransaction === 'Income' ? `<i class="fas fa-plus" style="color: green;"></i>` : `<i class="fas fa-minus" style="color: red;"></i>`}</td>
        <td>${transaction.selectTransaction}</td>
        <td>${transaction.heading}</td>
        <td>${transaction.amount}</td>
        <td>${transaction.date}</td>
        <td><i class="fas fa-trash trash-icon" style="color: rgb(243, 0, 0);" onclick="onDelete(${transaction.id})"></i></td>
      `;
            tableBody.appendChild(row);

            if (transaction.selectTransaction === 'Income') {
                totalIncome += parseInt(transaction.amount);
            } else if (transaction.selectTransaction === 'Expense') {
                totalExpense += parseInt(transaction.amount);
            }
            totalBalance = totalIncome - totalExpense;
        });

        if (transactions.length > 0) {
            document.getElementById("deleteAllBtn").disabled = false
        }

        if (transactions.length == 0) {
            document.getElementById("deleteAllBtn").disabled = true
        }

        // Update the total income and expense in the HTML elements
        document.getElementById('incomeAmount').innerHTML = `$ ${totalIncome}`;
        document.getElementById('expenseAmount').innerHTML = `$ ${totalExpense}`;
        document.getElementById('balance').innerHTML = `$ ${totalBalance}`;
        document.getElementById('heading').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('date').value = '';
    } else {
        alert('Fill Your Form Fields Properly..!');
    }
}

function onDelete(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    onClickCalculate('fromDelete'); // Re-render the table after deleting the transaction
}

function deleteAll() {
    transactions = []
    onClickCalculate('fromDelete');

}