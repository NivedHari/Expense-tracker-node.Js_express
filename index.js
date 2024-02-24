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

  fetch("http://localhols:3000/user/signup", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
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
      console.log(err);
    });
}
