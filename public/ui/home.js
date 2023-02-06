import { redirectGoogle } from "../user.js";
//login
let loginButton = document.querySelector(".signUp_btn")
loginButton.addEventListener('click', () => {
    console.log('click_login');
    redirectGoogle();
});

//logout
let logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
    console.log('click_logout');
    document.querySelector('.userProfile').classList.add('d-none');
    logout();

});
//change profile
let changeProfileButton = document.querySelector('.change_profile');
changeProfileButton.addEventListener('click', () => {
    console.log('click_change-profile');
    window.location = "/userProfile.html"
});

//read blocked list
let readBlockedListButton = document.querySelector('.blocked_list');
let leaveBlockedListButton = document.querySelector('.leave_blocked_list');
readBlockedListButton.addEventListener('click', () => {
    console.log('click_blocked-list');
    document.querySelector('.blocked_list_container').classList.remove('d-none');
    document.querySelector('.userProfile').classList.add('d-none');
    showBlockedList()
});

leaveBlockedListButton.addEventListener('click', () => {
    console.log('click_leave-blocked-list');
    document.querySelector('.blocked_list_container').classList.add('d-none');

});

// refresh_btn
const refreshBtns = document.querySelectorAll('.refresh_btn');
for (let refreshBtn of refreshBtns) {
    refreshBtn.addEventListener('click', () => {
        location.reload();
        document.querySelector('.post_replies').classList.remove('d-none');
    })
}
