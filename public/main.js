import { redirectGoogle, loadUserProfileContainer, addPostBookmark, deletePostBookmark, blockUser, unblockUser, addFollowingUser, deleteFollowingUser } from './user.js';
import { logout, showBlockedList } from './api/userfetch-api.js';
import { goToStation, goToHitStation } from './api/station-api.js'
// import { goToStation } from './ui/station-ui.js';
import { setPostsOfUser, hidePostContainer } from './ui/post-ui.js';
import { getPageName } from "./ui/util.js";
import { starClick, listAllStations } from './ui/station-ui.js';
import { setTabButtons } from "./ui/post-ui.js";

window.addEventListener('load', async () => {
    //image
    const image = document.querySelector('.imgBtn');
    const leaveImg = document.querySelector('.leave_btn');
    const imgWall = document.querySelector('.img_wall');

    image.addEventListener('click', () => {
        imgWall.classList.remove("d-none");
    })

    leaveImg.addEventListener('click', () => {
        imgWall.classList.add('d-none');
    })


    const cloneNode = document.querySelector(".left_side .second_row_div");
    const leftSideClone = cloneNode.cloneNode(true);

    document.querySelector(".mobile_vision").appendChild(leftSideClone);

    const arr = window.location.pathname.split("/"); //stations/38
    for (let i = 0; i < arr.length; i++) {
        const word = arr[i].toLowerCase();
        if (word == "stations") {
            if (i + 1 < arr.length) {
                const stationId = arr[i + 1];
                await goToStation(stationId);
                await setTabButtons(stationId);
                document.querySelector('.post_replies').classList.add('d-none');
            }
            break;
        }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    starClick(postId)
    const hash = window.location.hash
    if (hash) {
        const elem = document.querySelector(hash)
        console.log(elem)
        elem.scrollIntoView(true)
    }
    listAllStations()
})


//replies
const userDetail = document.querySelector('.user_nickname_btn');
const userDetailContent = document.querySelector('.userDetail')
userDetail.addEventListener('click', () => {
    userDetailContent.classList.remove("d-none");
})

const leaveUserDetail = document.querySelector('.leave_userDetail_btn');
leaveUserDetail.addEventListener('click', () => {
    userDetailContent.classList.add("d-none");
})

// Create Post
const createPost = document.querySelector('.create_post_btn');
const createPostContainer = document.querySelector('.createPostContainer')
createPost.addEventListener('click', () => {
    createPostContainer.classList.remove("d-none");
})

const leaveCreatePost = document.querySelector('.leave_createPost_btn');
leaveCreatePost.addEventListener('click', () => {
    createPostContainer.classList.add("d-none");
    document.querySelector('.createPostForm').reset()
})

let createPostSubmit = document.querySelector('.createPostSubmit')

createPostSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    let createPostForm = document.querySelector('.createPostForm');

    if (createPostForm.postTitle.value === '') {
        alert("No Title")
        return
    }
    if ((createPostForm.content.value === '') && (createPostForm.image.value === '')) {
        alert("No Content")
        return
    }

    const newText = createPostForm.content.value.replace(/\r?\n/g, '<br />')
    createPostForm.content.value = newText

    let formData = new FormData(createPostForm)
    let res = await fetch('/posts', {
        method: 'POST',
        body: formData
    })

    const result = await res.json()
    const { message, data } = result;
    if (message === "add post success") {
        console.log(message)
    } else {
        alert(["Please Login"])
        return
    }
    createPostContainer.classList.add("d-none");

    let selectStationId = document.getElementById("selectStation").value
    const urlParams = new URLSearchParams();
    urlParams.set("postId", data);
    window.history.pushState({}, '', '/stations/' + selectStationId + `?${urlParams.toString()}`);

    goToStation(Number(selectStationId))
    goToPost(Number(data), 1)
    document.querySelector('.createPostForm').reset()
    document.querySelector('.home_page_cover').classList.add("d-none")
})

