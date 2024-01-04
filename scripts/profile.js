"use strict";

window.onload = () => {

    getUserData();
    showTab('posts');
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

// Function to grab user profile information
// async function fetchUserProfile() {
//     if (!isLoggedIn()) {
//         console.error("User is not logged in.");
//         return;
//     }

//     const loginData = getLoginData();
//     const username = loginData.username;
//     const userProfileEndpoint = `/api/users/${username}`

//     const options = {
//         method: "GET",
//         headers: {
//             Authorization: `Bearer ${loginData.token}`,
//         },
//     };

//     try {
//         const response = await fetch(apiBaseURL + userProfileEndpoint, options);
//         if (!response.ok) {
//             throw new Error('Request failed')
//         }
//         const data = await response.json();
//         displayProfileData(data);

//     }
//     catch (error) {
//         console.error("Error fetching profile data:", error);
//     }
// }

function displayProfileData (data) {
    document.getElementById("username").textContent = data.username;
    document.getElementById("fullName").textContent = data.fullName;
    document.getElementById("about").textContent = data.bio;
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

async function displayMyPosts() {
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
                        <img src="${getRandomImage(imagesArray)}" alt="" />
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

async function displayLikedPosts() {
        const allPosts = await fetchPosts();
        const loggedInUserData = getLoginData();
        const loggedInUsername = loggedInUserData.username;
        
        const likedPostsContainer = document.getElementById('liked-posts-content');
        likedPostsContainer.innerHTML = '';
    
        if (allPosts.length === 0) {
            likedPostsContainer.innerHTML = '<p>No posts available.</p>';
            return;
        }
    
        const likedPosts = allPosts.filter(post => {
            return post.likes.some(like => like.username === loggedInUsername);
        });
    
        if (likedPosts.length === 0) {
            likedPostsContainer.innerHTML = '<p>No liked posts available for the logged-in user.</p>';
            return;
        }
        
        likedPosts.forEach(post => {
    
            let postDate = new Date(post.createdAt);
            let formattedDate = { month: 'short', day: 'numeric' };
            let newPostDate = postDate.toLocaleDateString('en-US', formattedDate);
    
            const createPostDiv = document.createElement('div');
            createPostDiv.className = 'liked-posts-container w-100 my-2';
            createPostDiv.style.color = "#E7E9EA";
            createPostDiv.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-md-10 post-top-info">
                        <img src="${getRandomImage(imagesArray)}" alt="" />
                        <p class="post-username">${post.username}</p>
                    </div>
                    <div class="col-md-2 d-flex justify-content-end">
                        <p class="post-date">${newPostDate}</p>
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
                                <div id="post-liked" value="${post._id}">
                                    <img src="/assets/liked-heart.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            likedPostsContainer.appendChild(createPostDiv);
        });
    }