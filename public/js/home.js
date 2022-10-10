// Getting the cards (container) and the list of cards.
const cards = document.getElementById("cards")
const cardList = document.getElementById("card-list")
let currentDate = new Date()
let currentUser = ""
let prevDate = ""
let d1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
let d2 = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
let filterFrom = d1.toISOString().split('T')[0]
let filterTo = d2.toISOString().split('T')[0]
// start test to list users

let entryDate = document.getElementById("entry-date")
entryDate.valueAsDate = new Date() // creates Date object in local time, set default value
const amount = document.getElementById("amount")
const category = document.getElementById("category")
const description = document.getElementById("description")
const type = document.getElementById("type")
const submitBtn = document.getElementById("add-btn")
let selectedId = ""
fetchEntries()
// firebase.auth().onAuthStateChanged((user) => {
  
  
//   entriesByMonth.on('child_changed', (data) => {
//   })
  
//   entriesByMonth.on('child_removed', (data) => {
//   })
// })
function updateYearMonth() {
  d1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  d2 = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  filterFrom = d1.toISOString().split('T')[0]
  filterTo = d2.toISOString().split('T')[0]
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
  })
  const header = document.getElementById("year-header")
  header.innerText = currentYear
  const month = document.getElementById("month-header")
  month.textContent = currentMonth
}
function fetchEntries() {
  cardList.innerHTML = ""
  prevDate=""
  updateYearMonth()
  firebase.auth().onAuthStateChanged((user) => {
    currentUser = user
    const entriesByMonth = firebase
      .database()
      .ref("budget_entry/" + user.uid)
      .orderByChild("date").startAt(filterFrom).endAt(filterTo)
    entriesByMonth.once("value", (snap) => {
      snap.forEach((child)=>{
        entry = child.val()
        key = child.key
        newEntryCard(entry,key)
      })
    })

    // entriesByMonth.on("child_changed", (snap) => {
    //   entry = snap.val()
    //   key = snap.key
    //   let cardChanged = document.getElementById(key)
    // })
    
  })
}


function newEntryCard(entry,key) {
  let entryCard = document.createElement("li")
  entryCard.setAttribute("id",key)
  const cardID = key
  let dateContainer = document.createElement("div")
  let cardTitle = document.createElement("div")
  const dateTitle = entry.date
  if (prevDate == "" || dateTitle != prevDate) {
    dateContainer = document.createElement("div")
    cardTitle = document.createElement("div")
    cardTitle.innerHTML = `<div class="card-title">${dateTitle}</div>`
    dateContainer.append(cardTitle)
  }
  prevDate = entry.date
  let cardType = entry.type
  let cardCategory = entry.category
  let cardDescription = entry.description
  let cardAmount = entry.amount

  let cardC = document.createElement("div")
  cardC.setAttribute("class", "info-container")
  
  let cardTypeColor = (cardType === "Income") ? "darkgreen" : "#900603"
  cardC.innerHTML = `<div class="edit-and-delete">
                        <i class="icon-fixed-width icon-pencil"></i> 
                        <i class="icon-fixed-width icon-trash"></i>        
                      </div>
                      <p id="category-info">${cardCategory}</p>
                      <p id="type-info">${cardType}</p>
                      <p id="amount-info" style="color: ${cardTypeColor}">${cardAmount}</p>
                      <p id="desc-info">${cardDescription}</p>`

  entryCard.append(cardC)
  // append each entry under their date header
  dateContainer.append(entryCard)
  // append all entries from the given date to the cardlist
  cardList.append(dateContainer)

  // Event listeners
  // Editing a card
  entryCard.querySelector(".icon-pencil").addEventListener("click", () => {
    // Changes the add btn to update btn, opens form and prefill form with inputs to be edited.
    toogleOnUpdateBtn()
    openForm()
    preFillForm(entry)
    selectedId=cardID
    // clearing form if cancel button is clicked.
    document.getElementById("cancel-btn").addEventListener("click", () => {
      toogleOffUpdateBtn()
    })

    // Writing entry to database if add button is clicked.
    document.getElementById("update-btn").addEventListener("click", updateEntry)
  })
  // Deleting a card.
  entryCard.querySelector(".icon-trash").addEventListener("click", () => {
    const cardRef = firebase
      .database()
      .ref(`budget_entry/${currentUser.uid}/${cardID}`)
    deleteCard(cardRef, entryCard)
  })
}
// test
function openForm() {
  document.getElementById("entry-form").style.display = "block"
}

