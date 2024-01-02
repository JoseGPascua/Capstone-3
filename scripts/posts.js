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

async function displayUserProfileInfo() {
    const userInfo = await getUserData();
    console.log(userInfo);
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
                        <div class="post-liked">
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
    // <div class="post-top-info">
    // <div class="post-info">
    // <img src="https://placehold.co/50" alt="" />
    // </div>
    // <div class="post-info">
    // <p class="post-username">${item.username}</p>
    // </div>
    // <div class="post-info">
    // <p class="post-date">${newPostDate}</p>
    // </div>
    // </div>
    // <div class="post-text">
    // <p>${item.text}</p>
    // </div>
    // <div class="post-icons">
    // <div class="post-liked">
    // <img src="/assets/liked-heart.png" alt="" />
    // </div>
    // </div>
    


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


