
let userName = document.getElementById("userName");
let submitButton = document.getElementById("getStarted");
let email = document.getElementById("userMail");
let password = document.getElementById("userPassword");
let password2 = document.getElementById("userPassword2");
let hideBtn = document.getElementById("hide-btn");


function createUser() {
  //create new user.
  const auth = firebase.auth();
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    let user = userCredential.user;
    console.log(user);
    // ...
  })

  .catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode,errorMessage);
    alert(errorMessage);
  // ..
  });
}

// Checks the user input to make sure it's valid before creating new user. 
function meetsCriteria() {
    if (userName.value.length === 0) {
        alert("Please enter your username!");
    } else if (email.value.length === 0) {
        alert("Please enter your email account!");
    } else if (password.value.length < 8 || password2.value < 8) {
        alert("Passwords must be atleast 8 characters long!");
    } else if (password.value !== password2.value) {
        alert("Both passwords don't match!")
    } else {
        createUser();
    } 
}
submitButton.addEventListener("click", meetsCriteria);

hideBtn.addEventListener("click", () => {
  if (hideBtn.textContent === 'hide') {
    hideBtn.textContent = 'show';
    password.type = "password";
    password2.type = "password";
  } else {
    hideBtn.textContent = 'hide';
    password.type = "text";
    password2.type = "text";
  }
});
