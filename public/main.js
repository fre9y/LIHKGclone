//clone left_side for responsive
(() => {
    const cloneNode = document.querySelector(".left_side .second_row_div");

    const leftSideClone = cloneNode.cloneNode(true);
    document.querySelector(".mobile_vision").appendChild(leftSideClone);
    console.log(cloneNode.childNodes);
    const cloneNav = cloneNode.childNodes[1];
    // console.log(cloneNav.childNodes)
})();

//profile
let profileIcon = document.querySelector(".profile")

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
        window.history.pushState({}, '', 'stations?stationsID=' + stationID);
        toStations();
    })
};
//toStations && createPost
async function toStations() {
    let urlParams = new URLSearchParams(window.location.search);
    const stationsID = urlParams.get('stationsID');

    const res = await fetch(`/stations?stationsID=${stationsID}`);
    let data = await res.json();
    console.log(data.posts);

    for await (let station of data.stations) {
        document.querySelector('.station_name').innerText = station.name;
    }

    // getStationsPost
    for (let x = 0; x < data.posts.length; x++) {
        const template = document.querySelector(".post_template");
        const post = template.querySelector(".post");//.hidden
        const mobileVision = document.querySelector(".mobile_vision");

        const postClone = post.cloneNode(true);

        //post-link
        let postLinkNode = postClone.setAttribute("href", `/stations?stationsID=${stationsID}/page/1`);

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
        // let postLike = postClone.querySelector(".like");
        // let likeNUM = data.posts[x]. ;
        // postLike.innerText = likeNUM

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

