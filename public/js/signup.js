
let userName = document.getElementById("userName");
let submitButton = document.getElementById("getStarted");
let email = document.getElementById("userMail");
let password = document.getElementById("userPassword");



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
    } else if (password.value.length < 8) {
        alert("Passwords must be atleast 8 characters long!");
    } else {
        createUser();
    } 
}
submitButton.addEventListener("click", meetsCriteria);
