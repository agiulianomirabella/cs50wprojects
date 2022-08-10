document.addEventListener('DOMContentLoaded', function() {
  
  // Layout buttons
  document.querySelector('#auth-profile-button').onclick = function() {
    view_profile(auth_user_id)
  }
  document.querySelector('#all-posts-button').onclick = view_posts

  // Auxiliary
  const newPostFormSection = document.querySelector('#new-post-section')
  const newPostForm = document.querySelector('#new-post-form')

  const postsSection = document.querySelector('#posts-section')
  const heading = document.querySelector('#posts-heading')
  const postsToShow = document.querySelector('#posts-posts')
  
  const postSection = document.querySelector('#post-section')
  const author = document.querySelector('#post-author')
  const text = document.querySelector('#post-text')
  const commentsSection = document.querySelector('#post-comments')
  
  const followButton = document.querySelector('#follow')
  const likeButton = document.querySelector('#like')
  const viewProfileButton = document.querySelector('#view-profile')
  
  function clean() {
    postsToShow.innerHTML = ''
    commentsSection.innerHTML = ''
  }

  // VIEW PROFILE

  function view_profile(user_id) {

    console.log(`Show profile ${user_id}.`)
    
    postsSection.style.display = 'block'
    postSection.style.display = 'none'
    newPostFormSection.style.display = 'none'
    
    clean()
    
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
    
      fetch('/users/'+user_id)
      .then(response => response.json())
      .then(user => {
      
      heading.innerHTML = `@${user.username}`
      
      posts.forEach(post => {
        
        if (post.author.username === user.username) {
          
          // Create a new element
          const element = document.createElement('div')
          
          // Write author, text, timestamp and likes
          element.innerHTML = `
          <b>${post.text}</b>
          <div style="float:right; color:grey";>${post.timestamp} ${post.likes|length} <img width="15px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bot%C3%B3n_Me_gusta.svg/200px-Bot%C3%B3n_Me_gusta.svg.png"></div>
          `

          // Custom element style
          element.style.borderStyle='groove'
          element.style.borderColor='#abb2b9'
          
          element.onclick = function() {
            view_post(post.id)
          }
                  
          postsToShow.append(element)
        }
      })

      // Change follow -> unfollow or viceversa
      var followed = false
      user.followers.forEach(function(value, index, array) {
        if (user.username === value.username){
          followed = true
        }
      })

      if (followed) {
        followButton.innerHTML = `Unfollow`
      } else {
        followButton.innerHTML = `Follow`
      }

      followButton.onclick = function() {
        fetch('/users/'+user_id+'/follow')
        .then(response => response.json())
        .then(user => {

          var followed = false
          user.followers.forEach(function(value, index, array) {
            if (user.username === value.username){
              followed = true
            }
          })
    
          if (followed) {
            followButton.innerHTML = `Unfollow`
          } else {
            followButton.innerHTML = `Follow`
          }
        })
      }
    })
  })  
}

  // VIEW POSTS

  function view_posts() {

    console.log(`Show all posts.`)
    
    postsSection.style.display = 'block'
    postSection.style.display = 'none'
    newPostFormSection.style.display = 'block'

    clean()
    
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
          
      heading.innerHTML = `Feed`
      
      posts.forEach(post => {
                  
        // Create a new element
        const element = document.createElement('div')

        // Write author, text, timestamp and likes
        element.innerHTML = `
        @${post.author.username}: "${post.text}"
        <div style="float:right; color:grey";>${post.timestamp} ${post.likes_number} <img width="15px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bot%C3%B3n_Me_gusta.svg/200px-Bot%C3%B3n_Me_gusta.svg.png"></div>
        `

        // Custom element style
        element.style.borderStyle='groove'
        element.style.borderColor='#abb2b9'
        
        element.onclick = function() {
          view_post(post.id)
        }
        
        postsToShow.append(element)
      })
    })
  }

  // VIEW POST

  function view_post(post_id) {
    
    console.log(`Show post ${post_id}.`)
    
    postsSection.style.display = 'none'
    postSection.style.display = 'block'
    newPostFormSection.style.display = 'none'
    
    fetch('/posts/'+post_id)
    .then(response => response.json())
    .then(post => {
      
      author.innerHTML = `@${post.author.username}`
      text.innerHTML = `${post.text}`

      fetch('/comments')
      .then(response => response.json())
      .then(comments => {
        comments.forEach(comment => {
          if (comment.post.id === post.id) {
            const element = document.createElement('div')
            element.innerHTML = `@${comment.author.username}: "${comment.text}"`
            commentsSection.append(element)
          }
        })
      })
      
      fetch('/users/'+auth_user_id)
      .then(response => response.json())
      .then(user => {

        // Check if auth user already liked the post
        var liked = false
        post.likes.forEach(function(value, index, array) {
          if (user.username === value.username){
            liked = true
          }
        }) 

        if (liked) {
          likeButton.innerHTML = `Dislike`
        } else {
          likeButton.innerHTML = `Like`
        }
        
        // Change the like of the post
        likeButton.onclick = function() {
          fetch('/posts/'+post_id+'/like')
          .then(response => response.json())
          .then(post => {
          
            var liked = false
            post.likes.forEach(function(value, index, array) {
              if (user.username === value.username){
                liked = true
              }
            })

            if (liked) {
              likeButton.innerHTML = 'Dislike'
            } else {
              likeButton.innerHTML = 'Like'
            }
          })
        }
        viewProfileButton.onclick = function() {
          view_profile(post.author.id)
        }
      })
    })
  }
})
