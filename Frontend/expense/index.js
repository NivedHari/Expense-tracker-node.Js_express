const form = document.querySelector(".form-control");
const expenseList = document.getElementById("expense-list");
const leaderList = document.getElementById("leader-list");
const downloadBtn = document.getElementById("download-btn");

form.addEventListener("submit", addExpense);
downloadBtn.addEventListener("click", downloadExpense);

function addExpense(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  console.log(token);

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
      Authorization: token,
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
  if (localStorage.getItem("token") === null) {
    window.location.href = "../User/login.html";
  }
  const token = localStorage.getItem("token");
  fetch("http://localhost:3000/expense", {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.user.isPremium) {
        document.getElementById("premium-btn").style.display = "block";
      } else if (data.user.isPremium) {
        document.getElementById("premium-badge").style.display = "block";
        document.getElementById("leader-btn").style.display = "block";
        downloadBtn.style.display = "flex";
      }
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
    const iconSpan = document.createElement("span");
    iconSpan.classList.add(`material-icons`);
    iconSpan.classList.add("icon");
    iconSpan.textContent = "sell";
    li.appendChild(iconSpan);
    const stackedDiv = document.createElement("div");
    stackedDiv.classList.add("stacked");

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerHTML = `<span class="material-icons">delete</span>`;
    deleteBtn.addEventListener("click", () => deleteExp(expense.id));

    const priceSpan = document.createElement("span");
    priceSpan.className = "price";
    priceSpan.textContent = `$${expense.amount}`;

    const categorySpan = document.createElement("span");
    categorySpan.className = "category";
    categorySpan.textContent = `${expense.category}`;

    stackedDiv.appendChild(priceSpan);
    stackedDiv.appendChild(categorySpan);

    li.appendChild(stackedDiv);

    li.innerHTML += `${expense.description}`;
    li.appendChild(deleteBtn);
    expenseList.appendChild(li);
  });
}

function deleteExp(id) {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:3000/expense/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })
    .then(() => {
      fetchExpenses();
    })
    .catch((err) => {
      console.log(err);
    });
}

document.getElementById("premium-btn").onclick = function (e) {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:3000/user/premium`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch premium data");
      }
      return response.json();
    })
    .then((data) => {
      var options = {
        key: data.key_id,
        order_id: data.order.id,
        handler: function (response) {
          fetch(`http://localhost:3000/user/premium/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            }),
          })
            .then((updateResponse) => {
              if (updateResponse.ok) {
                alert("You are a premium user");
                window.location.reload();
              } else {
                throw new Error("Failed to update premium status");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
      };
      var rzp1 = new Razorpay(options);
      rzp1.open();
      e.preventDefault();
    })
    .catch((err) => {
      console.log(err);
    });
};

document.getElementById("leader-btn").onclick = function (e) {
  document.getElementById("leader-div").style.display = "block";
  const leaderDiv = document.getElementById("leader-div");
  leaderDiv.scrollIntoView({ behavior: "smooth" });
  const token = localStorage.getItem("token");
  fetch("http://localhost:3000/user/leaderboard", {
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      displayLeaderboard(data.expenses);
    });
};

function displayLeaderboard(expenses) {
  let listNumber = 1;
  leaderList.innerHTML = "";
  expenses.forEach((expense) => {
    console.log(expense);
    const li = document.createElement("li");

    const numberSpan = document.createElement("span");
    numberSpan.className = "number";
    numberSpan.textContent = listNumber;
    listNumber++;

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = expense.name;

    const groupDiv = document.createElement("div");
    groupDiv.appendChild(numberSpan);
    groupDiv.appendChild(nameSpan);

    const expenseSpan = document.createElement("span");
    expenseSpan.className = "expense";
    expenseSpan.textContent = `$${expense.totalExpense}`;

    li.appendChild(groupDiv);
    li.appendChild(expenseSpan);

    leaderList.appendChild(li);
  });
}

function downloadExpense() {
  const token = localStorage.getItem("token");
  fetch("http://localhost:3000/user/download", {
    headers: {
      Authorization: token,
    },
  })
    .then()
    .catch((err) => {
      console.log(err);
    });
}


document.getElementById("logout").addEventListener("click", logout);
function logout(event) {
  localStorage.removeItem("token");
  fetchExpenses();
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token") === null) {
    window.location.href = "../User/login.html";
  }
  fetchExpenses();
});
