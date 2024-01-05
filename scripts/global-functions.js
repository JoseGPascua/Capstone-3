
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

async function displayUserProfileInfo() {
    const userInfo = await getUserData();
    const profileInfo = document.getElementById('profileInfo');
    profileInfo.style.color = "#E7E9EA"
    profileInfo.innerHTML = `
    <span>${userInfo.username}</span>
    <span>${userInfo.fullName}</span>
    `
}

function generatePostHTML(post, isLikedByUser, time_createdAt) {
    const postDate = new Date(post.createdAt);
    const formattedDate = { month: 'short', day: 'numeric' };
    const newPostDate = postDate.toLocaleDateString('en-US', formattedDate);

    const createPostDiv = document.createElement('div');
    createPostDiv.className = 'posts-container my-2';
    createPostDiv.style.color = "#E7E9EA";
    createPostDiv.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-10 post-top-info">
                    <img src="${getRandomImage(imagesArray)}" alt="" />
                    <p class="post-username">${post.username}</p>
                </div>
                <div class="col-md-2 d-flex justify-content-end">
                    <div class="post-date"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="post-mid-section">
                        <div class="post-text">
                            <p>${post.text}</p>
                        </div>
                    </div>
                    <div class="post-bot-section">
                        <div class="post-icons">
                            <div class="liked-post" onclick="fetchPostID(this)" data-value="${post._id}">
                                <img class="heart-icon" src="${isLikedByUser ? '/assets/liked-heart-fill.png' : '/assets/liked-heart.png'}" alt="" />
                                <span>${post.likes.length > 0 ? post.likes.length : ""}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    createPostDiv.querySelector('.post-date').appendChild(time_createdAt);
    return createPostDiv;
}

async function displayPosts(posts, container, message) {
    const loggedInUserData = getLoginData();
    const loggedInUsername = loggedInUserData.username;

    const postsContainer = document.getElementById(container);
    // postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = `<p>${message}</p>`;
        return;
    }

    const currentTime = new Date();

    posts.forEach(post => {
        const postDate = new Date(post.createdAt);
        const timeDiff = currentTime - postDate;

        const time_createdAt = document.createElement('div');
        time_createdAt.className = 'post-date';

        if (timeDiff < 60000) {
            time_createdAt.innerHTML = 'Just now';
        } else if (timeDiff < 3600000) {
            const minutes = Math.floor(timeDiff / 60000);
            time_createdAt.innerHTML = `${minutes}m ago`;
        } else if (timeDiff < 86400000) {
            const hours = Math.floor(timeDiff / 3600000);
            time_createdAt.innerHTML = `${hours}h ago`;
        } else if (timeDiff < 172800000) {
            time_createdAt.innerHTML = 'Yesterday';
        } else {
            time_createdAt.innerHTML = newPostDate;
        }

        const isLikedByUser = post.likes.some(like => like.username === loggedInUsername);

        const postHTML = generatePostHTML(post, isLikedByUser, time_createdAt);
        postsContainer.appendChild(postHTML);
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
    const postContainer = document.getElementById('posts-content');
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
        postContainer.innerHTML = ''
        await displayAllPosts()
        // console.log('Post Liked');
    } catch (error) {
        console.log(error);
    }

}