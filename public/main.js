import { logout, checkSession } from './user.js';

//login
let loginButton = document.querySelector(".signUp_btn")
loginButton.addEventListener('click', () => {
    console.log('click_login');
    checkSession();
});

//logout
// let logoutButton = document.querySelector('.create_post_btn');
// logoutButton.addEventListener('click', () => {
//     console.log('click_logout');
//     logout();
// });

//bookmark posts (star)
async function addPostBookmark(post_id) {

    let uploadData = {
        id: post_id,
    }

    let res = await fetch('/user/bookmark', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[POST BOOKMARKED]")
    }
}

async function deletePostBookmark(post_id) {
    let uploadData = {
        id: post_id,
    }

    let res = await fetch('/user/bookmark', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[BOOKMARKED POST DELETED]")
    }
}

function starClick(postId) {
    let starButton = document.querySelector(".fa-star")
    let favButton = document.querySelector(".fav_btn")
    
    let starToggle = false;
    starButton.style.color = "rgb(255,255,255)"

    favButton.addEventListener('click', () => {
        console.log('click_star');
        console.log(starButton.style.color);
        if (starToggle) { //yellow to white
            deletePostBookmark(postId)
            starButton.style.color = "rgb(255,255,255)"
            starToggle = false;
            console.log(starToggle);

        } else { //white to yellow
            addPostBookmark(postId)
            starButton.style.color = "rgb(250,194,9)"
            starToggle = true;
            console.log(starToggle);

        }
    });
}


//block user
async function blockUser(blocked_user_id) {

    let uploadData = {
        id: blocked_user_id,
    }

    let res = await fetch('/user/block', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[USER BLOCKED]")
    }
}
//not yet tested no entry button
async function unblockUser(blocked_user_id) {
    let uploadData = {
        id: blocked_user_id,
    }

    let res = await fetch('/user/block', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[BLOCKED USER UNBLOCKED]")
    }
};


//add following users
async function addFollowingUser(follow_user_id) {
    let uploadData = {
        id: follow_user_id,
    }

    let res = await fetch('/user/following', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[USER FOLLOWED]")
    }
}

//delete following users
async function deleteFollowingUser(follow_user_id) {
    let uploadData = {
        id: follow_user_id,
    }

    let res = await fetch('/user/following', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData)
    })

    if (!res.ok) {
        alert("[ERR0R: CANT FETCH]")
    } else {
        alert("[USER UNFOLLOWED]")
    }
}


//clone left_side for responsive
const postContainer = document.querySelector(".post-container_template");
function showPostContainer() {
    postContainer.style.zIndex = 10087;
}
function hidePostContainer() {
    postContainer.style.zIndex = 0;
}

(() => {
    const cloneNode = document.querySelector(".left_side .second_row_div");

    const leftSideClone = cloneNode.cloneNode(true);
    document.querySelector(".mobile_vision").appendChild(leftSideClone);

    let pathname = window.location.pathname
    const words = pathname.split('/');
    if (words.length > 0) {
        const stationID = words[words.length - 1]
        goToStation(stationID);
    }
})();

//stations
const addAElem = document.querySelectorAll('.stations .link');

for (let i = 0; i < addAElem.length; i++) {
    const stationID = addAElem[i].getAttribute("data-link");

    addAElem[i].addEventListener('click', async (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/stations/' + stationID);

        goToStation(stationID);
    })
};

//toStations && createPost
async function goToStation(stationId) {
    const res = await fetch(`/stations/${stationId}/posts`);
    const { stations, posts } = await res.json();

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;

    hidePostContainer();
    if (stations.length > 0) {
        document.querySelector('.station_name').innerText = stations[0].name;
    }

    goToPost(postId, page);
    starClick(postId); //favourite post (C+D)

    // getStationsPost
    setPostsOfStation(stations[0], posts);

    //visited onclick function
    // let visited = postClone.querySelector('.visited')
}

