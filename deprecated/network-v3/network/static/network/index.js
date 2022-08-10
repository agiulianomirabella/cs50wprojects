document.addEventListener('DOMContentLoaded', function() {

    postsSection = document.querySelector('#posts')

    fetch('/posts')
    .then(response => response.json())
    .then(posts => {

        console.log('Show posts.')

        posts.forEach(post => {

            // Create new element
            const element = document.createElement('div')
            element.style.borderStyle='groove'
            element.style.borderColor='#abb2b9'
                
            // Write author, text, timestamp and likes
            element.innerHTML = `
            @${post.author.username}: "${post.text}"
            <div style="float:right; color:grey";>
                ${post.timestamp} 
                ${post.likes_number} 
                <img width="15px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bot%C3%B3n_Me_gusta.svg/200px-Bot%C3%B3n_Me_gusta.svg.png">
            </div>
            `
            element.href = 
            // element.onclick = "{% url 'post' post.id %}"

            postsSection.append(element)
 
        })
    })

})
