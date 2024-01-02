"use strict";

window.onload = () => {
    getLoginData();
    displayPosts()
    fetchUserProfile();
};

function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

async function fetchUserProfile() {
    if (!isLoggedIn()) {
        console.error("User is not logged in.");
        return;
    }

    const loginData = getLoginData();
    const username = loginData.username;
    const userProfileEndpoint = `/api/users/${username}`

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    try {
        const response = await fetch(apiBaseURL + userProfileEndpoint, options);
        if (!response.ok) {
            throw new Error('Request failed')
        }
        const data = await response.json();
        displayProfileData(data);

    }
    catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

function displayProfileData (data) {
    document.getElementById("username").textContent = data.username;
    document.getElementById("fullName").textContent = data.fullName;
    document.getElementById("about").textContent = data.bio;
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

async function displayPosts() {
    const postData = await fetchPosts();
    const loggedInUserData = getLoginData();
    const loggedInUsername = loggedInUserData.username;
    
    const postsContainer = document.getElementById('posts-content');
    postsContainer.innerHTML = ''; // Clear previous content

    if (postData.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    const userPosts = postData.filter(item => item.username === loggedInUsername);

    if (userPosts.length === 0) {
        postsContainer.innerHTML = '<p>No posts available for the logged-in user.</p>';
        return;
    }
    
    
    userPosts.forEach(item => {

        let postDate = new Date(item.createdAt);
        let formattedDate = { month: 'short', day: 'numeric' };
        let newPostDate = postDate.toLocaleDateString('en-US', formattedDate)

        const createPostDiv = document.createElement('div');
        createPostDiv.className = 'posts-container w-100 my-2'
        createPostDiv.style.color = "#E7E9EA"
        createPostDiv.innerHTML = `
        <div class="container">
        <div class="row">
            <div class="col-md-10 post-top-info">
                <img src="https://placehold.co/50" alt="" />
                <p class="post-username">${item.username}</p>
            </div>
            <div class="col-md-2 d-flex justify-content-end">
                <p class="post-date">${newPostDate}</p>
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
                        <div id="post-liked" value="${item._id}">
                            <img src="/assets/liked-heart.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
            `
            postsContainer.appendChild(createPostDiv)
        })
    }
