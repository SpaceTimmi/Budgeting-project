let submitButton = document.getElementById("getStarted");
let email = document.getElementById("email");
let password = document.getElementById("password");
let hideBtn = document.getElementById("hide-btn");


function signIn() {
  if (fieldsNotEmpty() == false){
    alert("email or password empty!");
  }
  console.log(email.value,password.value);
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
    // Signed in
    let user = userCredential.user;
    console.log(user);
    // ...
  })
  .catch((error) => {
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    alert(errorMessage);
});
}

function signInAfterKeypress(event){
  if (fieldsNotEmpty() && event.which === 13){
    signIn();
  }
}

function fieldsNotEmpty() {
  if (email.value.length == 0 || password.value.length == 0){
    return false;
  }
  return true;
}


submitButton.addEventListener("click",signIn);
password.addEventListener("keypress", signInAfterKeypress);
hideBtn.addEventListener("click", () => {
  if (hideBtn.textContent === 'hide') {
    hideBtn.textContent = 'show';
    password.type = "password";
  } else {
    hideBtn.textContent = 'hide';
    password.type = "text";
  }
});
