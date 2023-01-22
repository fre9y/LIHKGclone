let changeProfile = document.querySelector(".change-profile")
changeProfile.addEventListener('click', () => {
    window.location = "/changeUserProfile.html"
})

let home = document.querySelector(".home")
home.addEventListener('click', () => {
    window.location = "/home.html"
})

// async function checkAdmin() {
//     let res = await fetch('/user/profile', {
//         method: 'GET'
//     })
//     if (res.ok) {
//         let data = await res.json()
//         console.log(data);
//         let profile = data
//         if (!profile.is_admin) {
//             let admin = document.querySelector(".admin")
//             admin.style.display = "none"
//         }0
//     }
// }



// let admin = document.querySelector(".admin")
// admin.addEventListener('click', () => {
//     window.location = "../protected/admin.html"
// })

async function loadProfile() {
    let res = await fetch('/user/profile', {
        method: 'GET' //get body 
    })
    if (res.ok) {
        let data = await res.json()
        let profile = data
        //console.log(profile);
        if (!profile.is_admin) {
            let profileElem = document.querySelector(".profile")
            profileElem.innerHTML = /*html */ `
                <div class= "profile">
                    <div class="profile-nickname">${profile.nickname}</div>
                    <div class ="profile-id">#${profile.id}</div>
                    <div class="profile-email">${profile.email}</div>
                    <div class="profile-created-at">${profile.created_at}</div>
                </div>
                `
            }
        else if (profile.is_admin) {
            loadProfileForAdmin();
        }
    } else {
        alert("[ERR0R: CANT FETCH]")
    }   
}
loadProfile();

async function loadProfileForAdmin() {
	let res = await fetch('/user/admin', {
        method: 'GET' //get body 
    })
    if (res.ok) {
        let data = await res.json()
        let profile = data
        //console.log(profile);
        let profileElem = document.querySelector(".profile")
        profileElem.innerHTML = ''
        for (let i = 0; i < profile.length; i++) {
            profileElem.innerHTML += /*html */ `
            <div class= "profile">
                <div>
                    ${profile[i].id}|
                    ${profile[i].nickname}|
                    ${profile[i].email}|
                    ${profile[i].is_p}|
                    ${profile[i].is_admin}|
                    ${profile[i].is_male}|
                    ${profile[i].show}|     
                    ${profile[i].created_at}|
                    ${profile[i].updated_at}

                </div> 
            </div>
            `
        }
    } else {
        alert("[ERR0R: CANT FETCH]")
    }   
}

// async function loadProfileForNormalUsers() {
//     let profileElem = document.querySelector(".profile")
//     profileElem.innerHTML = /*html */ `
//         <div class= "profile">
//             <div class="profile-nickname">${profile.nickname}</div>
//             <div class ="profile-id">#${profile.id}</div>
//             <div class="profile-email">${profile.email}</div>
//             <div class="profile-created-at">${profile.created_at}</div>
//         </div>
//     `
// }






