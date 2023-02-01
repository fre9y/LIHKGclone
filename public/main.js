import { logout, redirectGoogle, loadUserProfileContainer, addPostBookmark, deletePostBookmark, blockUser, unblockUser, addFollowingUser, deleteFollowingUser } from './user.js';

//login
let loginButton = document.querySelector(".signUp_btn")
loginButton.addEventListener('click', () => {
    console.log('click_login');
    redirectGoogle();
});

//logout
let logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
    console.log('click_logout');
    document.querySelector('.userProfile').classList.add('d-none');
    logout();

});
//change profile
let changeProfileButton = document.querySelector('.change_profile');
changeProfileButton.addEventListener('click', () => {
    console.log('click_change-profile');
    window.location = "/userProfile.html"
});

//read blocked list
let readBlockedListButton = document.querySelector('.blocked_list');
let leaveBlockedListButton = document.querySelector('.leave_blocked_list');
readBlockedListButton.addEventListener('click', () => {
    console.log('click_blocked-list');
    document.querySelector('.blocked_list_container').classList.remove('d-none');
    document.querySelector('.userProfile').classList.add('d-none');
    showBlockedList() 
});
leaveBlockedListButton.addEventListener('click', () => {
    console.log('click_leave-blocked-list');
    document.querySelector('.blocked_list_container').classList.add('d-none');
    
});


async function showBlockedList() {
    let res = await fetch('/user/block', {
        method: 'GET' 
    })
    if (res.ok) {
        let data = await res.json()
        let blockedList = data
        let blockedListElem = document.querySelector(".blocked_table")
        blockedListElem.innerHTML = ""
        blockedListElem.innerHTML += /*html*/ `

        <table>
            <tr>
                    <th class = "blocked_user_id">ID</th>
                    <th class = "blocked_user_nickname">Nickname</th>
                    <th class = "blocked_user_create_date">Create Date</th>
                    <th class = "blocked_user_create_time">Create Time</th>
                    <th>DELETE</th>
            </tr>   
        </table>
        `
        for (let i = 0; i < blockedList.length; i++) {
            let blockedUser = blockedList[i]
            let blockedUserId = blockedUser.user_id_being_blocked
            let createDate = blockedList[i].created_at.split('T')[0]
            let createTime = blockedList[i].created_at.split('T')[1].split('.')[0]
            let blockedUserElem = document.createElement("tr")
            // <i class="fas fa-trash-alt"></i>
            blockedUserElem.innerHTML = `
            <td class="blocked_user_id">${blockedUser.user_id_being_blocked}</td>
            <td class="blocked_user_nickname">${blockedUser.nickname}</td>
            <td class="blocked_user_create_date">${createDate}</td>
            <td class="blocked_user_create_time">${createTime}</td>
            <td class="blocked_user_delete">
               
                
                
            <button class="unblock_btn" 
            id="unblock${blockedUserId}" 
            "><i class="fas fa-trash-alt"></i></button> 
              
            </td>
            `
            console.log(blockedUserElem);
            blockedListElem.appendChild(blockedUserElem)
            let unblockUserElem =document.querySelector(`#unblock${blockedUserId}`)
            unblockUserElem.addEventListener('click', () => {
                console.log(blockedUser.user_id_being_blocked);
                console.log('click_unblock-user');
                unblockUser(blockedUserId)
                showBlockedList()
            })  

        }
    } else {
        alert("[ERR0R: CANT FETCH]")
        return
    }
}

