let changeProfileIcon = document.querySelector(".change-profile")

changeProfileIcon.addEventListener('click', () => {
    console.log('456');
    window.location = "/changeProfile.html"
})

async function loadProfile() {
    let res = await fetch('/user/profile', {
        method: 'GET' //get body 
    })
    if (res.ok) {
        let data = await res.json()
        let profile = data
        console.log(profile);
        let profileElem = document.querySelector(".profile")
        profileElem.innerHTML = `
            <div class= "profile">
                <div class="profile-nickname">${profile.nickname}</div>
                <div class="profile-id">${profile.id}</div>
                <div class="profile-email">${profile.email}</div>
                <div class="profile-created-at">${profile.created_at}</div>
            </div>
        `
    } else {
        alert("[ERR0R: CANT FETCH]")
    }   
}
loadProfile();

