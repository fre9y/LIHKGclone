let profileIcon = document.querySelector(".profile")

async function checkSession() {
    let res = await fetch('/user/profile', {
        method: 'GET'
    })
    if (!res.ok) {
        window.location = "/connect/google"
    } else {
        window.location = "/profile.html"
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

async function toStations() {
    let urlParams = new URLSearchParams(window.location.search);
    const stationsID = urlParams.get('stationsID');

    const res = await fetch(`/stations?stationsID=${stationsID}`);
    let data = await res.json();
    for await (let station of data.stations) {
        document.querySelector('.station_name').innerText = station.name;
    }

    // getStationsPost
    // for (let x = 0; x <= data.posts['length']; x++) {
    //     let postContainer = document.querySelector('.current_stations_posts_container');
    //     let createDivEle = document.createElement("div");
    //     let post_title_text = data.posts[x]["post_title"];
    //     let post_title_textNode = document.createTextNode(post_title_text);

    //     createDivEle.appendChild(post_title_textNode);
    //     postContainer.appendChild(createDivEle);
    // }

    for (let x = 0; x <= data.posts['length']; x++) {
        let postContainer = document.querySelector('.current_stations_posts_container');
        let createDivEle = document.createElement("div");
        let post_title_text = data.posts[x]["post_title"];
        let post_title_textNode = document.createTextNode(post_title_text);
        let createAttrForTitle = document.createAttribute('class');

        createAttrForTitle.value = 'current_posts_title';
        createDivEle.appendChild(post_title_textNode);
        createDivEle.setAttributeNode(createAttrForTitle);
        postContainer.appendChild(createDivEle);
    }
};
