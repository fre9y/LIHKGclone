let changeProfile = document.querySelector(".change-profile")
changeProfile.addEventListener('click', () => {
    window.location = "/changeUserProfile.html"
})

let home = document.querySelector(".home")
home.addEventListener('click', () => {
    window.location = "/"
})
//<i class="fas fa-trash-alt"></i>

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
        profileElem.innerHTML += /*html */ `
    <table>
        <tr>
            <div class= "profile" >
                <th name = id class = "id">ID</th>
                <th class = "nickname">Nickname</th>
                <th name = email class = "email">Email</th>
                <th class = "p">P</th>
                <th class = "admin">Adm</th>
                <th class = "gender">Male</th>
                <th class = "show">Show</th>     
                <th class = "date">Create Time</th>
                <th class = "date">Update Time</th>
                <th>DELETE</th>
            </div>
        </tr>   
    </table>    
        `
        for (let i = 0; i < profile.length; i++) {
            createDate = profile[i].created_at.split('T')[0]
            createTime = profile[i].created_at.split('T')[1].split('.')[0]
            updateDate = profile[i].updated_at.split('T')[0]
            updateTime = profile[i].updated_at.split('T')[1].split('.')[0]
            profileElem.innerHTML += /*html */ `

            <table>
            <tr>
    
                <td name = id class = "id">${profile[i].id}</td>
                <td class = "nickname">${profile[i].nickname}</td>
                <td name = email class = "email">${profile[i].email}</td>
                <td class = "p">${profile[i].is_p}</td>
                <td class = "admin">${profile[i].is_admin}</td>
                <td class = "gender">${profile[i].is_male}</td>
                <td class = "show">${profile[i].show}</td>     
                <td class = "date">${createDate}_${createTime}</td>
                <td class = "date">${updateDate}_${updateTime}</td>
                <td>
                    <button 
                    class = "soft-delete-profile"
                    onclick = 'deleteUser("${profile[i].id}","${profile[i].email}")'>
                        DELETE
                    </button> 
                </td>

            </tr>
            </table>
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






