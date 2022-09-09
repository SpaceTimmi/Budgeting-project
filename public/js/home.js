/*

let enterButton = document.getElementById("enter");
let input = document.getElementById("userInput");
let ul = document.querySelector("ul");
let item = document.getElementsByTagName("li");

const dbRef = firebase.database().ref();
const usersRef = dbRef.child("users");

// sample write data


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
*/

/*======================================================*/
// start test to list users
firebase.auth().onAuthStateChanged((user) => {
  const entriesRef = firebase.database().ref("budget_entry/"+user.uid);
  console.log(entriesRef)
  entriesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    
  });
  const entryListUI = document.getElementById("entryList");
  entriesRef.on("child_added", snap => {
    let entry = snap.val();
    let $entrycard = document.createElement("div");
    var date = new Date(entry.date);
    $entrycard.innerHTML = date.toLocaleDateString();
    $entrycard.setAttribute("child-key", snap.key);
    $entrycard.setAttribute('class', 'card');
    // $li.addEventListener("click", entryClicked) 
    entryListUI.append($div);
});
  // entriesRef.get().then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });
  // console.log(entriesRef);
  // const entryListUI = document.getElementById("entryList");
  // console.log(entryListUI)
  // entriesRef.on("child_added", (snap) => {
  //   let entry = snap.val();
  //   let $li = document.createElement("li");
  //   $li.innerHTML = entry.displayName;
  //   $li.setAttribute("child-key", snap.key);
  //   entryListUI.append($li);
  // });
})



// function userClicked(e) {
//   var userID = e.target.getAttribute("child-key");
//   const userRef = dbRef.child("users/" + userID);
//   const userDetailUI = document.getElementById("userDetail");
//   userDetailUI.innerHTML = "";
//   userRef.on("child_added", (snap) => {
//     var $p = document.createElement("p");
//     $p.innerHTML = snap.key + " - " + snap.val();
//     userDetailUI.append($p);
//   });
// }
// end test to list user

function openForm() {
  document.getElementById("entry-form").style.display = "block";
}

function closeForm() {
  document.getElementById("entry-form").style.display = "none";
}
// Wrting to budget entry 
// Getting Inputs
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const description = document.getElementById("description");
const type = document.getElementById("type");
const submitBtn = document.getElementById("add-btn");

function writeToBudgetEntry() {
  // When called this function writes to budget_entry.
  let today = new Date();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let budgetRef = firebase.database().ref("budget_entry/" + user.uid);
      budgetRef.push().set({
        amount: amount.value,
        category: category.value,
        date: today.toISOString(),
        description: description.value,
        type: type.value,
      });
      // Reset input tags
      amount.value = "";
      category.value = "";
      description.value = "";
      type.value = "";  
    } 
  });

}

//Event Listeners.

submitBtn.addEventListener("click", () => {
  // Event listener for the submit button 
  // If the submit button is clicked and all inputs have been filled then it submits inputs to firebase.
  if (verifyInputs()) {
    writeToBudgetEntry();
  } else {
    alert("Please fill the form properly before clicking submit.")
  }
});

document.querySelectorAll(".entryInput").forEach(item => {
  // Event listner for input tags. 
  // If the return/enter (while cursor is on the input) key is pressed and all inputs have been filled then it submits inputs to firebase.
  item.addEventListener("keypress", (event) => {
    if(verifyInputs() && event.which === 13) {
      writeToBudgetEntry();
    }
  });
})


//Helper function
function verifyInputs() {
  // Returns true if all inputs have been filled, false otherwise.
  let arr = [amount, category, description, type];
  let check = arr.reduce((acc, input) => {
      return acc && (input && input.value);
  }, true);
  return check 
}
