let userName = document.getElementById("userName");
let submitButton = document.getElementById("getStarted");
let email = document.getElementById("userMail");
let password = document.getElementById("userPassword");
let password2 = document.getElementById("userPassword2");
let hideBtn = document.getElementById("hide-btn");

function createUser() {
  //create new user.
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then((userCredential) => {
    // Signed in
    let user =userCredential.user;
    // set username for firebase auth
    user.updateProfile({
      displayName: userName.value
    }).then(() => {
      // Update successful
      // ...
      
      window.location.href="./home.html";
      console.log(user);
    });
    // create user in database
    firebase.database().ref("users/" + user.uid).set({
      email: user.email,
      uid: user.uid,
      displayName: userName.value,
    });
    }).catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(error)
      // ..
    });
}

// Checks the user input to make sure it's valid before creating new user.
function meetsCriteria() {
  if (userName.value.length === 0) {
    alert("Please enter your username!");
  } else if (!validateMail(email.value)) {
    alert("Please enter a valid email account!");
  } else if (password.value.length < 8 || password2.value < 8) {
    alert("Passwords must be atleast 8 characters long!");
  } else if (password.value !== password2.value) {
    alert("Both passwords don't match!");
  } else {
    createUser();
  }
}

function validateMail(mail) {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (mail.match(mailFormat)) {
    return true;
  }
  return false;
}

submitButton.addEventListener("click", meetsCriteria);

hideBtn.addEventListener("click", () => {
  console.log("????")
  if (hideBtn.textContent === "hide") {
    hideBtn.textContent = "show";
    password.type = "password";
    password2.type = "password";
  } else {
    hideBtn.textContent = "hide";
    password.type = "text";
    password2.type = "text";
  }
});
