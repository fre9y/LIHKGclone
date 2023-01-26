//testing

//LOGOUT
export async function logout() {
    let res = await fetch('user/logout', {
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
        window.location = "/home.html"
        return
    }
            
}

export async function getOthersByID() {
    let res = await fetch('/user/profile/:id', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        //body: JSON.stringify
    })
    let others = await res.json()
    return others
}

