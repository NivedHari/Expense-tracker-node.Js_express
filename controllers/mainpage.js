const path = require("path");

exports.gethomePage = (request, response, next) => {
  response.sendFile("main.html", { root: "views" });
};

exports.getDashboard = (request, response, next) => {
  const filePath = path.join(__dirname, "..", "public", "expense.html");
  response.sendFile(filePath);
};

exports.getlogin = (request, response, next) => {
  const filePath = path.join(__dirname, "..", "public", "login.html");
  response.sendFile(filePath);
};
exports.getsignup = (request, response, next) => {
  const filePath = path.join(__dirname, "..", "public", "signUp.html");
  response.sendFile(filePath);
};
exports.getForgot = (request, response, next) => {
  const filePath = path.join(__dirname, "..", "public", "forgotPassword.html");
  response.sendFile(filePath);
};

exports.geterrorPage = (request, response, next) => {
  response.sendFile("notFound.html", { root: "views" });
};
