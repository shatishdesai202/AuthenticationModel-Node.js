<img src="https://raw.githubusercontent.com/whitef0x0/node-email-verification/master/design/logo.png" >  
# AuthenticationModel-Api-Node.js

Verify user signup over email with NodeJS and MongoDB!

<ul>The way this works is as follows:
  <li>temporary user is created with a randomly generated URL assigned to it and then saved to a MongoDB collection</li>
  <li>email is sent to the email address the user signed up with</li>
  <li>when the URL is accessed, the user's data is transferred to the real collection</li>
</ul>
