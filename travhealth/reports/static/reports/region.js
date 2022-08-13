document.addEventListener('DOMContentLoaded', function() {

    const newsSection = document.querySelector('#news-section')

    // GET news
    fetch(`${region}/news`)
    .then(response => response.json())
    .then(news => {
        news.forEach(news_item => {
            const element = document.createElement('div')
                element.innerHTML = `<p>@${news_item.author.username} from ${news_item.region}: "${news_item.text}"</p><hr>`
            newsSection.append(element)
        })
    })


})