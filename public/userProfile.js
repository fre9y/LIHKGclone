let changeProfile = document.querySelector(".change-profile")
changeProfile.addEventListener('click', () => {
    window.location = "/changeUserProfile.html"
})

let home = document.querySelector(".home")
home.addEventListener('click', () => {
    window.location = "/home.html"
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
            //not working yet*
            profileElem.innerHTML += /*html */ `
            <div class= "profile" id = "profile_${profile[i].id}">
                <div name = id>${profile[i].id}|</div>
                ${profile[i].nickname}|
                <div name = email>${profile[i].email}|</div>
                ${profile[i].is_p}|
                ${profile[i].is_admin}|
                ${profile[i].is_male}|
                ${profile[i].show}|     
                ${profile[i].created_at}|
                ${profile[i].updated_at}

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

//not working yet*
async function deleteUser(user_id,user_email) {


        let uploadData = {
            id: user_id,
            email: user_email
        }
        console.log(uploadData);
        //send
        let res = await fetch('/user/admin', { //problem
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData)
        })
    
        // post handling
        if (!res.ok) {
            alert("[ERR0R: CANT FETCH]")
            return
        }

    }


//1 Click Button
//2 according profile.id soft delete user






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






