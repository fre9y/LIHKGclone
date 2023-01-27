//test logout
import { logout } from './user.js';
let logoutButton = document.querySelector('.create_post_btn');
logoutButton.addEventListener('click', () => {
    console.log('click_logout');
    logout();
});

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

//profile
async function checkSession() {
    let res = await fetch('/user/profile', {
        method: 'GET'
    })
    if (!res.ok) {
        window.location = "/connect/google"
    } else {
        window.location = "/userProfile.html"
    }
}

let profileIcon = document.querySelector(".profile")
profileIcon.addEventListener('click', () => {
    checkSession();
})

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
    const res = await fetch(`/stations/${stationID}/posts`);
    let data = await res.json();

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

    // getStationsPost
    for (let x = 0; x < data.posts.length; x++) {
        const postClone = post.cloneNode(true);
        postClone.addEventListener('click', async (e) => {
            e.preventDefault();

            const res = await fetch(`/post/${data.posts[x].id}/replies`);
            const parsed = await res.json();
            const replies = parsed.replies;
            const postForReply = parsed.posts;

            replyTemplate.innerHTML = "";

            for (let r = 0; r < replies.length; r++) {
                const replyClone = reply.cloneNode(true);
                const nicknameElement = replyClone.querySelector('.user_nickname_btn');
                const contentElement = replyClone.querySelector(".reply_second_row");
                const likeElement = replyClone.querySelector(".reply_like");
                const dislikeElement = replyClone.querySelector(".reply_dislike");
                const postTitleForReply = document.querySelector('.post_first_row .post_title');

                replyClone.querySelector('.reply_num').innerText = r + 1;

                console.log(replies[0])
                //user_nickname
                nicknameElement.innerText =  replies[r].nickname;
                contentElement.innerHTML = replies[r].content;
                likeElement.innerText = replies[r].likes;
                dislikeElement.innerHTML = replies[r].dislikes;
                postTitleForReply.innerText = postForReply[0].post_title;

                replyTemplate.appendChild(replyClone);
            }
        })
        let postLinkNode = postClone.setAttribute("href", `/post/${data.posts[x].id}/replies`);

        //post-link

        // if (!post.isTrending) {
        //     postClone.querySelector(".lightning_icon i").style.display = "none";
        // }

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
        // let createTime = postClone.querySelector('.post_created_time');
        // let createTimeText = data.posts[x].created_at;
        // createTime.innerText = createTimeText;

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

        //post-pages
        // post database need count replies and pages
        // let postSelect = postClone.querySelector("select");
        // postSelect.addEventListener('click', (e) => {
        //     e.preventDefault();
        // })
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
    images = data.images;

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
