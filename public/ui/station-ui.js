import { getPageName } from "./util.js";
import { setPageDropdown } from "../temp.js"
import { goToStation } from "../api/station-api.js";
import { setTabButtons } from "./post-ui.js";
export function setPostsOfStation(station, posts) {
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
        const { id, nickname, is_male, is_p, updated_at, likes, post_title, number_of_replies } = post;
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
        if (is_p === true) {
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
        if ((timePassed < 3600) && (number_of_replies > 9)) {
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

export function listAllStations() {
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
            document.querySelector('.post_replies').classList.add('d-none');
            document.querySelector('.post_first_row').classList.add('d-none');
        })
    };
}
export async function goToPost(postId, currentPage) {
    console.log("goToPost: ", postId);
    starClick(postId)
    const pageSize = 25;
    const res = await fetch(`/posts/${postId}/replies/pages/${currentPage}`);
    const { replies, repliesTotal, posts, repliesImage } = await res.json();
    const pageCount = Math.ceil(repliesTotal / pageSize);

    document.querySelector('.img_container').innerHTML = " ";
    document.querySelector(".total_img").innerText = "0";
    await setRepliesOfPage(posts[0]?.post_title, replies, pageSize, currentPage, repliesImage);
    setPageDropdown(postId, pageCount, currentPage);
}

export function starClick(postId) {
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

export async function setRepliesOfPage(title, replies, pageSize, currentPage, repliesImage) {
    const replyNumOffset = (currentPage - 1) * pageSize;
    const replyTemplate = document.querySelector(".replies_container_template");
    const reply = document.querySelector(".replies_container_template_sample .reply");
    const createImgEle = document.querySelector('.img_container');

    document.querySelector('.home_page_cover').classList.add('d-none');
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
            doxxUser(userID, replies[r].nickname)
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
                const alert = document.querySelector('.block_list');
                alert.classList.remove('d-none');
                setTimeout(function () { alert.classList.add('d-none') }, 5000);
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
                const alert = document.querySelector('.follow_alert');
                alert.classList.remove('d-none');
                setTimeout(function () { alert.classList.add('d-none') }, 5000);
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
            if (likeData.message === "like success") {
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
            if (dislikeData.message === "dislike success") {
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

//clone left_side for responsive
export function showPostContainer() {
    const postContainer = document.querySelector(".post-container_template");
    postContainer.style.zIndex = 10080;
}

export function copyToClipboard() {
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