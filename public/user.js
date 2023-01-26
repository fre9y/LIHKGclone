//testing
//let logout = document.querySelector('.logout');
// let logout = document.querySelector('.create_post_btn');
// logout.addEventListener('click', () => {
//     logout();
// })

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

