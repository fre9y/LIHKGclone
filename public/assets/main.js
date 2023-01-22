let profileIcon = document.querySelector(".profile")

async function checkSession() {
    let res = await fetch('/user/profile', {
        method: 'GET'
    })
    if (!res.ok) {
        window.location = "/connect/google"
    } else {
        window.location = "/userProfile.html"
    }
}

profileIcon.addEventListener('click', () => {
    checkSession();
})