function setPostsOfStation(station, posts) {
    const pageSize = 25;
    const stationId = station.id;
    const stationName = station.name;
    const template = document.querySelector(".post_template");
    const mobileVision = document.querySelector(".mobile_vision");
    const postTemplateNode = document.querySelector(".post_template_sample .post");

    template.innerHTML = "";
    for (let child of mobileVision.querySelectorAll(".post")) {
        mobileVision.removeChild(child);
    }

    for (let post of posts) {
        const { id, nickname, is_male, updated_at, likes, post_title, number_of_replies } = post;
        const pageCount = Math.ceil(number_of_replies / pageSize);
        const postClone = postTemplateNode.cloneNode(true);
        const pageSelectElement = postClone.querySelector("select");

        function postClick(post) {
            post.addEventListener('click', async (e) => {
                e.preventDefault();
                let urlParams = new URLSearchParams();
                urlParams.set("postId", id)
                history.pushState({}, '', '?' + urlParams.toString());
                goToPost(id, 1);
                showPostContainer();
            });
        };


        for (let k = 0; k < pageCount; k++) {
            const pageNumber = k + 1;
            const optionNode = document.createElement('option');
            const textNode = document.createTextNode(getPageName(pageNumber));

            optionNode.setAttribute('value', `${pageNumber}`);
            optionNode.appendChild(textNode);

            pageSelectElement.appendChild(optionNode);
        }
        pageSelectElement.addEventListener("click", e => e.stopPropagation());
        pageSelectElement.addEventListener("change", (e) => goToPost(id, e.target.value));
        postClick(postClone);

        //posts-host
        let postHost = postClone.querySelector(".post_host")
        let hostNameText = nickname;
        postHost.innerText = hostNameText;

        // host-gender
        let hostGender = is_male;
        if (hostGender == true) {
            postHost.style.color = "#34aadc";
        } else {
            postHost.style.color = "red";
        }

        //post-created-time
        let createTime = postClone.querySelector('.post_created_time');
        let now = Date.now();
        let updatedTime = new Date(updated_at).getTime()
        let timePassed = (now - updatedTime) / 1000;
        let showTimePassed = '';
        if (timePassed > 31104000) {
            showTimePassed = parseInt(timePassed / 31104000) + '年前'
        } else if (timePassed > 2592000) {
            showTimePassed = parseInt(timePassed / 2592000) + '月前'
        } else if (timePassed > 86400) {
            showTimePassed = parseInt(timePassed / 86400) + '天前'
        } else if (timePassed > 3600) {
            showTimePassed = parseInt(timePassed / 3600) + '小時前'
        } else if (timePassed > 60) {
            showTimePassed = parseInt(timePassed / 60) + '分鐘前'
        } else {
            showTimePassed = parseInt(timePassed) + '秒前'
        }
        createTime.innerText = showTimePassed;

        //posts-like
        let postLike = postClone.querySelector(".like");
        let likeNUM = likes;
        postLike.innerText = likeNUM;

        const countOfLike = Number(likeNUM);
        if (countOfLike > 0) {
            postClone.querySelector('.post_like').classList.remove('d-none');
        } else {
            postClone.querySelector('.post_dislike').classList.remove('d-none');
        }

        //posts-title
        let postTitle = postClone.querySelector('.post_title');
        let postTitleText = post_title;
        postTitle.innerText = postTitleText;

        //posts-stations Btn
        const postStationsBtn = postClone.querySelector('.post_station')
        postStationsBtn.innerText = stationName;
        postStationsBtn.setAttribute("href", `/stations/${stationId}`);
        const postStationsBtnLink = document.createElement("a");
        postStationsBtnLink.setAttribute("href", `/stations/${stationId}`);
        postStationsBtn.appendChild(postStationsBtnLink);

        // posts-stations Btn replace post-link
        // postClone.parentNode.replaceChild(postStationsBtnLink, postLinkNode);


        //hidden post_template
        postClone.classList.remove("d-none");
        //template + postClone && clone one more for mobileVision
        template.appendChild(postClone);

        const forMobileVision = postClone.cloneNode(true);
        postClick(forMobileVision);
        mobileVision.appendChild(forMobileVision);
    };
}

