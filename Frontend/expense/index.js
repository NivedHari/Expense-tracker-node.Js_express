const form = document.querySelector(".form-control");
const expenseList = document.getElementById("expense-list");

form.addEventListener("submit", addExpense);

function addExpense(event) {
  event.preventDefault();

  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const expense = {
    amount,
    category,
    description,
  };
  fetch("http://localhost:3000/expense/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
    .then(() => {
      fetchExpenses();
      form.reset();
    })
    .catch((err) => {
      console.log(err);
    });
}

function fetchExpenses() {
  fetch("http://localhost:3000/expense")
    .then((response) => response.json())
    .then((data) => {
      displayExpenses(data.expenses);
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayExpenses(expenses) {
  expenseList.innerHTML = "";
  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.textContent = `Amount: ${expense.amount}, Category: ${expense.category}, Description: ${expense.description}`;
    expenseList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchExpenses();
});