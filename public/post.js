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
	let postContainerElem = document.querySelector('.post_template')
	postContainerElem.innerHTML = ''
	for (let postItem of posts) {
		postContainerElem.innerHTML += `
			<a class="post d-none1 col-12 row g-0 d-flex justify-content-end" href="#" id="post_${postItem.id}">
				<span class="lightning_icon col-1 d-flex justify-content-center pt-2 pb-1 ps-2">
					<i class="fa-solid fa-bolt pt-2 pe-2 color_yellow"></i>
				</span></span>

				<span class="col-9 d-flex justify-content-start pt-2 pb-1">
					<span class="post_host color_white px-1">${postItem.nickname}</span>
					<span class="isP px-1 position-relative"><i class="fa-solid fa-square"></i><span
							class="position-absolute">P</span></span>
					<span class="post_created_time color_white px-1">${postItem.updated_at}</span>
					<span class="like color_white px-1">${postItem.likes}</span>
				</span>

				<span class="col-2 d-flex justify-content-center position-relative pt-2 pb-1">
					<form class="select">
						<select>
							<option value="1"> 1 頁</option>
							<option value="2"> 2 頁</option>
							<option value="3"> 3 頁</option>
						</select><!--opacity:0-->
					</form>
					<span class="select_cover col-2 position-absolute start-0">
						<button class="post_pages_btn d-flex justify-content-evenly">
							<span class="post_pages">1</span> 頁</button>
					</span>
				</span>

				<!--second-line-->
				<span class="visited col-1 d-flex justify-content-center pt-1">
					<i class="fa-solid fa-circle color_white"></i>
				</span>

				<span class="post_title col-9 color_white pb-2">${postItem.post_title}</span>

				<span class="post_stations_btn col-2">
					<span href="#" class="post_station d-flex justify-content-center">
						${postItem.station_name}
					</span>
				</span>
			</a>
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