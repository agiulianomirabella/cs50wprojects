document.addEventListener('DOMContentLoaded', function() {
  
  // GET request to posts API
  emails = fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
    console.log(`Number of emails: ${emails.length}`)
    emails.forEach(email => {

      // Create a new element
      const element = document.createElement('div');

      // Write email sender, subject and timestamp
      element.innerHTML = `
      <b>${email.sender}</b>
      ${email.subject}
      <div style="float:right; color:grey";>${email.timestamp}</div>
      `;
      
      // Custom element style
      element.style.borderStyle='groove'
      element.style.borderColor='#abb2b9'
      if (email.read===true) {
        element.style.backgroundColor = '#d5d8dc';
      } else {
        element.style.backgroundColor = 'white';
      }
      element.addEventListener('click', function() {
        load_email(email.id, mailbox);
      });
      document.querySelector('#emails-view').append(element);

    });
  });
});


// View an email
function load_email(id) {

  // GET '/emails/<int:email_id>'
  fetch('/emails/'+id)
  .then(response => response.json())
  .then(email => {

    // Clear the reply, archive and unarchive buttons
    document.querySelector('#email-buttons').innerHTML = ''
    
    // Show the email view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    
    // Create the archive button when in inbox
    if (mailbox==='inbox') {
      // const archiveButton = create_button('Archive', archive_email(email));
      const archiveButton = document.createElement('button');
      archiveButton.innerHTML = 'Archive'
      archiveButton.className = 'btn btn-sm btn-outline-primary'
      archiveButton.addEventListener('click', () => { archive_email(email) })
      document.querySelector('#email-buttons').append(archiveButton)
      
    } 
    
    // Create the unarchive button when in archive
    if (mailbox==='archive') {
      const unarchiveButton = document.createElement('button');
      unarchiveButton.innerHTML = 'Unarchive'
      unarchiveButton.className = 'btn btn-sm btn-outline-primary'
      unarchiveButton.addEventListener('click', () => { archive_email(email) })
      document.querySelector('#email-buttons').append(unarchiveButton)

    }
    
    // Create the reply button
    const replyButton = document.createElement('button');
    replyButton.innerHTML = 'Reply'
    replyButton.className = 'btn btn-sm btn-outline-primary'
    replyButton.addEventListener('click', () => reply_email(email));
    document.querySelector('#email-buttons').append(replyButton)
    
    // Show email data
    document.querySelector('#email-from').innerHTML = `From: ${email.sender}`;
    document.querySelector('#email-to').innerHTML = `To: ${email.recipients}`;
    document.querySelector('#email-subject').innerHTML = `Subject: ${email.subject}`;
    document.querySelector('#email-timestamp').innerHTML = `Timestamp: ${email.timestamp}`;
    document.querySelector('#email-body').innerHTML = `${email.body.replaceAll('\n', '<br/>')}`;
    
    // Update email.read to true
    if (email.read===false) {
      fetch('/emails/'+id, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
          })
        });
      }
      
  });
}

function archive_email(email) {
  fetch('/emails/'+email.id, {
    method: 'PUT',
    body: JSON.stringify({
      archived: !email.archived
    })
  });
  load_mailbox('inbox');
}

function reply_email(email) {
  let subject = email.subject;
  if (!subject.startsWith('Re: ')) {
    subject = 'Re: ' + subject;
  }
  let body = `On ${email.timestamp} ${email.sender} wrote:\n${email.body}\n`;
  compose_email(email.sender, subject, body);
}
