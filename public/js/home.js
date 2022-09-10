// Getting the cards (container) and the list of cards.
const cards = document.getElementById("cards");
const cardList = document.getElementById("card-list");

// start test to list users
firebase.auth().onAuthStateChanged((user) => {
  const entriesRef = firebase.database().ref("budget_entry/"+user.uid);
  console.log(entriesRef)
  const entryListUI = document.getElementById("entryList");
  entriesRef.on("child_added", snap => {
    let entry = snap.val();
    let $entrycard = document.createElement("div");
    var date = new Date(entry.date);
    $entrycard.innerHTML = date.toLocaleDateString() + " " + entry.type + " category: " + entry.category + " desc: " + entry.description + " amount: " + entry.amount;
    $entrycard.setAttribute("child-key", snap.key);
    
    $entrycard.addEventListener("click", entryClicked) 
    entryListUI.append($entrycard);

    /* Testing */
    
    let cardElement = document.createElement("li");
    
    let cardDate = date.toLocaleDateString();
    let cardType =  entry.type; 
    let cardCategory = entry.category
    let cardDescription = entry.description
    let cardAmount = entry.amount;

    let cardC = `<div class="info-container">
                    <p id="info">Due date: ${cardDate}</p>
                    <p id="info">Type: ${cardType}</p>
                    <p id="info">Category: ${cardCategory}</p>
                    <p id="info">Amout: ${cardAmount}</p>
                    <p id="info"> Description: ${cardDescription}</p>
                  </div>`
    cardElement.innerHTML = cardC;
    cardList.append(cardElement);
    
    /* Testing */
});

function entryClicked(e) {
  var entryId = e.target.getAttribute("child-key");
  const entryRef = entriesRef.child(entryId);
  const $entryDesc = document.createElement("div");
  userDetailUI.innerHTML = "";
  userRef.on("child_added", (snap) => {
    var $p = document.createElement("p");
    $p.innerHTML = snap.key + " - " + snap.val();
    userDetailUI.append($p);
  });
}
})


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
    closeForm();
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
