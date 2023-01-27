let newReplyElm = document.querySelector('.new-reply-container')

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
	let res = await fetch('/replies')
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
	let replyContainerElem = document.querySelector('.replies-container')
	replyContainerElem.innerHTML = ''
	for (let replyItem of replies) {
		replyContainerElem.innerHTML += /*html */ `
		<div class="reply py-3 my-2"  id="reply_${replyItem.id}">
			<div class="reply_first_row d-flex justify-content-between">
				<span class="px-3">
					<span class="px-1"># <span class="reply_num">1</span></span>

					<span class="user_nickname px-1">${replyItem.nickname}</span>

					<span class="reply_created_time px-1">${replyItem.updated_at}</span>

					<span class="block_replies_btn px-1">
						<i class="fa-solid fa-eye"></i>
					</span>

					<span class="reply_btn px-1">
						<i class="fa-solid fa-reply"></i>
					</span>
				</span>

				<span class="px-3">
					<span class="share_btn px-2">
						<i class="fa-solid fa-share-nodes"></i>
					</span>

					<span class="more_btn px-2">
						<i class="fa-solid fa-ellipsis"></i>
					</span>
				</span>
			</div>

			<div class="reply_second_row px-4 py-3">
				${replyItem.content}
			</div>

			<div class="reply_third_row px-4">
				<div class="reply_like_section d-flex justify-content-around align-items-center">
					<span class="like_btn">
						<button>
							<i class="fa-solid fa-thumbs-up"></i>
						</button>
						<span class="reply_like">${replyItem.likes}</span>
					</span>

					<span class="dislike_btn pe-1">
						<button>
							<i class="fa-solid fa-thumbs-down"></i>
						</button>
						<span class="reply_dislike">${replyItem.dislikes}</span>
					</span>
				</div>
			</div>
		</div>
        `
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