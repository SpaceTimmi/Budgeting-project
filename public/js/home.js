let enterButton = document.getElementById("enter");
let input = document.getElementById("userInput");
let ul = document.querySelector("ul");
let item = document.getElementsByTagName("li");

const dbRef = firebase.database().ref();
const usersRef = dbRef.child("users");

// sample write data
// start test to list users
const userListUI = document.getElementById("userList");
usersRef.on("child_added", (snap) => {
  let user = snap.val();
  let $li = document.createElement("li");
  $li.innerHTML = user.displayName;
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

// start test write to db
function writeToDb() {
  let today = new Date();
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user)
      let entryRef = firebase.database().ref('sample_entry/' + user.uid);
      entryRef.push().set({ // entryRef.push() generates a new unique ID for each new entry
        user: user.displayName,
        date: today.toISOString(),
        description: input.value,
      });
      
      input.value = ""; //Reset text input field
    }
  })
}
// end test write to db
function inputLength(){
	return input.value.length;
}
function addListAfterClick() {
  if (inputLength() > 0) {
    //makes sure that an empty input field doesn't create a li
    writeToDb();
  }
}

function addListAfterKeypress(event) {
  if (inputLength() > 0 && event.which === 13) {
    //this now looks to see if you hit "enter"/"return"
    //the 13 is the enter key's keycode, this could also be display by event.keyCode === 13
    writeToDb();
  }
}

enterButton.addEventListener("click", addListAfterClick);

input.addEventListener("keypress", addListAfterKeypress);
