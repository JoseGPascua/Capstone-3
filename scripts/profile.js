"use strict";

window.onload = () => {

    showTab('posts');
    displayProfileData();
    likeAPost();
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
        const myPostContainer = document.getElementById('posts-content')
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
                myPostContainer.innerHTML = ''
                await displayMyPosts();
            }
            
        } catch (error) {
            console.log('Error', error);
        }
    
    
    }