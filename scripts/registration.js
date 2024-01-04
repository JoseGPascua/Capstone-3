'use strict';

window.onload = () => {
    const signUpForm = document.getElementById('signupForm');
    signUpForm.addEventListener('submit', (event) => {
        event.preventDefault();
        signUpUser();
    });
}

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
const endPoint = "/api/users"

async function signUpUser() {
    const fullName = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('cpassword').value;
    const messageAlert = document.getElementById('messageAlert');

    //Adding validation to password character check
    if (password.length < 6) {
        const password_character_check = document.createElement('div');
        password_character_check.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Password needs to be at least 6 characters!
        </div>`
        messageAlert.appendChild(password_character_check)
        setTimeout(() => {
            window.location.reload()
        }, "2000")
        return;
    }
    if (password !== confirmPassword) {
        const confirm_password_alert = document.createElement('div');
        confirm_password_alert.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Password does not match!
        </div>`
        messageAlert.appendChild(confirm_password_alert);
        setTimeout(() => {
            window.location.reload()
        }, "1000")
        return;
    }

    const inputBody = {
        username: username,
        fullName: fullName,
        password: password,
    }

    try {
        const postRequest = await fetch(`${apiBaseURL}/api/users`, {
            method: "POST",
            headers: {
               "Content-type": 'application/json'
            },
            body: JSON.stringify(inputBody)
        });

        if (!postRequest.ok) {
            console.log("Registration Incomplete")
            const username_taken_alert = document.createElement('div');
            username_taken_alert.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Username is already taken!
            </div>`
            messageAlert.appendChild(username_taken_alert)
            setTimeout(() => {
                window.location.reload()
            }, "1000")
        } else {
            const username_success_alert = document.createElement('div');
            username_success_alert.innerHTML = `
            <div class="alert alert-success" role="alert">
                User registration created successfully!
            </div>`
            messageAlert.appendChild(username_success_alert);

            setTimeout(() => {
                window.location.href = '/index.html'
            }, "1000")
        }

    } catch (error) {
        console.log(error);
    }
}