async function goToPost(postId, currentPage) {
    const pageSize = 25;
    const res = await fetch(`/post/${postId}/replies/pages/${currentPage}`);
    const { replies, repliesTotal, posts } = await res.json();
    const pageCount = Math.ceil(repliesTotal / pageSize);

    setRepliesOfPage(posts[0]?.post_title, replies, pageSize, currentPage);
    setPageDropdown(postId, pageCount, currentPage);
}

function getPageName(pageNumber) {
    return `第${pageNumber}頁`;
}

function setPageDropdown(postId, pageCount, currentPage) {
    const repliesSelect = document.querySelector('#replies_select');
    const repliesSelectClone = repliesSelect.cloneNode();
    const nextButton = document.querySelector('.next_page_btn');
    const prevButton = document.querySelector('.previous_page_btn button');

    function goToPage(postId, targetPage) {
        const urlParams = new URLSearchParams();
        urlParams.set("postId", postId);
        urlParams.set("page", targetPage);

        history.pushState({}, '', '?' + urlParams.toString());
        goToPost(postId, targetPage);
        showPostContainer();
    }

    document.querySelector(".post_replies .post_pages").innerText = currentPage;
    repliesSelectClone.addEventListener('change', (e) => {
        e.preventDefault();
        goToPage(postId, e.target.value);
    });

    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= pageCount;

    for (let button of [prevButton, nextButton]) {
        if (button.disabled) {
            button.style.opacity = 0;
        } else {
            button.style.opacity = 1;
        }
    }

    for (let k = 0; k < pageCount; k++) {
        const pageNumber = k + 1;
        const optionNode = document.createElement('option');
        const textNode = document.createTextNode(getPageName(pageNumber));

        optionNode.setAttribute('value', `${pageNumber}`);
        optionNode.appendChild(textNode);

        if (pageNumber == currentPage) {
            const prevButtonClone = prevButton.cloneNode(true);
            const nextButtonClone = nextButton.cloneNode(true);

            optionNode.setAttribute("selected", "selected");
            prevButtonClone.addEventListener('click', () => {
                if (k > 0) {
                    goToPage(postId, k);
                }
            });
            nextButtonClone.addEventListener('click', () => {
                const nextPageNumber = pageNumber + 1;
                if (nextPageNumber <= pageCount) {
                    goToPage(postId, nextPageNumber);
                }
            });

            prevButton.parentNode.replaceChild(prevButtonClone, prevButton);
            nextButton.parentNode.replaceChild(nextButtonClone, nextButton);
        }

        repliesSelectClone.appendChild(optionNode);
    }

    repliesSelect.parentNode.replaceChild(
        repliesSelectClone,
        repliesSelect
    );
}

