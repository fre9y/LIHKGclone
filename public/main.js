import { logout, checkSession, block } from './user.js';

//login
let profileIcon = document.querySelector(".profile")
profileIcon.addEventListener('click', () => {
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
async function addPostBookmark(post_id){

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

async function deletePostBookmark(post_id){
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

function starClick(postId){
    let starButton = document.querySelector(".fa-star")
    let buttonToggle = false;
    starButton.style.color = "rgb(255,255,255)" 

    starButton.addEventListener('click', () => {
        console.log('click_star');  
        console.log(starButton.style.color);
        if (buttonToggle) { //yellow to white
            starButton.style.color = "rgb(255,255,255)"
            buttonToggle = false;
            console.log(buttonToggle);
            deletePostBookmark(postId)
        } else { //white to yellow
            starButton.style.color = "rgb(250,194,9)"
            buttonToggle = true;
            console.log(buttonToggle);
            addPostBookmark(postId)
        }
    });
}


//block user
async function blockUser(blocked_user_id){

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
async function unblockUser(blocked_user_id){
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
async function addFollowingUser(follow_user_id){
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
async function deleteFollowingUser(follow_user_id){
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
(() => {
    const cloneNode = document.querySelector(".left_side .second_row_div");

    const leftSideClone = cloneNode.cloneNode(true);
    document.querySelector(".mobile_vision").appendChild(leftSideClone);

    let pathname = window.location.pathname
    const words = pathname.split('/');
    if (words.length > 0) {
        const stationID = words[words.length - 1]
        toStations(stationID);
    }
})();




//stations
//change stations name
const addAElem = document.querySelectorAll('.stations .link');

for (let i = 0; i < addAElem.length; i++) {
    const stationID = addAElem[i].getAttribute("data-link");

    addAElem[i].addEventListener('click', async (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/stations/' + stationID);

        toStations(stationID);
    })
};
//toStations && createPost
async function toStations(stationID) {
    function changePageLabel(number) {
        document.querySelector(".post_pages").innerText = number
    }
    function repliesElement(replies, pageCount, page) {
        const repliesSelect = document.querySelector('#replies_select');
        replyTemplate.innerHTML = "";
        for (let k = 0; k < pageCount; k++) {
            const opEleText = document.createTextNode(`第${k + 1}頁`);
            let opEle = document.createElement('option');
            opEle.setAttribute('value', `${k}`);
            opEle.appendChild(opEleText);
            if (k + 1 == page) {
                opEle.setAttribute('selected', "selected")
                changePageLabel(page)
            }
            repliesSelect.appendChild(opEle);
        }

        for (let r = 0; r < replies.length; r++) {
            const replyClone = reply.cloneNode(true);
            const nicknameElement = replyClone.querySelector('.user_nickname_btn');
            const contentElement = replyClone.querySelector(".reply_second_row");
            const likeElement = replyClone.querySelector(".reply_like");
            const dislikeElement = replyClone.querySelector(".reply_dislike");
            const postTitleForReply = document.querySelector('.post_first_row .post_title');

            replyClone.querySelector('.reply_num').innerText = r + 1;
            //console.log(replies[r]);
            //console.log(replyClone);
            nicknameElement.innerText = replies[r].nickname;
            contentElement.innerHTML = replies[r].content;
            likeElement.innerText = replies[r].likes;
            dislikeElement.innerHTML = replies[r].dislikes;
            postTitleForReply.innerText = postForReply[0].post_title;
            
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
                blockUser(userID);

            });
            //follow
            let followButton = replyClone.querySelector('.follow');
            followButton.addEventListener('click', () => {
                console.log('click_follow');
                addFollowingUser(userID);
                //deleteFollowingUser(userID);
            });       

            userDetail.addEventListener('click', () => {
                userDetailContent.classList.remove("d-none");
                console.log("replyID:",userID);
            })

            const leaveUserDetail = replyClone.querySelector('.leave_userDetail_btn');
            leaveUserDetail.addEventListener('click', () => {
                userDetailContent.classList.add("d-none");
            })

            replyTemplate.appendChild(replyClone);
        }

        repliesSelect.addEventListener('change', async (e) => {
            e.preventDefault();
            let urlParams = new URLSearchParams(window.location.search);
            urlParams.set("postId", postId)
            urlParams.set("page", Number(e.target.value) + 1)

            window.location.search = urlParams.toString()
        })
    }


    const res = await fetch(`/stations/${stationID}/posts`);
    let data = await res.json();

    //change stationsName
    for (let num of data.stations) {
        document.querySelector('.station_name').innerText = num.name;
    }


    const template = document.querySelector(".post_template");
    const templateSample = document.querySelector(".post_template_sample");
    const post = templateSample.querySelector(".post");//.hidden
    const mobileVision = document.querySelector(".mobile_vision");
    const replyTemplate = document.querySelector(".replies_container_template");
    const replyTemplateSample = document.querySelector(".replies_container_template_sample");
    const reply = replyTemplateSample.querySelector(".reply");

    if (res.ok) {
        template.innerHTML = ""
    }

    let urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;

    const repliesRes = await fetch(`/post/${postId}/replies/pages/${page}`);
    const parsed = await repliesRes.json();
    const replies = parsed.replies;
    const postForReply = parsed.posts;
    const pageCount = parsed.pages;
    repliesElement(replies, pageCount, page)

    starClick(postId); //favourite post (C+D)

    // getStationsPost
    for (let x = 0; x < data.posts.length; x++) {
        const postClone = post.cloneNode(true);
        postClone.addEventListener('click', async (e) => {
            e.preventDefault();
            let urlParams = new URLSearchParams();
            urlParams.set("postId", data.posts[x].id)
            window.location.search = urlParams.toString()
        })

        //posts-host
        let postHost = postClone.querySelector(".post_host")
        let hostNameText = data.posts[x].nickname;
        postHost.innerText = hostNameText;

        // host-gender
        let hostGender = data.posts[x].is_male;
        if (hostGender == true) {
            postHost.style.color = "#34aadc";
        } else {
            postHost.style.color = "red";
        }

        //post-created-time
        let createTime = postClone.querySelector('.post_created_time');
        let now = Date.now();
        let updatedTime = new Date(data.posts[x].updated_at).getTime()
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
        let likeNUM = data.posts[x].likes;
        postLike.innerText = likeNUM;

        const countOfLike = Number(likeNUM);
        if (countOfLike > 0) {
            postClone.querySelector('.post_like').classList.remove('d-none');
        } else {
            postClone.querySelector('.post_dislike').classList.remove('d-none');
        }

        // post-pages
        // post database need count replies and pages
        // let postSelect = postClone.querySelector("select");
        // postSelect.addEventListener('click', (e) => {
        //     e.preventDefault();
        // })
        // console.log(data.posts)
        // if (data.posts[x]. = 100) {
        //     const option = document.createElement("option");
        //     option.innerText = `${} 頁`;
        //     option.value = ;

        //     postClone.querySelector("select").appendChild(option);
        // }
        // postSelect.value = ;
        // postSelect.addEventListener("change", () => {
        //     document.location = `/stations/${stationID}/page/${}`
        // })

        //posts-title
        let postTitle = postClone.querySelector('.post_title');
        let postTitleText = data.posts[x].post_title;
        postTitle.innerText = postTitleText;

        //posts-stations Btn
        const postStationsBtn = postClone.querySelector('.post_station')
        postStationsBtn.innerText = data.stations[0].name;
        postStationsBtn.setAttribute("href", `/stations/${stationID}`);
        let postStationsBtnLink = document.createElement("a");
        postStationsBtnLink.setAttribute("href", `/stations/${stationID}`);
        postStationsBtn.appendChild(postStationsBtnLink);

        // posts-stations Btn replace post-link
        // postClone.parentNode.replaceChild(postStationsBtnLink, postLinkNode);


        //hidden post_template
        postClone.classList.remove("d-none");
        //template + postClone && clone one more for mobileVision
        template.appendChild(postClone);

        const forMobileVision = postClone.cloneNode(true);
        mobileVision.appendChild(forMobileVision);
    };

    //visited onclick function
    // let visited = postClone.querySelector('.visited')
};


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

	if (res.ok) {
        newPostFormElm.reset();
        toStations(selectStation.value);
	} else {
		console.log('post fail')
	}
})



