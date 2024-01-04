"use strict";

window.onload = () => {

    showTab('posts');
    displayProfileData();
    displayMyPosts();
    displayLikedPosts();
    displayUserProfileInfo();
    const editProfileLink = document.getElementById('editProfileLink');
    const profileEditForm = document.getElementById('profileEditForm');
    const saveChangesBtn = document.getElementById('saveChanges');
    const submitPost = document.getElementById('submitPost');

    editProfileLink.addEventListener('click', (event) => {
    event.preventDefault();
    profileEditForm.style.display = (profileEditForm.style.display === 'none') ? 'block' : 'none';
    });

    saveChangesBtn.onclick = () => {
        saveChanges();
    }
    
    submitPost.onclick = () => {
        createPostOnClick();
    }
};

// Function to show and switch between tabs on profile page
function showTab(tabName) {
    document.querySelectorAll('.tab-pane').forEach(tab => {
        const isSelectedTab = tab.id === tabName;
        tab.classList.toggle('show', isSelectedTab);
        tab.classList.toggle('active', isSelectedTab);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        const isSelectedLink = link.getAttribute('href') === '#' + tabName;
        link.classList.toggle('active', isSelectedLink);
    });
}

async function displayProfileData() {
    try {
        const userInfo = await getUserData();
        document.getElementById("username").textContent = userInfo.username;
        document.getElementById("fullName").textContent = userInfo.fullName;
        document.getElementById("about").textContent = userInfo.bio;
    } catch (error) {
        console.error('Error displaying profile data:', error);
    }
}

async function saveChanges() {

    const newFullName = document.getElementById('newFullName').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const newBio = document.getElementById('newBio').value;
    const passwordMismatchError = document.getElementById('passwordMismatch');
    const loginData = getLoginData();
    const username = loginData.username;

    passwordMismatchError.style.display = 'none';

        
    if ((newPassword || confirmPassword) && newPassword !== confirmPassword) {
        passwordMismatchError.style.display = 'block';
        return;
    }

    const userData = {
        password: newPassword || undefined,
    };


    if (newBio.trim() !== '') {
        userData.bio = newBio;
    }

    if (newFullName.trim() !== '') {
        userData.fullName = newFullName;
    }

    const apiUrl = `${apiBaseURL}/api/users/${username}`;
    const options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify(userData)
    };

    try {
        
        const response = await fetch(apiUrl, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert('Data successfully updated:', data);
        document.getElementById('newFullName').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('newBio').value = '';
        profileEditForm.style.display = 'none';
    } catch (error) {
        console.error('Error updating data:', error);

    }
};

function generatePostHTML(post, isLikedByUser, time_createdAt) {
    const postDate = new Date(post.createdAt);
    const formattedDate = { month: 'short', day: 'numeric' };
    const newPostDate = postDate.toLocaleDateString('en-US', formattedDate);

    const createPostDiv = document.createElement('div');
    createPostDiv.className = 'posts-container w-100 my-2';
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
    postsContainer.innerHTML = '';

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

async function displayMyPosts() {
    const postData = await fetchPosts();
    displayPosts(
        postData.filter(item => item.username === getLoginData().username),
        'posts-content',
        'No posts available.'
    );
}

async function displayLikedPosts() {
    const allPosts = await fetchPosts();
    const loggedInUsername = getLoginData().username;
    const likedPosts = allPosts.filter(post =>
        post.likes.some(like => like.username === loggedInUsername)
    );
    displayPosts(
        likedPosts,
        'liked-posts-content',
        'No liked posts available for the logged-in user.'
    );
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
            if (response.ok) {
                console.log("POST HAS BEEN CREATED");
                post_container.innerHTML = '';
                post_container.insertAdjacentHTML('afterbegin', loading.outerHTML);
                await displayMyPosts();
            }
            
        } catch (error) {
            console.log('Error', error);
        }
    
    
    }