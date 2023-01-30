let changeProfile = document.querySelector(".change-profile")
changeProfile.addEventListener('click', () => {
    window.location = "/changeUserProfile.html"
})

let home = document.querySelector(".home")
home.addEventListener('click', () => {
    window.location = "/"
})


async function loadProfile() {
    let res = await fetch('/user/profile', {
        method: 'GET' 
    })
    if (res.ok) {
        let data = await res.json()
        let profile = data
        //console.log(profile);
        if (!profile.is_admin && profile.show) {
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
        else if (profile.is_admin && profile.show) {
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
            createDate = profile[i].created_at.split('T')[0]
            createTime = profile[i].created_at.split('T')[1].split('.')[0]
            updateDate = profile[i].updated_at.split('T')[0]
            updateTime = profile[i].updated_at.split('T')[1].split('.')[0]
            profileElem.innerHTML += /*html */ `
            <div class= "profile" id = "profile_${profile[i].id}">
                <div name = id>${profile[i].id}|</div>
                ${profile[i].nickname}|
                <div name = email>${profile[i].email}|</div>
                ${profile[i].is_p}|
                ${profile[i].is_admin}|
                ${profile[i].is_male}|
                ${profile[i].show}|     
                ${createDate}_${createTime}|
                ${updateDate}_${updateTime}|

                <button 
                class = "soft-delete-profile"
                onclick = 'deleteUser("${profile[i].id}","${profile[i].email}")'>
                    DELETE
                </button> 

            </div>
            `
            //pass ${profile[i].id and ${profile[i].email} userRoutes.ts
            
        }
    } else {
        alert("[ERR0R: CANT FETCH]")
    }   
}


async function deleteUser(user_id,user_email) {

    let uploadData = {
        id: user_id,
        email: user_email
    }
    console.log(uploadData);
    let res = await fetch('/user/admin', { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })
    

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
        return
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