function closeForm() {
  document.getElementById("entry-form").style.display = "none"
}
// Wrting to budget entry

function writeToBudgetEntry(toUpdate = false, entryId = null) {
  // When called this function writes to budget_entry.
  // toUpdate is only true if the function that calles writeToBudget() intends to edit rather than create new.
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {

      // If the caller of this function intends to update entry then the entry id is added to budgetRef.
      let budgetRef = toUpdate
        ? firebase.database().ref(`budget_entry/${user.uid}/${entryId}`)
        : firebase.database().ref(`budget_entry/${user.uid}`)

      if (toUpdate) {
        // Runs if the caller intended to update an entry rather than create a new entry.
        budgetRef.update({
          amount: amount.value,
          category: category.value,
          date: entryDate.value,
          description: description.value,
          type: type.value,
        }).then((error)=>{
          budgetRef.once("value",(data)=>console.log(data.val()))
          fetchEntries()
          document.getElementById("update-btn").removeEventListener("click", updateEntry)
        })
      } else {
        // Runs if the caller intended to create a new entry.
        budgetRef.push().set({
          amount: amount.value,
          category: category.value,
          date: entryDate.value,
          description: description.value,
          type: type.value,
        })
        fetchEntries()
      }
      
    }
  })
}
function updateEntry (e) {
  writeToBudgetEntry(true, selectedId)
  //deleteCard(cardRef, entryCard)
  //fetchEntries()
  toogleOffUpdateBtn()
  closeForm()
}
//Event Listeners.

submitBtn.addEventListener("click", () => {
  // Event listener for the submit button
  // If the submit button is clicked and all inputs have been filled then it submits inputs to firebase.
  if (verifyInputs()) {
    writeToBudgetEntry()
    closeForm()
  } else {
    alert("Please fill the form properly before clicking submit.")
  }
})

document.querySelectorAll(".entryInput").forEach((item) => {
  // Event listner for input tags.
  // If the return/enter (while cursor is on the input) key is pressed and all inputs have been filled then it submits inputs to firebase.
  item.addEventListener("keypress", (event) => {
    if (verifyInputs() && event.which === 13) {
      writeToBudgetEntry()
      closeForm()
    }
  })
})

//Helper function
function deleteCard(ref, card) {
  // ref    -> reference to the entry in the data base (eg. firebase.db().ref.(example/...))
  // card   -> The onScreen card div to be deleted.
  // return type -> Boolean (true if successful else false)
  try {
    card.innerHTML = ""
    ref.remove()
    return true
  } catch {
    return false
  }
}

function preFillForm(entry) {
  // Populates form with inputs to be edited.
  category.value = entry.category
  description.value = entry.description
  amount.value = entry.amount
  type.value = entry.type
  entryDate.value = entry.date
}

function clearForm() {
  // Clears the form inputs.
  category.value = ""
  description.value = ""
  amount.value = ""
  type.value = ""
  entryDate.value = ""
}

function verifyInputs() {
  // Returns true if all inputs have been filled, false otherwise.
  let arr = [amount, category, description, type]
  let check = arr.reduce((acc, input) => {
    return acc && input && input.value
  }, true)
  return check
}

function getYearMonth(date) {
  const year = date.getUTCFullYear()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const month = monthNames[date.getUTCMonth()]
  return year + "/" + month
}

function lastMonth() {
  currentDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1))
  fetchEntries()
}

function nextMonth() {
  currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
  fetchEntries()
}

function lastYear() {
  currentDate = new Date(
    currentDate.setFullYear(currentDate.getFullYear() - 1)
  )
}

function nextYear() {
  currentDate = new Date(
    currentDate.setFullYear(currentDate.getFullYear() + 1)
  )
}

function toogleOnUpdateBtn() {
  // This adds the update button
  document.getElementById("add-btn").style.display = "none"
  document.getElementById("update-btn").style.display = "inline-block"
}

function toogleOffUpdateBtn() {
  // This removes the update button
  document.getElementById("add-btn").style.display = "inline-block"
  document.getElementById("update-btn").style.display = "none"
}