function setRepliesOfPage(title, replies, pageSize, currentPage, postId) {
    const replyNumOffset = (currentPage - 1) * pageSize;
    const replyTemplate = document.querySelector(".replies_container_template");
    const reply = document.querySelector(".replies_container_template_sample .reply");

    replyTemplate.innerHTML = "";

    for (let r = 0; r < replies.length; r++) {
        const replyClone = reply.cloneNode(true);
        const nicknameElement = replyClone.querySelector('.user_nickname_btn');
        const contentElement = replyClone.querySelector(".reply_second_row");
        const likeElement = replyClone.querySelector(".reply_like");
        const dislikeElement = replyClone.querySelector(".reply_dislike");
        const postTitleForReply = document.querySelector('.post_first_row .post_title');

        replyClone.querySelector('.reply_num').innerText = r + 1 + replyNumOffset;
        replyClone.querySelector('.reply_num').setAttribute('id', r + 1); //replybox id
        nicknameElement.innerText = replies[r].nickname;
        contentElement.innerHTML = replies[r].content;
        likeElement.innerText = replies[r].likes;
        dislikeElement.innerHTML = replies[r].dislikes;
        postTitleForReply.innerText = title;

        //replies
        const userDetail = replyClone.querySelector('.user_nickname_btn');
        const userDetailContent = replyClone.querySelector('.userDetail')
        replyClone.querySelector(".userDetail_nickname").innerText = replies[r].nickname;
        replyClone.querySelector(".userDetail_id").innerText = "#" + replies[r].user_id;

        let userID = (replyClone.getElementsByClassName('userDetail_id')[0].innerHTML).split('#')[1]
        //doxx
        let doxxButton = replyClone.querySelector('.doxx');
        doxxButton.addEventListener('click', () => {
            console.log('click_doxx');
            window.location = `/user/profile/${userID}`;
        });
        //block
        let blockButton = replyClone.querySelector('.block');
        blockButton.addEventListener('click', () => {
            console.log('click_block');
            if (replyClone.querySelector('.block').innerText === '封鎖') {
                replyClone.querySelector('.block').innerText = '解除封鎖'
                console.log(replyClone.querySelector('.block').innerText);
                blockUser(userID);
            } else {
                replyClone.querySelector('.block').innerText = '封鎖'
                console.log(replyClone.querySelector('.block').innerText);
                unblockUser(userID);
            }

        });
        //follow
        let followButton = replyClone.querySelector('.follow');
        followButton.addEventListener('click', () => {
            console.log('click_follow');
            //css broken
            if (replyClone.querySelector('.follow').innerText === '追蹤') {
                replyClone.querySelector('.follow').innerText = '取消追蹤'
                console.log(replyClone.querySelector('.follow').innerText);
                addFollowingUser(userID);
            } else {
                replyClone.querySelector('.follow').innerText = '追蹤'
                console.log(replyClone.querySelector('.follow').innerText);
                deleteFollowingUser(userID);
            }
        });

        // Story Mode
        const storyModeButton = replyClone.querySelector('.block_replies_btn')
        let storyModeToggle = false
        storyModeButton.addEventListener('click', () => {
            storyModeToggle = !storyModeToggle
            if (storyModeToggle === true) {
                console.log('StoryMode')
                replyClone.querySelector('.fa-eye-slash').classList.remove("d-none");
                replyClone.querySelector('.fa-eye').classList.add("d-none");
                console.log(userID)
                console.log(nicknameElement.innerText)
                // console.log(replyTemplate.innerHTML)
                replyTemplate.querySelector('.reply').classList.add("d-none");
                // (1) newReplyArray = replies filtered by userID
                // (2) userID -> unique user Nickname
                //display none / display block : ".reply"

                // for(reply of replyTemplate)
                //     replyId = reply.querySelector(".userDetail_id").innerText
                //     if(replyId != userID){

                //     }

                

            } else {
                console.log('NormalMode')
                replyClone.querySelector('.fa-eye').classList.remove("d-none");
                replyClone.querySelector('.fa-eye-slash').classList.add("d-none");
                let urlParams = new URLSearchParams(window.location.search);
                const postId = urlParams.get('postId');
                goToPost(postId, 1)
            }
        })

        userDetail.addEventListener('click', () => {
            userDetailContent.classList.remove("d-none");
            console.log("replyID:", userID);
        })

        const leaveUserDetail = replyClone.querySelector('.leave_userDetail_btn');
        leaveUserDetail.addEventListener('click', () => {
            userDetailContent.classList.add("d-none");
        })

        //like && dislike btn
        const likeButton = replyClone.querySelector(".like_btn button");
        const dislikeButton = replyClone.querySelector(".dislike_btn button");
        likeButton.addEventListener("click", () => likeReply(replies[r].id, true))
        dislikeButton.addEventListener("click", () => dislikeReply(replies[r].id, false))

        async function likeReply(id, isLike) {
            console.log({ id, isLike })
            const res = await fetch(`/replies/${id}/like`, {
                method: 'PATCH'
            });

            const likeData = await res.json();
            if (res.ok) {
                const latestReplyLike = likeData.latestReplyLike
                console.log({ latestReplyLike })
                replyClone.querySelector('.reply_like').innerText = latestReplyLike.likes;
                console.log(`isLike is true`)
                return;
            }
        }

        async function dislikeReply(id, isLike) {
            console.log({ id, isLike })
            const res = await fetch(`/replies/${id}/dislike`, {
                method: 'PATCH'
            });

            const dislikeData = await res.json()
            if (res.ok) {
                const latestReplyDislike = dislikeData.latestReplyDislike
                console.log({ latestReplyDislike })
                replyClone.querySelector('.reply_dislike').innerText = latestReplyDislike.dislikes;
                console.log(`isLike is false`)
                return;
            }
        }
        replyTemplate.appendChild(replyClone);
    }


}

