# Welcome to Nexus Social Blog

## This project is built on the idea of creating a space for individuals to connect and interact with one another.

Welcome to Nexus, the social blog platform designed for IT students and interns to connect, collaborate, and be inspired. This README provides an overview of the features and structure of the Nexus website.

Nexus is a website built on HTML, CSS, Bootstrap, and Javascript, it contains a landing page where a user is able to login, and if they're already logged in they will be redirected to the posts page where they can see all posts. This website also contains a registration page, profile page, and lastly an about us page that features the contributors of the website!

## Samples of each page

# Landing Page
The landing page serves as the gateway to the Nexus community. This "walled-garden" is accesible once an account is created, or exsisting account is logged in.

<img src="/assets/landing-page.PNG" alt="home page" width=400px>

# About Page 
Learn more about the mission and vision behind Nexus on the About page. Meet our intern group, understand our values, and get inspired to contribute to the collaborative atmosphere we aim to cultivate.
 
![Screenshot](assets/#.png)

# Profile Page
Every Nexus member has a personalized Profile page. This page is your space to share your journey, projects, and skills with the Nexus community.

<img src="/assets/profile-page.PNG" alt="home page" width=400px>

# Registration Page 
To become a part of the Nexus community, visit our Registration page. Create your account, provide some basic information, and get started.
 
<img src="/assets/registrationpage.png" alt="home page" width=400px>
# Posts Page 
The heart of Nexus lies in the Posts page. Here, IT students and interns can share their insights, experiences, and knowledge. Engage in discussions, provide feedback, and explore a wealth of information contributed by the Nexus community.
 
<img src="/assets/post-page.PNG" alt="home page" width=400px>

## An interesting piece of Javascript

```javascript
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
```

# Authors

* Michael Nguyen
* Jose Pascua
* Kayla McHenry
* Nicolas Foong

# Acknowledgements

* Year Up Staff
* Year Up Classmates
* Remsey Mailjard (Instructor)
* Pluralsight
* Learn To Code Academy
* League of Legends

# License
Nexus is licensed under the MIT License. Feel free to use, modify, and distribute the code as per the terms of the license.

Thank you for being a part of Nexus, where the IT community comes together to thrive!
  
