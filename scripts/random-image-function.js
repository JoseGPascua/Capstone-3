
const imagesArray = [
    { imagePath: '/assets/league-images/AatroxSquare.webp' },
    { imagePath: '/assets/league-images/AhriSquare.webp' },
    { imagePath: '/assets/league-images/AkaliSquare.webp' },
    { imagePath: '/assets/league-images/ApheliosSquare.webp' },
    { imagePath: '/assets/league-images/AsheSquare.webp' },
    { imagePath: '/assets/league-images/BlitzcrankSquare.webp' },
    { imagePath: '/assets/league-images/CaitlynSquare.webp' },
    { imagePath: '/assets/league-images/DariusSquare.webp' },
    { imagePath: '/assets/league-images/DravenSquare.webp' },
    { imagePath: '/assets/league-images/FizzSquare.webp' },
    { imagePath: '/assets/league-images/GwenSquare.webp' },
    { imagePath: '/assets/league-images/JhinSquare.webp' },
    { imagePath: '/assets/league-images/LuxSquare.webp' },
    { imagePath: '/assets/league-images/RenektonSquare.webp' },
    { imagePath: '/assets/league-images/RivenSquare.webp' },
]

function getRandomImage(_imagesArray) {
    const generateRandomNumber = Math.floor(Math.random() * _imagesArray.length)
    return _imagesArray[generateRandomNumber].imagePath;
}

