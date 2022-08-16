let enterButton = document.getElementById("enter");
let input = document.getElementById("userInput");
let ul = document.querySelector("ul");
let item = document.getElementsByTagName("li");
const firebaseConfig = {
  apiKey: "AIzaSyCvBCntJmyFl_tMVG8-qc_DtHYRHuS614Q",
  authDomain: "budgeting-project-d8c3a.firebaseapp.com",
  projectId: "budgeting-project-d8c3a",
  storageBucket: "budgeting-project-d8c3a.appspot.com",
  messagingSenderId: "663497749464",
  appId: "1:663497749464:web:a299aa8454f988635eb8ad",
  databaseURL: "https://budgeting-project-d8c3a-default-rtdb.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();
const usersRef = dbRef.child("users");

// start test to list users
const userListUI = document.getElementById("userList");
usersRef.on("child_added", (snap) => {
  let user = snap.val();
  let $li = document.createElement("li");
  $li.innerHTML = user.name;
  $li.setAttribute("child-key", snap.key);
  $li.addEventListener("click", userClicked);
  userListUI.append($li);
});
function userClicked(e) {
  var userID = e.target.getAttribute("child-key");
  const userRef = dbRef.child("users/" + userID);
  const userDetailUI = document.getElementById("userDetail");
  userDetailUI.innerHTML = "";
  userRef.on("child_added", (snap) => {
    var $p = document.createElement("p");
    $p.innerHTML = snap.key + " - " + snap.val();
    userDetailUI.append($p);
  });
}
// end test to list user

function createListElement() {
  let li = document.createElement("li"); // creates an element "li"
  li.appendChild(document.createTextNode(input.value)); //makes text from input field the li text
  ul.appendChild(li); //adds li to ul
  input.value = ""; //Reset text input field
}

function addListAfterClick() {
  if (inputLength() > 0) {
    //makes sure that an empty input field doesn't create a li
    createListElement();
  }
}

function addListAfterKeypress(event) {
  if (inputLength() > 0 && event.which === 13) {
    //this now looks to see if you hit "enter"/"return"
    //the 13 is the enter key's keycode, this could also be display by event.keyCode === 13
    createListElement();
  }
}

enterButton.addEventListener("click", addListAfterClick);

input.addEventListener("keypress", addListAfterKeypress);
