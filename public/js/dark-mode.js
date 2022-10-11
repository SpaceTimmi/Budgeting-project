function getPreference() {
  // Gets the preference on page load.
  let body = document.body;
  let innerswitch = document.getElementById("inner-switch");
  const pageMode = window.localStorage.getItem('pageMode');
  if (pageMode !== null) {
    changePreference(pageMode);
  } else {
    window.localStorage.setItem('pageMode', innerswitch.textContent);
  }
}

function changePreference(newPreference){
  // Does the actual changing.
  let body = document.body;
  let innerswitch = document.getElementById("inner-switch");
  window.localStorage.setItem('pageMode', newPreference);
  if (newPreference === "OFF"){
    body.classList.remove(
      'dark'
    );
    innerswitch.textContent = "OFF";
    document.getElementsByClassName("container")[0].style.backgroundColor = "white";
  } else if (newPreference === "ON"){
    body.classList.add(
      'dark'
    );
    innerswitch.textContent = "ON";
    document.getElementsByClassName("container")[0].style.backgroundColor = "#001B48";
  }
}

// Calls the changePreference function when dark mode button is clicked with the newPreference parameter.
let switchBTN = document.getElementsByClassName('switch');
switchBTN[0].addEventListener("click", () => {
  const prevPreference = document.getElementById('inner-switch').textContent
  const newPreference = (prevPreference === 'ON') ? 'OFF' : 'ON'  
  changePreference(newPreference);
});

