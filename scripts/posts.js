"use strict";


window.onload = () => {
    getLoginData();
    displayAllPosts()
    displayUserProfileInfo();
    likeAPost();
    sortByMostLikes();
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
        const response = await fetch(apiBaseURL + "/api/posts?limit=" + postsLimit + "&offset=0", options);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Fetch Failed', error);
    }
}

async function createPostOnClick() {
    const post_container = document.getElementById('posts-content');
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
        if (response.ok) {
            console.log("POST HAS BEEN CREATED");
            post_container.innerHTML = '';
            await displayAllPosts();
        }
        
    } catch (error) {
        console.log('Error', error);
    }
}

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
        <h1> Welcome, ${userInfo.fullName}</h1>`
}

async function displayAllPosts() {
    const allPosts = await fetchPosts();
    const filterUsername = allPosts.filter(obj => obj.username !== "string");
    displayPosts(
        filterUsername,
        'posts-content',
        'No posts available.'
    );
}

// Right side content functions
async function sortByMostLikes() {
    const loginData = getLoginData();
    const mostLikedSection = document.getElementById('mostlikedpost-section');
    let postLimit = 100
    const allPostResponse = await fetch(`${apiBaseURL}/api/posts?limit=${postLimit}`, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loginData.token}`,
            "Content-Type": "application/json",
        },
    })

    const allPostData = await allPostResponse.json();
    const sortByMostLikes = allPostData.sort((a, b) => b.likes.length - a.likes.length)
    console.log(sortByMostLikes);
    const filterUsername = sortByMostLikes.filter(item => item.username !== "string" && item.likes.length > 0)
    filterUsername.forEach(user => {
        const createDivElement = document.createElement('div');
        createDivElement.className = "likedpost-container"
        createDivElement.innerHTML = `
        <div class="container">
            <div class="row">
            <div class="col-lg-9 col-sm-12 col-md-9 w-75 right-content-mid">
                <img src="${getRandomImage(imagesArray)}" alt="" />
                <h3>${user.username}<h3>
            </div>
            <div class="col-lg-3 col-sm-12 col-md-9 right-content-bot">
                <div class="bottom-section">
                    <img src='/assets/liked-heart.png' alt="" />
                    <span>${user.likes.length}</span>
                </div>
            </div>
            </div>
        </div>`
            
        mostLikedSection.appendChild(createDivElement)
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


