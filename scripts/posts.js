"use strict";
window.onload = () => {

    getLoginData();
    displayPosts()
}
function getLoginData() {
    const loginDataString = window.localStorage.getItem('login-data');
    return loginDataString ? JSON.parse(loginDataString) : null;
}

// function fetchPosts() {
//     const loginData = getLoginData();

//     if (!loginData || !loginData.token) {
//         console.error('User not logged in.');
//         return;
//     }

//     const options = {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${loginData.token}`,
//         },
//     };

//     fetch(apiBaseURL + "/api/posts", options)
//         .then(response => response.json())
//         .then(posts => displayPosts(posts))
//         .catch(error => console.error('Error fetching posts:', error));
// }

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

    const postsContainer = document.getElementById('posts-container');

    if (postData.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    postData.forEach(item => {
        const createPostDiv = document.createElement('div');
        createPostDiv.innerHTML = `
            <h3>${item.username}</h3>
            <p>${item.text}</p>
            <hr>
            `
            postsContainer.appendChild(createPostDiv)
    })
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


