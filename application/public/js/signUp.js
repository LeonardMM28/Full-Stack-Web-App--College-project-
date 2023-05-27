let user = document.getElementsByClassName("usCheck")[0];
let email = document.getElementsByClassName("emCheck")[0];
let pass = document.getElementsByClassName("passCheck")[0];
let pass2 = document.getElementsByClassName("confCheck")[0];
var user1OK = false;
var user2OK = false;
var pass1OK = false;
var pass2OK = false;
var confPassOK = false;

//USERNAME CONDITIONS
document.getElementById("username").addEventListener("focusin", function (ev) {
  user.style.display = "inline";
});

document.addEventListener("focusin", function (ev) {
  if (!ev.target.closest("#username")) {
    user.style.display = "none";
  }
});

document.getElementById("username").addEventListener("input", function (ev) {
  var charsCheck = document.getElementById("usCheck1");
  var firstCheck = document.getElementById("usCheck2");
  var inputElement = document.getElementById("username");
  var regex = /^[a-zA-Z]/;

  if (inputElement.value.length >= 3) {
    charsCheck.style.color = "green";
    user1OK = true;
  } else {
    charsCheck.style.color = "red";
    user1OK = false;
  }

  if (regex.test(inputElement.value)) {
    firstCheck.style.color = "green";
    user2OK = true;
  } else {
    firstCheck.style.color = "red";
    user2OK = false;
  }
});

//PASS CONDITIONS
document.getElementById("password").addEventListener("focusin", function (ev) {
  pass.style.display = "inline";
});

document.addEventListener("focusin", function (ev) {
  if (!ev.target.closest("#password")) {
    pass.style.display = "none";
  }
});

document.getElementById("password").addEventListener("input", function (ev) {
  var charsCheck = document.getElementById("passCheck1");
  var symCheck = document.getElementById("passCheck2");
  var inputElement = document.getElementById("password");
  var regex = /[/*\-+!@#$^&~\[\]]/;

  if (inputElement.value.length >= 8) {
    charsCheck.style.color = "green";
    pass1OK = true;
  } else {
    charsCheck.style.color = "red";
    pass1OK = false;
  }

  if (regex.test(inputElement.value)) {
    symCheck.style.color = "green";
    pass2OK = true;
  } else {
    symCheck.style.color = "red";
    pass2OK = false;
  }
});

//CONFIRM PASS
document.getElementById("password2").addEventListener("focusin", function (ev) {
  pass2.style.display = "inline-flex";
});

document.addEventListener("focusin", function (ev) {
  if (!ev.target.closest("#password2")) {
    pass2.style.display = "none";
  }
});

document.getElementById("password2").addEventListener("input", function (ev) {
  var sameCheck = document.getElementsByClassName("confCheck")[0];
  var inputElement1 = document.getElementById("password");
  var inputElement2 = document.getElementById("password2");

  if (inputElement2.value != inputElement1.value) {
    sameCheck.style.display = "inline-flex";
    confPassOK = false;
  } else {
    sameCheck.style.display = "none";
    confPassOK = true;
  }
});

//CHECK FOR SUBMIT

let form = document.getElementById("fm");
var fiedl1 = document.getElementById("username");
var field2 = document.getElementById("email");
var field3 = document.getElementById("password");
var field4 = document.getElementById("password2");
var field5 = document.getElementById("check");
var field6 = document.getElementById("check2");

var charsCheck = document.getElementById("passCheck1");
var symCheck = document.getElementById("passCheck2");

form.addEventListener("submit", (event) => {
  if (
    fiedl1.value.trim() === "" ||
    field2.value.trim() === "" ||
    field3.value.trim() === "" ||
    field4.value.trim() === ""
  ) {
    event.preventDefault();
    alert("Please fill in the required text field.");
  } else if (user1OK == false || user2OK == false) {
    event.preventDefault();
    alert("Choose a valid username!!");
    field3.value = "";
    field4.value = "";
  } else if (pass1OK == false || pass2OK == false) {
    event.preventDefault();
    alert("Choose a valid password!!");
    field3.value = "";
    field4.value = "";
    charsCheck.style.color = "red";
    symCheck.style.color = "red";
  } else if (confPassOK == false) {
    event.preventDefault();
    alert("Your passwords are different!!");
    field3.value = "";
    field4.value = "";
    charsCheck.style.color = "red";
    symCheck.style.color = "red";
  } 
});


