"use strict";

window.onload = () => (
    fetchUserProfile()
);

function getLoginData() {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}

function isLoggedIn() {
    const loginData = getLoginData();
    return Boolean(loginData.token);
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