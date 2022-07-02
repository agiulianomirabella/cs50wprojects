document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email('', '', ''));
  
  // Event listener to send an email
  document.querySelector('#compose-form').onsubmit = send_email

  // By default, load the inbox
  load_mailbox('inbox');
});


// Compose an email
function compose_email(initial_recipients, initial_subject, initial_body) {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = initial_recipients;
  document.querySelector('#compose-subject').value = initial_subject;
  document.querySelector('#compose-body').value = initial_body;
}


// Load a mailbox
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // GET request to emails API
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
}


// Send an email
function send_email() {
  recipients = document.querySelector('#compose-recipients').value;
  subject = document.querySelector('#compose-subject').value;
  body = document.querySelector('#compose-body').value;
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result)
  });
  load_mailbox('sent');
  return false // in order not to actually submit the form
}


// View an email
function load_email(id, mailbox) {

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