//userProfile
function profileClick() {
    //click profile icon (open)
    const showProfile = document.querySelector('.btn_bar .profile');
    showProfile.addEventListener('click', () => {
        loadUserProfileContainer()
    })
    //click leave profile icon (close)
    const leaveProfile = document.querySelector('.leave_profile');
    leaveProfile.addEventListener('click', () => {
        document.querySelector('.userProfile').classList.add('d-none');
    })
}
profileClick();



// Create Reply
const createReply = document.querySelector('.reply_btn');
const createReplyContainer = document.querySelector('.createReplyContainer')
createReply.addEventListener('click', () => {
    let postTitle = document.getElementById("replyPostTitle")

    let replyFormTitle = document.querySelector('.replyFormTitle')
    replyFormTitle.innerText = '回覆：' + postTitle.innerHTML
    createReplyContainer.classList.remove("d-none");
})

const leaveCreateReply = document.querySelector('.leave_createReply_btn');
leaveCreateReply.addEventListener('click', () => {
    createReplyContainer.classList.add("d-none");
    document.querySelector('.createReplyForm').reset()
})

let newReplyFormElm = document.querySelector('.createReplyForm')

newReplyFormElm.addEventListener('submit', async (e) => {
    e.preventDefault()
    // document.querySelector('.home_page_cover').classList.add('d-none');
    // let formData = new FormData(newReplyFormElm)
    if ((newReplyFormElm.replyContent.value === '') && (newReplyFormElm.image.value === '')) {
        alert("No Content")
        return
    }

    const newText = newReplyFormElm.replyContent.value.replace(/\r?\n/g, '<br />')
    newReplyFormElm.replyContent.value = newText

    let formData = new FormData(newReplyFormElm)
    let urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    formData.append('postId', postId)

    let res = await fetch('/replies', {
        method: 'POST',
        body: formData
    })

    let result = await res.json()

    console.log(result.message)
    if (result.message === "add reply success") {
        console.log(result.message)
    } else {
        alert(['Please Login'])
        return
    }

    createReplyContainer.classList.add("d-none");
    // location.reload();
    goToPost(postId, 1)

    document.querySelector('.createReplyForm').reset()
})

function storyMode(userID) {
    let replyBoxes = document.querySelectorAll(".reply")
    for (let reply of replyBoxes) {
        if (reply.classList.contains(`user${userID}`)) {
        } else {
            reply.classList.add("d-none")
        }
    }
}

export async function doxxUser(userId, nickname) {
    let res = await fetch(`/posts/${userId}/Users`, {
        method: 'GET'
    })
    let data = await res.json()
    let posts = data.data
    console.log(posts);
    if (posts) {
        document.querySelector('.station_name').innerText = nickname;
        setPostsOfUser(posts)
        document.querySelector('.second_row_btn').classList.add("d-none")

    } else {
        document.querySelector('.station_name').innerText = nickname
        document.querySelector('.second_row_btn').classList.add("d-none")
    }

}

let followingPosts = document.querySelector(".follow_btn")
followingPosts.addEventListener('click', async (e) => {
    console.log("followingPosts")
    document.querySelector('.station_name').innerText = "追蹤中";

    let res = await fetch(`/posts/following`, {
        method: 'GET'
    })
    let data = await res.json()

    if (data.message === "Get FollowingPosts success") {
        console.log(data.message)
    } else {
        alert(["Please Login"])
        return
    }

    let posts = data.data

    setPostsOfUser(posts)

    document.querySelector('.second_row_btn').classList.add("d-none")

})

let favPosts = document.querySelector(".favourite_btn")
favPosts.addEventListener('click', async (e) => {
    console.log("favPosts")
    document.querySelector('.station_name').innerText = "名已留";

    let res = await fetch(`/posts/fav`, {
        method: 'GET'
    })
    let data = await res.json()

    if (data.message === "Get FavPosts success") {
        console.log(data.message)
    } else {
        alert(["Please Login"])
        return
    }

    let posts = data.data

    setPostsOfUser(posts)

    document.querySelector('.second_row_btn').classList.add("d-none")

})

const previousBtn = document.querySelector('#previous_page_btn');
previousBtn.addEventListener('click', () => {
    let currentURL = window.location.href.split('?')[0]
    location.href = currentURL
    console.log(currentURL)
})