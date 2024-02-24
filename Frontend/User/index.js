const form = document.querySelector(".form-control");

form.addEventListener("submit", addUser);

function addUser(event) {
  event.preventDefault();

  const mode = document.getElementById("mode").value;

  if (mode === "signUp") {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
      name,
      email,
      password,
    };

    fetch("http://localhost:3000/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            alert("Email Already Exists");
          }
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        form.reset();
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  } else {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
      email,
      password,
    };

    fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.ok) {
          alert("Login Successful");
        } if(!response.ok) {
          alert("Login Unsuccessful");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
}
