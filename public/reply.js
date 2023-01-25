let newReplyElm = document.querySelector('.new-post-container')

newReplyElm.addEventListener('submit', async (e) => {
	e.preventDefault()

	let formData = new FormData(newPostElm)

	let res = await fetch('/replies', {
		method: 'POST',
		body: formData
	})

	if (res.ok) {
		newReplyElm.reset()
	} else {
		console.log('reply fail')
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

function updateReplyContainer(replies) {
	let replyContainerElem = document.querySelector('.reply-container')
	replyContainerElem.innerHTML = ''
	for (let replyItem of replies) {
		replyContainerElem.innerHTML += `
        <div class="reply-wrapper" id="reply_${replyItem.id}">
			<div class="row">
				<span>${replyItem.nickname}</span>
				<span>${replyItem.time}</span>
			</div>
			<div class="row">
				<span>${replyItem.Image}</span>
				<span>${replyItem.content}</span>
			</div>
			<div class="row">
				<span>${replyItem.likes}</span>
				<span>${replyItem.dislikes}</span>
			</div>
        </div>
        `
	}
}