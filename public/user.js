//testing

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

//PROFILE
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



