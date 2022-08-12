document.addEventListener('DOMContentLoaded', function() {

    const newsSection = document.querySelector('#news-section')

    // GET news
    fetch(`${region}/news`)
    .then(response => response.json())
    .then(news => {
        news.forEach(news_item => {
            const element = document.createElement('div')
            element.innerHTML = `@${news_item.author.username}: "${news_item.text}"`
            newsSection.append(element)
        })
    })


})