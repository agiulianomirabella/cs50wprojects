document.addEventListener('DOMContentLoaded', function() {

    const homeSection = document.querySelector("#home-section")
    const profileSection = document.querySelector("#profile-section")
    const newsSection = document.querySelector("#news-section")
    const mapSection = document.querySelector("#map-section")

    // Show home
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

        newsSection.innerHTML = ''

        // GET news
        fetch(`news`)
        .then(response => response.json())
        .then(news => {
            news.forEach(news_item => {
                const element = document.createElement('div')
                element.innerHTML = `@${news_item.author.username} from ${news_item.region}: "${news_item.text}"`
                newsSection.append(element)
            })
        })

        console.log("Show news section.")
        homeSection.style.display = "none"
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