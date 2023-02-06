import { getPageName } from "./util.js";
export function setPostsOfUser(posts) {
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

export function hidePostContainer() {
    const postContainer = document.querySelector(".post-container_template");
    postContainer.style.zIndex = 0;
}

export async function setTabButtons(stationId) {
    const newestButtons = document.querySelectorAll(".second_row_div .newest_btn");
    const hitButtons = document.querySelectorAll(".second_row_div .hit_btn");

    console.log(newestButtons)
    console.log(hitButtons)

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
