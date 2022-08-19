let el = document.getElementById('login-state');
let content;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        content = `<a href="login.html" class="navText">Logged in as: <span style="font-size:12px">${user.email}</span></a>
        <div class="dropdown-content">
            <span class="navText" id="logout-btn">Log out</span>
        </div>`;
    } else {
        content = '<a href="login.html" class="navText">Login/Sign Up</a>';
        // User is signed out.
        // ...
    }
    el.insertAdjacentHTML('afterbegin', content);
});

// Sign out
document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'logout-btn'){
        firebase.auth().signOut().then(() => {
            window.location.reload();
            window.location.href = './login.html';
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
     }
 });