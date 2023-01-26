//test logout
import { logout } from './user.js';
let logoutButton = document.querySelector('.create_post_btn');
logoutButton.addEventListener('click', () => {
    console.log('click_logout');
    logout();
});

let getOthersButton = document.querySelector('.user_nickname');
getOthersButton.addEventListener('click', () => {  
    console.log('click_getOthers');
    getOthersByID();   
});



//clone left_side for responsive
(() => {
    const cloneNode = document.querySelector(".left_side .second_row_div");

    const leftSideClone = cloneNode.cloneNode(true);
    document.querySelector(".mobile_vision").appendChild(leftSideClone);

    let pathname = window.location.pathname
    const words = pathname.split('/');

    if (words.length > 0) {
        stationID = words[words.length - 1]
        toStations(stationID)
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
async function toStations(stationsID) {
    // let urlParams = new URLSearchParams(window.location.search);
    // const stationsID = urlParams.get('stationsID');

    const res = await fetch(`/stations?stationsID=${stationsID}`);
    let data = await res.json();

    const template = document.querySelector(".post_template");

    const templateSample = document.querySelector(".post_template_sample");
    const post = templateSample
        .querySelector(".post");//.hidden
    const mobileVision = document.querySelector(".mobile_vision");
    if (res.ok) {
        template.innerHTML = ""
    }

    // getStationsPost
    for (let x = 0; x < data.posts.length; x++) {
        const postClone = post.cloneNode(true);

        let postLinkNode = postClone.setAttribute("href", `/stations?stationsID=${stationsID}/page/1`);
        postClone.querySelector('.post_station ').innerText = data.stations[0].name;

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
        // if (data.post[x]. = 100) {
        //     const option = document.createElement("option");
        //     option.innerText = `${} 頁`;
        //     option.value = ;

        //     postClone.querySelector("select").appendChild(option);
        // }
        // postSelect.value = ;
        // postSelect.addEventListener("change", () => {
        //     document.location = `/stations?stationsID=${stationsID}/page/${}`
        // })

        //posts-title
        let postTitle = postClone.querySelector('.post_title');
        let postTitleText = data.posts[x].post_title;
        postTitle.innerText = postTitleText;

        //posts-stations Btn
        // let postStationsBtn = postClone.querySelector('post_stations_btn');
        // let postStationsBtnText = data.posts[x].;
        // postStationsBtn.innerText = postStationsBtnText;
        // postStationsBtn.setAttribute("href", `/stations?stationsID=${stationsID}`);
        // let postStationsBtnLink = postStationsBtn.createElement("a");
        // postStationsBtnLink.setAttribute("href", `/stations?stationsID=${stationsID}`);

        //posts-stations Btn replace post-link
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
    // const res = await fetch(`/post/1/media`);
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

