import { setPostsOfUser, hidePostContainer } from '../ui/post-ui.js';
import { setPostsOfStation, goToPost, starClick, showPostContainer } from '../ui/station-ui.js';
//toStations && createPost
export async function goToStation(stationId) {
    const res = await fetch(`/stations/${stationId}/posts`);
    const { stations, posts } = await res.json();
    setPostsOfUser(posts)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;

    document.querySelector('.second_row_btn').classList.remove("d-none")

    hidePostContainer();
    if (stations.length > 0) {
        document.querySelector('.station_name').innerText = stations[0].name;
    }

    if (postId != null) {
        await goToPost(postId, page);
        showPostContainer();
        starClick(postId); //favourite post (C+D)
    }
    // getStationsPost
    setPostsOfStation(stations[0], posts);
    document.querySelector('.post_replies').classList.remove('d-none');
}

//toHitStations && createPost
export async function goToHitStation(stationId) {
    const res = await fetch(`/stations/${stationId}/hit-posts`);
    const { stations, hitStation } = await res.json();

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    const page = urlParams.get('page') || 1;

    document.querySelector('.second_row_btn').classList.remove("d-none")

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