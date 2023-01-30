//testing

//LOGIN
export async function checkSession() {
    let res = await fetch('/user/profile', {
        method: 'GET'
    })
    if (!res.ok) {
        window.location = "/connect/google"
    } else {
        window.location = "/userProfile.html"
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

<<<<<<< HEAD
//DOXXING
export async function doxx() {}

//BLOCKING
export async function block() {
    
}
=======
>>>>>>> f56a5b3573cdd37f1b5bd69249eac0b522249cc9
