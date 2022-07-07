document.addEventListener('DOMContentLoaded', function() {
  
  // Layout buttons
  document.querySelector('#all-posts').onclick = all_posts
  document.querySelector('#profile').onclick = show_profile

  // Auxiliary
  function clean() {
    document.querySelector('#profile-section').innerHTML = `<h1 id="profile-username"></h1><div id="profile-posts"></div>`
    document.querySelector('#post-section').innerHTML = ''
    document.querySelector('#all-posts-section').innerHTML = `<div id="all-posts-posts"><h1>Feed</h1></div>`
  }
    
  // PROFILE VIEW

  function show_profile() {

    console.log('Show profile')
    
    document.querySelector('#profile-section').style.display = 'block'
    document.querySelector('#all-posts-section').style.display = 'none'
    
    clean()
    
    const followButton = document.createElement('button')

    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
    
      fetch('/users/'+user_id)
      .then(response => response.json())
      .then(user => {
      
      document.querySelector('#profile-username').innerHTML = `@${user.username}`
      
      posts.forEach(post => {
        
        if (post.author === user.username) {
          
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
            show_post(post.id)
          }
                  
          document.querySelector('#profile-posts').append(element)
        }
      })


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
          console.log('Fetch to /users/'+user_id+'/follow')
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
      document.querySelector('#profile-section').append(followButton)
    })  
  }

  // POST VIEW

  function show_post(post_id) {

    console.log('Show post')

    document.querySelector('#profile-section').style.display = 'block'
    document.querySelector('#all-posts-section').style.display = 'none'    

    clean()

    const likeButton = document.createElement('button')

    fetch('/posts/'+post_id)
    .then(response => response.json())
    .then(post => {
      
      fetch('/users/'+user_id)
      .then(response => response.json())
      .then(user => {   


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
        
      })
      
      const PostAuthor = document.createElement('a')
      PostAuthor.innerHTML = `@${post.author}`
      
      const PostText = document.createElement('h3')
      PostText.innerHTML = `${post.text}`
      
      document.querySelector('#post-section').innerHTML = `
      <a id="profile"><h1>@${post.author}</h1><a>
      ${post.text}
      `
      document.querySelector('#post-section').append(likeButton)

    })
  }
  
  // ALL POSTS VIEW
  function all_posts() {

    console.log('All posts')

    document.querySelector('#profile-section').style.display = 'none'
    document.querySelector('#all-posts-section').style.display = 'block'

    clean()

    fetch('/posts')
    .then(response => response.json())
    .then(posts => {

      
      posts.forEach(post => {
        
          
          // Create a new element
          const element = document.createElement('div')
          
          // Write author, text, timestamp and likes
          element.innerHTML = `
          <b>@${post.author}</b>: ${post.text}
          <div style="float:right; color:grey";>${post.timestamp} ${post.likes|length} <img width="15px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bot%C3%B3n_Me_gusta.svg/200px-Bot%C3%B3n_Me_gusta.svg.png"></div>
          `
        
          // Custom element style
          element.style.borderStyle='groove'
          element.style.borderColor='#abb2b9'
          
          element.onclick = function() {
            show_post(post.id)
          }

          document.querySelector('#all-posts-posts').append(element)
      })
    })
  }
})
