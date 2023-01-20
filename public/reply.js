let newReplyElm = document.querySelector('.new-post-container')

newReplyElm.addEventListener('submit', async (e) => {
	e.preventDefault()

	let formData = new FormData(newPostElm)

	let res = await fetch('/posts', {
		method: 'POST',
		body: formData
	})

	if (res.ok) {
		newReplyElm.reset()
	} else {
		console.log('post fail')
	}
})

async function loadReplies() {
	let res = await fetch('/Replies')
	if (res.ok) {
		let data = await res.json()
		let Replies = data.data

		updateReplyContainer(Replies)
		console.table(Replies)
	} else {
		alert('cannot fetch Replies')
	}
}