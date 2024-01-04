"use strict";

window.onload = () => {
    getLoginData();
    fetchUserProfile();
    showTab('posts');
    displayPosts();
    const editProfileLink = document.getElementById('editProfileLink');
    const profileEditForm = document.getElementById('profileEditForm');
    editProfileLink.addEventListener('click', (event) => {
    event.preventDefault();
    profileEditForm.style.display = (profileEditForm.style.display === 'none') ? 'block' : 'none';
    });

    const saveChangesBtn = document.getElementById('saveChanges');
    saveChangesBtn.onclick = () => {
        saveChanges();
    }
    const submitPost = document.getElementById('submitPost');
    submitPost.onclick = () => {
        createPostOnClick();
    }
};

function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}

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

async function saveChanges() {

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
        console.log('Data successfully updated:', data);
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('newBio').value = '';
        profileEditForm.style.display = 'none';
    } catch (error) {
        console.error('Error updating data:', error);

    }
};

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