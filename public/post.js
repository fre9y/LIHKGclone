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
            <div class="post-wrapper-inner">
                <div class='post'>${postItem.content}
                </div>
            </div>
        </div>
        `
	}
}