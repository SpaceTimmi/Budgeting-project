

function darkMode(){
  var body = document.body;
  var innerswitch = document.getElementById("inner-switch");
  if (innerswitch.textContent === "ON"){
    body.classList.remove(
      'dark'
    );
    innerswitch.textContent = "OFF";
    document.getElementsByClassName("entry-container")[0].style.backgroundColor = "white";
  } else{
    body.classList.add(
      'dark'
    );
    innerswitch.textContent = "ON";
    document.getElementsByClassName("entry-container")[0].style.backgroundColor = "#001B48";
  }
}