//star
function starClick(postId) {
    console.log({starClick: postId})
    if (postId) {
        let starButton = document.querySelector(".star")
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
}



function copyToClipboard() {

    let copyText = document.querySelector(".share_content").innerText;
    const copyContent = async () => {
        console.log("123");
        try {
            await navigator.clipboard.writeText(copyText);
            console.log(copyText);
            console.log("copied to clipboard");
        } catch (error) {
            console.log("failed to copy: ", error);
        }
    }
    copyContent();
}

//clone left_side for responsive
const postContainer = document.querySelector(".post-container_template");
function showPostContainer() {
    postContainer.style.zIndex = 10080;
}
function hidePostContainer() {
    postContainer.style.zIndex = 0;
}

window.addEventListener('load', async () => {
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
})

async function setTabButtons(stationId) {
    const newestButtons = document.querySelectorAll(".second_row_div .newest_btn");
    const hitButtons = document.querySelectorAll(".second_row_div .hit_btn");

    function active(buttons) {
        for (let button of buttons) {
            button.classList.add("active");
        }
    }
    function inactive(buttons) {
        for (let button of buttons) {
            button.classList.remove("active");
        }
    }

    active(document.querySelectorAll(".second_row_div .newest_btn"));
    inactive(document.querySelectorAll(".second_row_div .hit_btn"));

    for (let button of newestButtons) {
        const clone = button.cloneNode(true);
        clone.addEventListener("click", () => {
            active(document.querySelectorAll(".second_row_div .newest_btn"));
            inactive(document.querySelectorAll(".second_row_div .hit_btn"));

            goToStation(stationId);
        });
        button.parentNode.replaceChild(clone, button);
    }
    for (let button of hitButtons) {
        const clone = button.cloneNode(true);
        clone.addEventListener("click", () => {
            inactive(document.querySelectorAll(".second_row_div .newest_btn"));
            active(document.querySelectorAll(".second_row_div .hit_btn"));

            goToHitStation(stationId);
        });
        button.parentNode.replaceChild(clone, button);
    }
}

//stations
const addAElem = document.querySelectorAll('.stations .link');

for (let i = 0; i < addAElem.length; i++) {
    const stationID = addAElem[i].getAttribute("data-link");

    addAElem[i].addEventListener('click', async (e) => {
        e.preventDefault();
        document.querySelector(".replies_container_template").innerHTML = "";
        window.history.pushState({}, '', '/stations/' + stationID);

        // document.querySelector(".post_template").innerHTML = "";
        goToStation(stationID);
        setTabButtons(stationID);
        document.querySelector('.home_page_cover').classList.remove('d-none');
    })
};

//toStations && createPost
async function goToStation(stationId) {
    console.log({goToStation: stationId})
    const res = await fetch(`/stations/${stationId}/posts`);
    const { stations, posts } = await res.json();
    setPostsOfUser(posts)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;
    
    document.querySelector('.second_row_btn').classList.remove("d-none")

    console.log((window.location.href)); // current url
    //console.log(stations[0].id); //stationID
    //console.log(postId);// postID
    hidePostContainer();
    console.log(stations)
    if (stations.length > 0) {
        document.querySelector('.station_name').innerText = stations[0].name;
    }
    console.log({postId: postId})

    if (postId != null) {
        await goToPost(postId, page);
        starClick(postId); //favourite post (C+D)
    }
    // getStationsPost
    setPostsOfStation(stations[0], posts);
    document.querySelector('.post_replies').classList.add('d-none');
    document.querySelector('.post_first_row').classList.add('d-none');
}

//toHitStations && createPost
async function goToHitStation(stationId) {
    const res = await fetch(`/stations/${stationId}/hit-posts`);
    const { stations, hitStation } = await res.json();

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;

    hidePostContainer();
    if (stations.length > 0) {
        document.querySelector('.station_name').innerText = stations[0].name;
    }

    await goToPost(postId, page);
    starClick(postId); //favourite post (C+D)
    // getStationsPost
    setPostsOfStation(stations[0], hitStation);

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
    console.log("setPostsOfStation: ", posts)
    for (let post of posts) {
        const { id, nickname, is_male, is_p, updated_at, likes, post_title, number_of_replies } = post;
        const pageCount = Math.ceil(number_of_replies / pageSize);
        const postClone = postTemplateNode.cloneNode(true);
        const pageSelectElement = postClone.querySelector("select");

        function postClick(post) {
            //console.log("postClick: ", post)
            post.addEventListener('click', async (e) => {
                e.preventDefault();
                let urlParams = new URLSearchParams();
                urlParams.set("postId", id)
                history.pushState({}, '', '?' + urlParams.toString());
                goToPost(id, 1);
                showPostContainer();
                document.querySelector('.home_page_cover').classList.add('d-none');
            });
        };
        postClick(postClone);


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

        // isP
        let isP = postClone.querySelector('.isP');
        if (is_p === true){
            isP.classList.remove("d-none")
        } else {
            isP.classList.add("d-none")
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

        // heat icon
        let heat = postClone.querySelector('.fa-bolt');
        if ((timePassed < 3600) && (number_of_replies > 9)){
            heat.classList.remove("d-none")
        } else {
            heat.classList.add("d-none")
        }        

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
    console.log("goToPost: ", postId);
    starClick(postId)
        const pageSize = 25;
        const res = await fetch(`/post/${postId}/replies/pages/${currentPage}`);
        const { replies, repliesTotal, posts, repliesImage } = await res.json();
        const pageCount = Math.ceil(repliesTotal / pageSize);

        document.querySelector('.img_container').innerHTML = " ";
        document.querySelector(".total_img").innerText = "0";
        await setRepliesOfPage(posts[0]?.post_title, replies, pageSize, currentPage, repliesImage);
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

async function setRepliesOfPage(title, replies, pageSize, currentPage, repliesImage) {
    const replyNumOffset = (currentPage - 1) * pageSize;
    const replyTemplate = document.querySelector(".replies_container_template");
    const reply = document.querySelector(".replies_container_template_sample .reply");
    const createImgEle = document.querySelector('.img_container');
    
    replyTemplate.innerHTML = "";
    const totalImg = document.querySelector(".total_img");
    const imageTotal = [];

    for (let r = 0; r < replies.length; r++) {
        const replyClone = reply.cloneNode(true);
        const nicknameElement = replyClone.querySelector('.user_nickname_btn');
        const likeElement = replyClone.querySelector(".reply_like");
        const dislikeElement = replyClone.querySelector(".reply_dislike");
        const postTitleForReply = document.querySelector('.post_first_row .post_title');
        const contentElement = replyClone.querySelector(".reply_second_row .reply_content");
        const imageElement = replyClone.querySelector('.reply_second_row .reply_image');

        replyClone.querySelector('.reply_num').innerText = r + 1 + replyNumOffset;
        replyClone.querySelector('.reply_num').setAttribute('id', 'replynum' + (Number(r) + 1));  //replybox id to link
        nicknameElement.innerText = replies[r].nickname;
        likeElement.innerText = replies[r].likes;
        dislikeElement.innerHTML = replies[r].dislikes;
        document.querySelector('.post_replies').classList.remove('d-none');
        document.querySelector('.post_first_row').classList.remove('d-none');
        postTitleForReply.innerText = title;

        function shareReplyClick() {
            let shareButton = replyClone.querySelector(".share_btn")
            let leaveShareButton = replyClone.querySelector(".leave_share_btn")
            let copyButton = replyClone.querySelector(".copy")
            let tgButton = replyClone.querySelector(".telegram")
            let postTitle = postTitleForReply.innerText
            const constantText = '- 分享自 LIHKG 討論區'
            let shareURL = window.location.href.split('&')[0] + '#replynum' + replyClone.querySelector('.reply_num').innerText

            replyClone.querySelector(".post-title").innerText = postTitle
            replyClone.querySelector(".constant-text").innerText = constantText
            replyClone.querySelector(".share-url").innerText = shareURL

            shareButton.addEventListener('click', () => {
                console.log('click_share');
                replyClone.querySelector('.share_container').classList.remove('d-none');
            })
            leaveShareButton.addEventListener('click', () => { //not ok
                console.log('click_leave-share');
                replyClone.querySelector('.share_container').classList.add('d-none');
            })
            copyButton.addEventListener('click', () => {
                copyToClipboard()
                console.log('click_copy');
            })
            tgButton.addEventListener('click', () => {
                console.log('click_tg');
                window.location = `tg://msg_url?url=${replyClone.querySelector(".share-url").innerText}&text=${replyClone.querySelector(".post-title").innerText}${replyClone.querySelector(".constant-text").innerText}`
            })
            
        }
        shareReplyClick();


        //user is_male
        if (replies[r].is_male == true) {
            nicknameElement.style.color = "#34aadc";
        } else {
            nicknameElement.style.color = "red";
        }

        //replies content && image
        if (replies[r].images_id == null) {
            contentElement.innerHTML = replies[r].content;
        } else {
            for (let image of replies[r].images_id) {
                contentElement.innerHTML = replies[r].content;
                imageElement.classList.remove('d-none');
                imageElement.querySelector('img').setAttribute('src', `/${image}`);
            }
        }

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
            doxxUser(userID,replies[r].nickname)
            userDetailContent.classList.add("d-none");
            // window.location = `/user/profile/${userID}`;
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
        replyClone.classList.add(`user${userID}`)
        const storyModeButtonOn = replyClone.querySelector('.fa-eye')
        const storyModeButtonOff = replyClone.querySelector('.fa-eye-slash')
        storyModeButtonOn.addEventListener('click', () => {
            console.log('StoryMode')
            let eyes = document.querySelectorAll(".fa-eye")
            let eyeSlashes = document.querySelectorAll(".fa-eye-slash")
            for (let eye of eyes) {
                eye.classList.add("d-none")
            }
            for (let eyeSlash of eyeSlashes) {
                eyeSlash.classList.remove("d-none")
            }
            storyMode(userID)
        })

        storyModeButtonOff.addEventListener('click', () => {
            console.log('NormalMode')
            let eyes = document.querySelectorAll(".fa-eye")
            let eyeSlashes = document.querySelectorAll(".fa-eye-slash")
            for (let eye of eyes) {
                eye.classList.remove("d-none")
            }
            for (let eyeSlash of eyeSlashes) {
                eyeSlash.classList.add("d-none")
            }
            let replyBoxes = document.querySelectorAll(".reply")
            for (let reply of replyBoxes) {
                reply.classList.remove("d-none")
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
            if(likeData.message === "like success"){
            } else {
                alert("Please Login")
                return
            }
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
            if(dislikeData.message === "dislike success"){
            } else {
                alert("Please Login")
                return
            }
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

    for (let image of repliesImage) {
        if (image.images_id == null) {
            continue;
        } else {
            const img = document.createElement("img");
            img.setAttribute('class', 'grid-item img-fluid');
            img.src = `http://localhost:8080/${image.images_id}`;
            createImgEle.appendChild(img);

            imageTotal.push(image.images_id);
        }
    }
    totalImg.innerText = imageTotal.length;
}

// refresh_btn
const refreshBtns = document.querySelectorAll('.refresh_btn');
for (let refreshBtn of refreshBtns) {
    refreshBtn.addEventListener('click', () => {
        //location.reload();
        let currentURL = window.location.href.split('?')[0]
        location.href = currentURL
    })
}

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
    let createPostForm = document.querySelector('.createPostForm')

    if(createPostForm.postTitle.value === ''){
        alert("No Title")
        return
    }
    if((createPostForm.content.value === '') && (createPostForm.image.value === '')){
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

    let result = await res.json()
    if (result.message === "add post success") {
        console.log(result.message)
    } else {
        alert(["Please Login"])
        return
    }
    createPostContainer.classList.add("d-none");

    let selectStationId = document.getElementById("selectStation").value
    goToStation(Number(selectStationId))
    goToPost(Number(result.data), 1)
    document.querySelector('.createPostForm').reset()
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
    
    if((newReplyFormElm.replyContent.value === '') && (newReplyFormElm.image.value === '')){
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

export async function doxxUser(userId,nickname) {
    let res = await fetch(`/posts/${userId}/Users`, {
        method: 'GET'
    })
    let data = await res.json()
    let posts = data.data
    console.log(posts);
    if (posts){
        document.querySelector('.station_name').innerText = posts[0].nickname;
        setPostsOfUser(posts)
        document.querySelector('.second_row_btn').classList.add("d-none")
        
    } else {
        document.querySelector('.station_name').innerText = nickname
         document.querySelector('.second_row_btn').classList.add("d-none")
    }

}

function setPostsOfUser(posts) {
    console.log("setPostsOfUser: ", posts)
    const pageSize = 25;
    const template = document.querySelector(".post_template");
    const mobileVision = document.querySelector(".mobile_vision");
    const postTemplateNode = document.querySelector(".post_template_sample .post");

    template.innerHTML = "";
    for (let child of mobileVision.querySelectorAll(".post")) {
        mobileVision.removeChild(child);
    }

    for (let post of posts) {
        const { nickname, is_p, updated_at, likes, number_of_replies, post_title, station_name, user_is_male, post_id } = post;
        const pageCount = Math.ceil(number_of_replies / pageSize);
        const postClone = postTemplateNode.cloneNode(true);
        const pageSelectElement = postClone.querySelector("select");

        postClick(postClone);
        function postClick(post) {
            post.addEventListener('click', async (e) => {
                e.preventDefault();
                console.log("clone post click")
                let urlParams = new URLSearchParams();
                urlParams.set("postId", post_id)
                history.pushState({}, '', '?' + urlParams.toString());
                goToPost(post_id, 1);
                starClick(post_id)

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
        pageSelectElement.addEventListener("change", (e) => goToPost(post_id, e.target.value));

        //posts-host
        let postHost = postClone.querySelector(".post_host")
        let hostNameText = nickname;
        postHost.innerText = hostNameText;

        // host-gender
        let hostGender = user_is_male;
        if (hostGender == true) {
            postHost.style.color = "#34aadc";
        } else {
            postHost.style.color = "red";
        }

        // isP
        let isP = postClone.querySelector('.isP');
        if (is_p === true){
            isP.classList.remove("d-none")
        } else {
            isP.classList.add("d-none")
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

        // heat icon
        let heat = postClone.querySelector('.fa-bolt');
        if ((timePassed < 3600) && (number_of_replies > 9)){
            heat.classList.remove("d-none")
        } else {
            heat.classList.add("d-none")
        }        

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
        postStationsBtn.innerText = post.station_name

        //hidden post_template
        postClone.classList.remove("d-none");
        //template + postClone && clone one more for mobileVision
        template.appendChild(postClone);

        const forMobileVision = postClone.cloneNode(true);
        postClick(forMobileVision);
        mobileVision.appendChild(forMobileVision);
    };
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