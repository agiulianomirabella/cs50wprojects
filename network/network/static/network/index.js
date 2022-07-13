document.addEventListener('DOMContentLoaded', function() {
  
  // Layout buttons
  document.querySelector('#auth-profile-button').onclick = function() {
    view_profile(auth_user_id)
  }
  document.querySelector('#all-posts-button').onclick = view_posts
  document.querySelector('#following-button').onclick = view_following

  // Auxiliary
  const newPostSection = document.querySelector('#new-post-section')
  const newPostForm = document.querySelector('#new-post-form')

  const postsSection = document.querySelector('#posts-section')
  const heading = document.querySelector('#posts-heading')
  const postsToShow = document.querySelector('#posts-posts')
  
  const postSection = document.querySelector('#post-section')
  const author = document.querySelector('#post-author')
  const text = document.querySelector('#post-text')
  let editPostText = document.querySelector('#edit-post-text')
  const commentsSection = document.querySelector('#post-comments')
  const editPostSection = document.querySelector('#edit-post-section')
  const postLikes = document.querySelector('#post-likes')

  const followButton = document.querySelector('#follow-button')
  const likeButton = document.querySelector('#like-button')
  const viewProfileButton = document.querySelector('#view-profile-button')
  const editPostButton = document.querySelector('#edit-post-button')
  const editPostSubmit = document.querySelector('#edit-post-submit')
  
  function clean() {
    postsToShow.innerHTML = ''
    commentsSection.innerHTML = ''
  }

  function show_post(post) {

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
  }




  // fetch('/emails/'+id, {
  //   method: 'PUT',
  //   body: JSON.stringify({
  //       read: true
  //     })
  //   });



  // VIEW PROFILE

  function view_profile(user_id) {

    console.log(`View profile ${user_id}.`)
    
    postsSection.style.display = 'block'
    postSection.style.display = 'none'
    newPostSection.style.display = 'none'
    followButton.style.display = 'none'

    if (user_id !== auth_user_id) {
      followButton.style.display = 'block'
    } else {
      followButton.style.display = 'none'
    }
    
    clean()
    
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
    
      fetch('/users/'+user_id)
      .then(response => response.json())
      .then(user => {
      
        heading.innerHTML = `@${user.username}'s posts`
        
        posts.forEach(post => {
          if (post.author.username === user.username) {
            show_post(post)          
          }
        })

        // Update follow button
        fetch('/users/'+auth_user_id)
        .then(response => response.json())
        .then(auth_user => {

          var followed = false
          user.followers.forEach(function(value, index, array) {
            if (auth_user.username === value){
              followed = true
            }
          }) 

          if (followed) {
            followButton.innerHTML = `Unfollow`
          } else {
            followButton.innerHTML = `Follow`
          }
          
          // Follow
          followButton.onclick = function() {
            fetch('/users/'+user_id+'/follow', {
              method: 'PUT',
              body: JSON.stringify({
                  followed: followed
                })
              })
              .then(response => response.json())
              .then(user => {
                var followed = false
                user.followers.forEach(function(value, index, array) {
                  if (auth_user.username === value) {
                    followed = true
                  }
                })
    
                if (followed) {
                  followButton.innerHTML = 'Unfollow'
                } else {
                  followButton.innerHTML = 'Follow'
                }
            })
          }
        })
      })
    })
  }







  // VIEW ALL POSTS

  function view_posts() {

    console.log(`View all posts.`)
    
    postsSection.style.display = 'block'
    postSection.style.display = 'none'
    newPostSection.style.display = 'block'
    heading.innerHTML = `Feed`

    clean()
    
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => {
        show_post(post)
      })
    })
  }







  // VIEW POST

  function view_post(post_id) {
    
    console.log(`View post ${post_id}.`)
    
    // Update index.html
    postsSection.style.display = 'none'
    postSection.style.display = 'block'
    newPostSection.style.display = 'none'
    followButton.style.display = 'none'
    
    // GET post
    fetch('/posts/'+post_id)
    .then(response => response.json())
    .then(post => {
      
      author.innerHTML = `@${post.author.username}`
      text.innerHTML = `${post.text}`
      postLikes.innerHTML = `${post.likes_number}`

      // GET post comments
      fetch('posts/'+post_id+'/comments')
      .then(response => response.json())
      .then(comments => {
        comments.forEach(comment => {
          const element = document.createElement('div')
          element.innerHTML = `@${comment.author.username}: "${comment.text}"`
          commentsSection.append(element)
        })
      })

      // Update like button
      fetch('/users/'+auth_user_id)
      .then(response => response.json())
      .then(auth_user => {

        // Show edit post button or not
        if (auth_user_id === post.author.id) {
          editPostButton.style.display = 'block'
        } else {
          editPostButton.style.display = 'none'
        }

        editPostButton.onclick = function() {
          editPostSection.style.display = 'block'
          editPostText.innerHTML = post.text
          editPostSubmit.onclick = function () {
            let new_text = editPostText.innerHTML
            console.log('Editing the post.')
            fetch('/posts/'+post_id+'/edit', {
              
              // Adding method type
              method: "POST",
              
              // Adding body or contents to send
              body: JSON.stringify({
                'edit-post-text': new_text,
              }),
              
              // Adding headers to the request
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
            })
          }
        }

        var liked = false
        post.likes.forEach(function(value, index, array) {
          if (auth_user.id === value.id){
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
          fetch('/posts/'+post_id+'/like', {
            method: 'PUT',
            body: JSON.stringify({
                liked: liked
              })
            })
          .then(response => response.json())
          .then(post => {
          
            var liked = false
            post.likes.forEach(function(value, index, array) {
              if (auth_user.id === value.id){
                liked = true
              }
            })

            if (liked) {
              likeButton.innerHTML = 'Dislike'
              postLikes.innerHTML = `${post.likes_number}`
            } else {
              likeButton.innerHTML = 'Like'
              postLikes.innerHTML = `${post.likes_number}`
            }
          })
        }
        viewProfileButton.onclick = function() {
          view_profile(post.author.id)
        }
      })
    })
  }






  // VIEW FOLLOWING

  function view_following() {
    console.log(`View following.`)
    
    postsSection.style.display = 'block'
    postSection.style.display = 'none'
    newPostSection.style.display = 'none'
    heading.innerHTML = `Following`
    followButton.style.display = 'none'

    clean()

    fetch('/following')
    .then(response => response.json())
    .then(posts => {
      posts.forEach(post => {
        show_post(post)
      })
    })
  }

})
