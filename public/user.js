import { doxxUser } from './main.js';
//testing

//LOGIN
export async function redirectGoogle() {
    let res = await fetch('/user/profile', {
        method: 'GET'
    })
    if (!res.ok) {
        window.location = "/connect/google"
    } else {
        //window.location = "/userProfile.html"
        return
    }
}

//LOGOUT
export async function logout() {
    let res = await fetch('/user/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!res.ok) {
        alert("[ERR0R: CANT LOGOUT]")
        return
    } else {
        alert("LOGGED OUT")
        window.location = "/"
        return
    }
            
}

export async function loadUserProfileContainer(){
    let res = await fetch('/user/profile', {
        method: 'GET'
    })
    if (res.ok) { 
        //data
        let data = await res.json()
        let profile = data
        console.log(profile);
        let nicknameUserIdElem = document.querySelector(".nickname_user_id")
        let createdAtElem = document.querySelector(".created_at")
        nicknameUserIdElem.innerText = profile.nickname + " #" +  profile.id + " >"

        nicknameUserIdElem.addEventListener('click', async (e) => {
            doxxUser(profile.id)
            document.querySelector('.userProfile').classList.add('d-none');
        })

        let date = profile.created_at.split('T')[0];
        createdAtElem.innerHTML = "註冊日期 " + date
        //show
        document.querySelector('.userProfile').classList.remove('d-none');
    } else { //not logined
        alert("PLEASE LOGIN")
        redirectGoogle();
    }
};

//bookmark posts (star)
export async function addPostBookmark(post_id) {

    let uploadData = {
        id: post_id,
    }

    let res = await fetch('/user/bookmark', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[POST BOOKMARKED]")
    }
}

export async function deletePostBookmark(post_id) {
    let uploadData = {
        id: post_id,
    }

    let res = await fetch('/user/bookmark', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[BOOKMARKED POST DELETED]")
    }
}

//block user
export async function blockUser(blocked_user_id) {

    let uploadData = {
        id: blocked_user_id,
    }

    let res = await fetch('/user/block', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[USER BLOCKED]")
    }
}
//not yet tested no entry button
export async function unblockUser(blocked_user_id) {
    console.log(blocked_user_id);
    let uploadData = {
        id: blocked_user_id,
    }

    let res = await fetch('/user/block', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[BLOCKED USER UNBLOCKED]")
    }
};


//add following users
export async function addFollowingUser(follow_user_id) {
    let uploadData = {
        id: follow_user_id,
    }

    let res = await fetch('/user/following', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[USER FOLLOWED]")
    }
}

//delete following users
export async function deleteFollowingUser(follow_user_id) {
    let uploadData = {
        id: follow_user_id,
    }

    let res = await fetch('/user/following', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[USER UNFOLLOWED]")
    }
}