//newest & hit switch
const newestBtns = document.querySelectorAll(".newest_btn");
const hitBtns = document.querySelectorAll(".hit_btn");

for (let newestBtn of newestBtns) {
    newestBtn.addEventListener('click', () => {
        for (let btn of newestBtns) {
            btn.classList.add('active');
        }
        for (let hitBtn of hitBtns) {
            hitBtn.classList.remove('active');
        }
    })
}

for (let hitBtn of hitBtns) {
    hitBtn.addEventListener('click', () => {
        for (let btn of hitBtns) {
            btn.classList.add('active');
        }
        for (let newestBtn of newestBtns) {
            newestBtn.classList.remove('active');
        }
    })
}

// refresh_btn
const refreshBtns = document.querySelectorAll('.refresh_btn');
for (let refreshBtn of refreshBtns) {
    refreshBtn.addEventListener('click', () => {
        location.reload();
    })
}

//image
const image = document.querySelector('.imgBtn');
const leaveImg = document.querySelector('.leave_btn');
const imgWall = document.querySelector('.img_wall');
const createImgEle = document.querySelector('.img_container');

image.addEventListener('click', async () => {
    let urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    imgWall.classList.remove("d-none");

    const res = await fetch(`/post/${postId}/media`);
    let data = await res.json()
    let images = data.images;

    for (let path of images) {
        const img = document.createElement("img");
        img.setAttribute('class', 'grid-item img-fluid');
        img.src = `http://localhost:8080/${path.name}`;
        createImgEle.appendChild(img);
    }
})

leaveImg.addEventListener('click', () => {
    imgWall.classList.add('d-none');
    createImgEle.innerHTML = " ";
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
})

let newPostFormElm = document.querySelector('.createPostForm')

newPostFormElm.addEventListener('submit', async (e) => {
    e.preventDefault()

    let formData = new FormData(newPostFormElm)

    let res = await fetch('/posts', {
        method: 'POST',
        body: formData
    })

    let result = await res.json()
    console.log(result.message)

    createPostContainer.classList.add("d-none");

    let selectStationId = document.getElementById("selectStation").value
    goToStation(Number(selectStationId))

    document.querySelector('.createPostForm').reset()
})

//userProfile
const leaveProfile = document.querySelector('.leave_profile');
const showProfile = document.querySelector('.btn_bar .profile');

showProfile.addEventListener('click', () => {
    document.querySelector('.userProfile').classList.remove('d-none');
})

leaveProfile.addEventListener('click', () => {
    document.querySelector('.userProfile').classList.add('d-none');
})

// Create Reply
const createReply = document.querySelector('.reply_btn');
const createReplyContainer = document.querySelector('.createReplyContainer')
createReply.addEventListener('click', () => {
    let postTitle = document.getElementById("replyPostTitle")

    let replyFormTitle = document.querySelector('.replyFormTitle')
    replyFormTitle.innerText = '回覆：'+ postTitle.innerHTML
    createReplyContainer.classList.remove("d-none");
})

const leaveCreateReply = document.querySelector('.leave_createReply_btn');
leaveCreateReply.addEventListener('click', () => {
    createReplyContainer.classList.add("d-none");
})

let newReplyFormElm = document.querySelector('.createReplyForm')

newReplyFormElm.addEventListener('submit', async (e) => {
    e.preventDefault()

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

    createReplyContainer.classList.add("d-none");

    goToPost(postId, 1)

    document.querySelector('.createReplyForm').reset()
})