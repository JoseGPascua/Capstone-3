"use strict";


window.onload = () => {
    getLoginData();
    displayPosts()
    displayUserProfileInfo();
    likeAPost();
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
    const post_container = document.getElementById('posts-content');
    const loading = document.querySelector('.loading-container')
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
            post_container.insertAdjacentHTML('afterbegin', loading.outerHTML);
            await displayPosts();
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

async function displayPosts() {
    const loginData = getLoginData();
    const postsContainer = document.getElementById('posts-content');
    const postData = await fetchPosts();
    console.log(postData);

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
        
        // checking if post is liked or not;
        const postLikes = item.likes;
        //returns true if likes.username === logindata.username
        const isLikedByUser = postLikes.find(object => object.username.includes(loginData.username))

        const createPostDiv = document.createElement('div');
        // console.log(createPostDiv);
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
                                <div class="liked-post" onclick="fetchPostID(this)" data-value="${item._id}">
                                <img src="${isLikedByUser ? '/assets/liked-heart-fill.png' : '/assets/liked-heart.png'}" alt="" />
                                <span>${item.likes.length}</span>
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

async function fetchPostID(_postId) {
    const usersLoginData = getLoginData();
    const postID = _postId.getAttribute('data-value');
    // console.log(postID);
    //fetch post with GET request
    try {
        const post = await fetch(`${apiBaseURL}/api/posts/${postID}`, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${usersLoginData.token}`,
                "Content-Type": "application/json",
            },
        })
    
        if (!post.ok) {
            throw new Error('Cannot find post')
        }
        const postData = await post.json();
        likeAPost(postData)

    } catch (error) {
        console.log('Fetch request failed', error);
    }
}

async function likeAPost(_postData) {
    const loginData = getLoginData();
    const postData = _postData
    const postLike_ID = postData._id
    console.log(postData);

    const inputBody = {
        postId: postLike_ID
    }
    try {
        // Post request to like a post
        const response = await fetch(`${apiBaseURL}/api/likes`, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${loginData.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputBody)
        })
        if (!response.ok) {
            throw new Error('POST request failed')
        }
        console.log('Post Liked');
    } catch (error) {
        console.log(error);
    }

}

// Right side content functions
async function sortByMostLikes() {
    const loginData = getLoginData();
    const mostLikedSection = document.getElementById('mostlikedpost-container');
    let postLimit = 50
    const allPostResponse = await fetch(`${apiBaseURL}/api/posts?limit=${postLimit}&offset=0`, {
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

    const createDivElement = document.createElement('div');
    

}

sortByMostLikes();

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


