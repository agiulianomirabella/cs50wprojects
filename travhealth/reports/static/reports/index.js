document.addEventListener('DOMContentLoaded', function() {

    const homeSection = document.querySelector("#home-section")
    const profileSection = document.querySelector("#profile-section")
    const newsSection = document.querySelector("#news-section")
    const mapSection = document.querySelector("#map-section")

    // Show TravHealth home
    document.querySelector("#home-button").onclick = () => {
        console.log("Show home section.")
        homeSection.style.display = "block"
        profileSection.style.display = "none"
        newsSection.style.display = "none"
        mapSection.style.display = "none"
    }


    // Show profile
    document.querySelector("#profile-button").onclick = () => {
        console.log("Show profile section.")
        homeSection.style.display = "none"
        profileSection.style.display = "block"
        newsSection.style.display = "none"
        mapSection.style.display = "none"
    }



    // Show News
    document.querySelector("#news-button").onclick = () => {
        homeSection.style.display = "none"
        console.log("Show news section.")
        profileSection.style.display = "none"
        newsSection.style.display = "block"
        mapSection.style.display = "none"
    }



    // Show map
    document.querySelector("#map-button").onclick = () => {
        console.log("Show map section.")
        homeSection.style.display = "none"
        profileSection.style.display = "none"
        newsSection.style.display = "none"
        mapSection.style.display = "block"
    }



})