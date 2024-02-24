const form = document.querySelector(".form-control");

form.addEventListener("submit", addUser);

function addUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = {
    name,
    email,
    password,
  };

  fetch("http://localhost:3000/user/signUp", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(user)
})
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      form.reset(); 
    })
    .catch((err) => {
      if (err.message === "Email already exists") {
        console.log("Email already exists");
      } else {
        console.error("Error:", err);
      }
    });
}
