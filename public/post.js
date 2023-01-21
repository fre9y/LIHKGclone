let newPostElm = document.querySelector('.new-post-container')

newPostElm.addEventListener('submit', async (e) => {
	e.preventDefault()

	let formData = new FormData(newPostElm)

	let res = await fetch('/posts', {
		method: 'POST',
		body: formData
	})

	if (res.ok) {
		newPostElm.reset()
        loadPosts()
	} else {
		console.log('post fail')
	}
})

async function loadPosts() {
	let res = await fetch('/posts')
	if (res.ok) {
		let data = await res.json()
		let posts = data.data

		updatePostContainer(posts)
		console.table(posts)
	} else {
		alert('cannot fetch post')
	}
}

function updatePostContainer(posts) {
	let postContainerElem = document.querySelector('.post-container')
	postContainerElem.innerHTML = ''
	for (let postItem of posts) {
		postContainerElem.innerHTML += `
        <div class="post-wrapper" id="post_${postItem.id}">
            <div class="col-10">
                <div class="row">
                    <span>${postItem.nickname}</span>
                    <span>${postItem.time}</span>
                    <span>${postItem.likes}</span>
                </div>
                <div class="row">
                    <span>${postItem.title}</span>
                </div>
            </div>
            <div class="col-2">
                <div class="row">
                    <span>${postItem.numberOfReplies}</span>
                </div>
                <div class="row">
                    <span>${postItem.station}</span>
                </div>
            </div>
        </div>
        `
	}
}

async function updatePost(postId) {
	const options = {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			content: document.querySelector(`#post_${postId} textarea`).value
		})
	}

	let res = await fetch(`http://localhost:8080/posts/${postId}`, options)
	let data = res.json()
	if (res.ok) {
		console.log(data)
		loadPosts()
	} else {
		alert('update fail')
	}
}

async function hidePost(postId) {
	await fetch(`/posts/${postId}`, {
		method: 'PUT'
	})
	loadPosts()
}

async function showPost(postId) {
	await fetch(`/posts/${postId}`, {
		method: 'PUT'
	})
	loadPosts()
}