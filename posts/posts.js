"use strict";

function fetchPostsOnClick() {
    const fetchButton = document.querySelector('.btn-primary');
    fetchButton.addEventListener('click', fetchPosts);
}

function fetchPosts() {
    const loginData = getLoginData();

    if (!loginData || !loginData.token) {
        console.error('User not logged in.');
        return;
    }

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/api/posts", options)
        .then(response => response.json())
        .then(posts => displayPosts(posts))
        .catch(error => console.error('Error fetching posts:', error));
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear previous posts

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.username}</h3>
            <p>${post.text}</p>
            <hr>
        `;
        postsContainer.appendChild(postElement);
    });
}

function getLoginData() {
    const loginDataString = window.localStorage.getItem('login-data');
    return loginDataString ? JSON.parse(loginDataString) : null;
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

// Call function to attach click event to fetch posts button
fetchPostsOnClick();

