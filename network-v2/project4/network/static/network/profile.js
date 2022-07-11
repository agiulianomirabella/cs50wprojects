document.addEventListener('DOMContentLoaded', function() {
    const followButton = document.querySelector('#follow-button')

    console.log(logged_user === author)

    if (logged_user === author) {
        followButton.style.display = 'none'
    } else {
        followButton.style.display = 'block'
    }

    fetch('/users/'+logged_user)
    .then(response => {
        console.log(response)
    })
})