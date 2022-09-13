// Getting the cards (container) and the list of cards.
const cards = document.getElementById("cards");
const cardList = document.getElementById("card-list");

// start test to list users
firebase.auth().onAuthStateChanged((user) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const entriesRef = firebase
    .database()
    .ref("budget_entry/" + user.uid + "/" + currentYear); // gets all entries for the current year
  // first look into all the entries in the current year created by logged in user
  // to implement: navigate to last year, next year, etc.
  entriesRef.get().then((snap) => {
    const header = document.getElementById("year-header");
    header.innerText = snap.key;
    // then look into entries in current month
    // to implement: navigate to last month, next month, etc.
    const entriesByMonth = firebase
      .database()
      .ref("budget_entry/" + user.uid + "/" + currentYear + "/" + currentMonth);
    entriesByMonth.on("child_added", (snap) => {
      const month = document.getElementById("month-header");
      month.textContent = currentMonth;
      const currentDate = snap.key;
      let dateCard = document.createElement("div");
      dateCard.setAttribute("class", "info-container");
      let cardTitle = document.createElement("div");
      cardTitle.innerHTML = `<div class="card-title">${currentDate}</div>`;
      dateCard.append(cardTitle);
      const entriesByDate = firebase.database().ref("budget_entry/" + user.uid + "/" + currentYear + "/" + currentMonth + "/" + snap.key);
      entriesByDate.on("child_added", (snap) => {
        let entry = snap.val();
        console.log(entry);
        /* Testing */

        let cardElement = document.createElement("li");

        let cardType = entry.type;
        let cardCategory = entry.category;
        let cardDescription = entry.description;
        let cardAmount = entry.amount;

        let cardC = `<div class="inner-info">
                        <p id="info">Type: ${cardType}</p>
                        <p id="info">Category: ${cardCategory}</p>
                        <p id="info">Amount: ${cardAmount}</p>
                        <p id="info"> Description: ${cardDescription}</p>
                      </div>`;
        cardElement.innerHTML = cardC;
        dateCard.append(cardElement);
        cardList.append(dateCard);

        /* Testing */
      });
    });
  });
});

function openForm() {
  document.getElementById("entry-form").style.display = "block";
}

function closeForm() {
  document.getElementById("entry-form").style.display = "none";
}
// Wrting to budget entry
// Getting Inputs

const entryDate = document.getElementById("entry-date");
entryDate.valueAsDate = new Date(new Date().toLocaleDateString()); // creates Date object in local time, set default value

const amount = document.getElementById("amount");
const category = document.getElementById("category");
const description = document.getElementById("description");
const type = document.getElementById("type");
const submitBtn = document.getElementById("add-btn");

function writeToBudgetEntry() {
  // When called this function writes to budget_entry.

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const yearMonth = getYearMonth(entryDate.value); // such as "2022/Sep"
      let budgetRef = firebase
        .database()
        .ref(
          "budget_entry/" + user.uid + "/" + yearMonth + "/" + entryDate.value
        );
      budgetRef.push().set({
        amount: amount.value,
        category: category.value,
        date: entryDate.value,
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
    alert("Please fill the form properly before clicking submit.");
  }
});

document.querySelectorAll(".entryInput").forEach((item) => {
  // Event listner for input tags.
  // If the return/enter (while cursor is on the input) key is pressed and all inputs have been filled then it submits inputs to firebase.
  item.addEventListener("keypress", (event) => {
    if (verifyInputs() && event.which === 13) {
      writeToBudgetEntry();
    }
  });
});

//Helper function
function verifyInputs() {
  // Returns true if all inputs have been filled, false otherwise.
  let arr = [amount, category, description, type];
  let check = arr.reduce((acc, input) => {
    return acc && input && input.value;
  }, true);
  return check;
}

function getYearMonth(date) {
  const year = new Date(date).getFullYear();
  const month = new Date(date).toLocaleString("default", { month: "long" });
  return year + "/" + month;
}
