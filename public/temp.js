async function goToStation(stationId) {
    const res = await fetch(`/stations/${stationId}/posts`);
    const { stations, posts } = await res.json();

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;

    //hidePostContainer();
    if (stations.length > 0) {
        document.querySelector('.station_name').innerText = stations[0].name;
    }

    goToPost(postId, page);
    //starClick(postId); //favourite post (C+D)

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
                //showPostContainer();
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
            showTimePassed = parseInt(timePassed / 31104000) + '??????'
        } else if (timePassed > 2592000) {
            showTimePassed = parseInt(timePassed / 2592000) + '??????'
        } else if (timePassed > 86400) {
            showTimePassed = parseInt(timePassed / 86400) + '??????'
        } else if (timePassed > 3600) {
            showTimePassed = parseInt(timePassed / 3600) + '?????????'
        } else if (timePassed > 60) {
            showTimePassed = parseInt(timePassed / 60) + '?????????'
        } else {
            showTimePassed = parseInt(timePassed) + '??????'
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
    return `???${pageNumber}???`;
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
        //showPostContainer();
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

function setRepliesOfPage(title, replies, pageSize, currentPage) {
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
            console.log("replyID:", userID);
        })

        const leaveUserDetail = replyClone.querySelector('.leave_userDetail_btn');
        leaveUserDetail.addEventListener('click', () => {
            userDetailContent.classList.add("d-none");
        })

        replyTemplate.appendChild(replyClone);
    }
}

export {
    goToStation,
};