// Getting the cards (container) and the list of cards.
const cards = document.getElementById("cards");
const cardList = document.getElementById("card-list");
let currentDate = new Date();
// start test to list users
fetchEntries();

function fetchEntries(){
  
  cardList.innerHTML = "";
  firebase.auth().onAuthStateChanged((user) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });
    const entriesRef = firebase.database().ref("budget_entry/" + user.uid + "/" + currentYear); // gets all entries for the current year
    // first look into all the entries in the current year created by logged in user
    // to implement: navigate to last year, next year, etc.
    entriesRef.get().then((snap) => {
      const header = document.getElementById("year-header");
      header.innerText = snap.key;
      // then look into entries in current month
      // to implement: navigate to last month, next month, etc.
      const entriesByMonth = firebase.database().ref("budget_entry/" + user.uid + "/" + currentYear + "/" + currentMonth);
        const month = document.getElementById("month-header");
        month.textContent = currentMonth;
        let prevDate = ""
        let dateContainer = document.createElement("div");
        let cardTitle = document.createElement("div");
      entriesByMonth.on('child_added',(snap)=>{
        let entry = snap.val();
        const dateTitle = entry.date;
        if (prevDate==""||dateTitle!=prevDate){
          dateContainer = document.createElement("div");
          cardTitle = document.createElement("div");
          cardTitle.innerHTML = `<div class="card-title">${dateTitle}</div>`;
          dateContainer.append(cardTitle);
        }
        prevDate = entry.date;

        let entryCard = document.createElement("li");

        let cardType = entry.type;
        let cardCategory = entry.category;
        let cardDescription = entry.description;
        let cardAmount = entry.amount;
        
        let cardC = document.createElement("div");
        cardC.setAttribute('class','info-container');

        if (cardType==="Income"){
          cardC.innerHTML=`<p id="category-info">${cardCategory}</p>
                        <p id="type-info">${cardType}</p>
                        <p id="amount-info" style="color: darkgreen">$${cardAmount}</p>
                        <p id="desc-info">${cardDescription}</p>`;
        }
        else {
          cardC.innerHTML=`<p id="category-info">${cardCategory}</p>
                        <p id="type-info">${cardType}</p>
                        <p id="amount-info" style="color: #900603">$${cardAmount}</p>
                        <p id="desc-info">${cardDescription}</p>`;
        }
        
        
        entryCard.append(cardC);
        // append each entry under their date header
        dateContainer.append(entryCard);
        // append all entries from the given date to the cardlist
        cardList.append(dateContainer);
        if (cardType === 'Income') {
          document.getElementById("amount-info").style.color="#900603";
        }
        else{
          document.getElementById("amount-info").style.color="darkgreen";
        }
        /* Testing */
      })
        
    });
  });
}

// test
function openForm() {
  document.getElementById("entry-form").style.display = "block";
}

function closeForm() {
  document.getElementById("entry-form").style.display = "none";
}
// Wrting to budget entry
// Getting Inputs

const entryDate = document.getElementById("entry-date");
entryDate.valueAsDate = new Date(); // creates Date object in local time, set default value
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const description = document.getElementById("description");
const type = document.getElementById("type");
const submitBtn = document.getElementById("add-btn");

function writeToBudgetEntry() {
  // When called this function writes to budget_entry.

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const yearMonth = getYearMonth(entryDate.valueAsDate); // such as "2022/Sep"
      let budgetRef = firebase
        .database()
        .ref(
          "budget_entry/" + user.uid + "/" + yearMonth
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
      closeForm();
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
  const year = date.getUTCFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[date.getUTCMonth()];
  return year + "/" + month;
}

function lastMonth(){
  currentDate = new Date(currentDate.setMonth(currentDate.getMonth()-1));
  fetchEntries();
}

function nextMonth(){
  currentDate = new Date(currentDate.setMonth(currentDate.getMonth()+1));
  fetchEntries();
}

function lastYear(){
  currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear()-1));
  fetchEntries();
}

function nextYear(){
  currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear()+1));
  fetchEntries();
}