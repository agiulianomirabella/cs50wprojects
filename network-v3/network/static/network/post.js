document.addEventListener('DOMContentLoaded', function() {

    fetch('/posts/'+post_id)
    .then(response => response.json())
    .then(post => {

        console.log('Show post '+post_id)

    })

})
