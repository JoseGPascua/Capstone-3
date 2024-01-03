"use strict";

window.onload = () => {
    getLoginData();
    displayPosts()
    displayUserProfileInfo();
    const submitPost = document.getElementById('submitPost');
    submitPost.onclick = () => {
        createPostOnClick();
    }
}

function getLoginData() {
    const loginDataString = window.localStorage.getItem('login-data');
    // console.log(loginDataString);
    return loginDataString ? JSON.parse(loginDataString) : null;
}

async function fetchPosts() {
    const loginData = getLoginData();
    let postsLimit = 15;

    if (!loginData || !loginData.token) {
        console.error('User not logged in.');
        return
    }

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };
    try {
        const response = await fetch(apiBaseURL + "/api/posts?limit=" + postsLimit, options);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Fetch Failed', error);
    }
}

async function getUserData() {
    const loginData = getLoginData();
    console.log(loginData);
    if (!loginData || !loginData.token) {
        console.error('User not logged in.');
        return
    }
    const userData = loginData.username;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };
    try {
        const response = await fetch(apiBaseURL + "/api/users/" + userData, options);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Fetch Failed', error);
    }
}

async function createPostOnClick() {
    const loginData = getLoginData(); 
    const newPost = document.getElementById('createAPost');

    const inputData = {
        text: newPost.value
    }

    const options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`
        },
        body: JSON.stringify(inputData)
    }

    try {
        const response = await fetch(apiBaseURL + "/api/posts/", options)
        const result = await response.json()
        window.location.reload();
        // alert('Post Successful')

    } catch (error) {
        console.log('Error', error);
    }
}
// function likePostHandler() {
//     const likePost = document.getElementById('post-liked').getAttribute('data-postId');
//     console.log(likePost);
// }

// likePostHandler();

async function displayUserProfileInfo() {
    const userInfo = await getUserData();
     const profileInfo = document.getElementById('profileInfo');
     const welcomeUser = document.getElementById('welcome-container');
    welcomeUser.style.color = "#E7E9EA"
    profileInfo.style.color = "#E7E9EA"
    profileInfo.innerHTML = `
    <span>${userInfo.username}</span>
    <span>${userInfo.fullName}</span>
        `
    welcomeUser.innerHTML = `
        <h1> Welcome ${userInfo.fullName}</h1>`
}

async function displayPosts() {
    const postData = await fetchPosts();
    console.log(postData);
    const postsContainer = document.getElementById('posts-content');

    if (postData.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    postData.forEach(item => {

        //TODO converting date to minutes, hours, days
        const postDate = new Date(item.createdAt);
        const currentDate = new Date();
        const time = currentDate - postDate;

        const time_createdAt = document.createElement('div');
        time_createdAt.className = 'post-date';

        let formattedDate = { month: 'short', day: 'numeric' };
        let newPostDate = postDate.toLocaleDateString('en-US', formattedDate);

        if (time < 60000) {
            time_createdAt.innerHTML = 'Just now';
        } else if (time < 3600000) {
            const minutes = Math.floor(time / 60000);
            time_createdAt.innerHTML = `${minutes}m ago`;
        } else if (time < 86400000) {
            const hours = Math.floor(time / 3600000);
            time_createdAt.innerHTML = `${hours}h ago`;
        } else if (time < 172800000) {
            time_createdAt.innerHTML = 'Yesterday';
        } else {
            time_createdAt.innerHTML = newPostDate;
        }

        const createPostDiv = document.createElement('div');
        createPostDiv.className = 'posts-container w-100 my-2';
        createPostDiv.style.color = '#E7E9EA';
        createPostDiv.innerHTML = `
                <div class="container">
                <div class="row">
                    <div class="col-md-10 post-top-info">
                        <img src="https://placehold.co/50" alt="" />
                        <p class="post-username">${item.username}</p>
                    </div>
                    <div class="col-md-2 d-flex justify-content-end">
                        <div class="post-date">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="post-mid-section">
                            <div class="post-text">
                                <p>${item.text}</p>
                            </div>
                        </div>
                        <div class="post-bot-section">
                            <div class="post-icons">
                                <div id="post-liked" data-postId=${item._id}>
                                    <img src="/assets/liked-heart.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        createPostDiv.querySelector('.post-date').appendChild(time_createdAt);
        postsContainer.appendChild(createPostDiv);
    });
}


function logout() {
    const loginData = getLoginData();

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            window.localStorage.removeItem("login-data");
            window.location.assign("/");
        });
}


