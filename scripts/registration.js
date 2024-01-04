'use strict';

// Execute code when window loads + gather sign up form by ID 
window.onload = () => {
    const signUpForm = document.getElementById('signupForm');
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();
        signUpUser();
    });
}
// Base URL for the API
const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
const endPoint = "/api/users"

// Function to handle User Sign-Up form
async function signUpUser() {
    const fullName = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('cpassword').value;
    const message = document.getElementById('messageAlert');
    const loadingSpinner = document.getElementById('loadingSpinner');

// Front-end Validation
    if (!validateInputs(username, password, confirmPassword)){
        return;
    }
// Display Loading Spinner
    loadingSpinner.style.display='block';

// Check if passwords match confirmed password
    if (password !== confirmPassword) {
        // Display alert for password mismatch
        const confirm_password_alert = document.createElement('div');
        confirm_password_alert.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Password does not match!
        </div>`
        message.appendChild(confirm_password_alert);

        // Reload page after delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            window.location.reload()
        }, 2000);
        return;
    }

    // Create an object with user input for the API Request Body
    const inputBody = {
        username: username,
        fullName: fullName,
        password: password,
    }

    try {
        // Make a POST request to the user registration endpoint
        const postRequest = await fetch(`${apiBaseURL}/api/users`, {
            method: "POST",
            headers: {
             "Content-type": 'application/json'
            },
            body: JSON.stringify(inputBody)
        });

        // Check if registration was not Successful
        if (!postRequest.ok) {
            console.log("Registration Incomplete")

            //Display alert if username is already taken
            const username_taken_alert = document.createElement('div');
            username_taken_alert.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Username is already taken!
            </div>`
            message.appendChild(username_taken_alert)

            //Reload page after delay
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
                window.location.reload()
            }, 2000);
        } else {
            // Display Success Message for User Registration
            const username_success_alert = document.createElement('div');
            username_success_alert.innerHTML = `
            <div class="alert alert-success" role="alert">
                User registration created successfully!
            </div>`
            message.appendChild(username_success_alert);

             // Clear form fields after successful registration
            signUpForm.reset();

            // Redirect to the index page after a delay
            setTimeout(() => {
                loadingSpinner.style.display='none';
                window.location.href = '/index.html'
            }, 2000);
        }

    } catch (error) {
        // Log any errors that occur during API to document
        console.log("An error occurred during registration:", error);
        // Display a generic error message to the user
        const generic_error_alert = document.createElement('div');
        generic_error_alert.innerHTML = `
        <div class="alert alert-danger" role="alert">
            An unexpected error occurred. Please try again later.
        </div>`;
        message.appendChild(generic_error_alert);

        // Hide loading spinner and reload page after delay
        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            window.location.reload();
        }, 2000);
    }
}

function validateInputs(username, password, confirmPassword) {
    // Check if the username and password meet the minimum length requirement
    const minUsernameLength = 6;
    const minPasswordLength = 6;

    const isUsernameValid = username.length >= minUsernameLength;
    const isPasswordValid = password.length >= minPasswordLength;

    // Check if both username and password are valid
    if (isUsernameValid && isPasswordValid) {
        return true;
    } else {
        // Display an alert for invalid input
        const invalidInputAlert = document.createElement('div');
        invalidInputAlert.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Username and password must be at least ${minUsernameLength} characters long.
        </div>`;
        const message = document.getElementById('messageAlert');
        message.appendChild(invalidInputAlert);

        return false;
    }
}