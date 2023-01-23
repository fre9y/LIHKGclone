function genderToBoolean(gender) {
    if (gender === "male") {
        return true
    } else {
        return false
    }
}

let updateProfileElem = document.querySelector(".update-profile")
console.log(updateProfileElem);

updateProfileElem.addEventListener('submit', async (e) => {
    console.log('123');
	e.preventDefault()
    //prep
    let uploadData = {
		nickname: updateProfileElem.nickname.value,
		gender: genderToBoolean(updateProfileElem.gender.value)
	}
    console.log(uploadData);
    //send
    let res = await fetch('/user/profile', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(uploadData)
	})

    // post handling
	if (!res.ok) {
		return
	}
	window.location = "/home.html"
})



