let el = document.getElementById('login-state');
let content;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        let displayName = (user.displayName!=null?user.displayName:user.email)
        content = `<a href="login.html" class="navText" id="logged-in">Logged in as: <span id="username"style="font-size:12px">${displayName}</span></a>
        <div class="dropdown-content">
            <span class="navText" id="logout-btn">Log out</span>
        </div>`;
    } else {
        content = '<a href="login.html" class="navText" id="logged-out">Login/Sign Up</a>';
        let home = document.getElementById("homepage");
        home.innerHTML=`<h1>Budgeting app</h1><p>Login to get started</p>`;
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