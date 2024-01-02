"use strict";

window.onload = () => (
    fetchUserProfile()
);

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
        const response = await fetch(apiBaseURL + "/api/posts", options);
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
    console.log(postData);
    const postsContainer = document.getElementById('posts-content');

    if (postData.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }
    
    
    postData.forEach(item => {

        let postDate = new Date(item.createdAt);
        let formattedDate = { month: 'short', day: 'numeric' };
        let newPostDate = postDate.toLocaleDateString('en-US', formattedDate)

        const createPostDiv = document.createElement('div');
        createPostDiv.className = 'posts-container w-75 my-2'
        createPostDiv.style.color = "#7E7F9C"
        createPostDiv.innerHTML = `
        <div class="post-profile">
            <img src="https://placehold.co/50" alt="" />
            <h3 class=post-username">${item.username}</h3>
            <p class="post-date">${newPostDate}</p>
        </div>
        <div class="post-text">
        <p>${item.text}</p>
        </div>
        `
        postsContainer.appendChild(createPostDiv)
    })
}



