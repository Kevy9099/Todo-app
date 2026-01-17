<h1>Applicant Tracker Application</h1>
<h3>Install JSON Server</h3>
<p>Adding package.json lets you run json-server with one command and properly manage dependencies like a real project.</p>
<ol>
  <li>
    open terminal → cd into applicant-tracker 
  </li>
  <li>
    in terminal type: <strong>'npm init -y'</strong> (creates a package.json automatically)
  </li>
  <li>
    then type <strong>'npm install json-server'</strong> (adds a package-lock.json and node_modules)
  </li>
  <li>
    open package.json and update: 
      (a) "name": "db.json",
      (b) "version": "1.0.0",
      (c) "description": "text",
      (d) "main": "index.js",
      (e) "scripts": {
            "start": "json-server --watch db.json --port 3000"
          },
      (f) "dependencies":{
            "json-server": "^0.17.4"
          }
        }
  </li>
  <li>
    finally tpye <strong>'npm start'</strong>
  </li>
</ol>

<h3>Work Flow: tracker.js file</h3>
<ol>
  <li> 
    Go to <strong>http://localhost:3000/trackerList</strong>, ask for the data there, and when it arrives, print it to the browser console.
  </li>
  <li> 
    A form submit handler that creates a new application by sending data to your server.
  </li>
  <li> 
      This code creates a new job application on the server, handles success or failure, clears the form, and updates the page.
      <br>
      <br>
      When the form is submitted: 
        <br>
        (a)	Send the form data to the server.
        <br>
        (b)	If the server says “something went wrong” → show an error.
        <br>
        (c) If the server says “success” → show the new application ID.
        <br>
        (d) then clear the form.
        <br>
        (e) lastly, refresh the application list.
  </li>
  <li> 
      This function <strong>"displayApplications()"</strong> loads job applications from the server and displays them in a table, handling empty results and errors gracefully.
      <br>  
      <br>
        (a) Clear the table.
        <br>
        (b) Ask the server for application data.
        <br>
        (c) If there’s no data → show “No applications found”.
        <br>
        (d) If there is data → add one table row per application.
        <br>
        (e) If something breaks → show an error.
  </li>
  <li>
    This function <strong>"deleteApplications()"</strong> deletes a job application by ID, confirms success, and refreshes the display.
    <br>
    <br>
      (a) Get the application ID from the user.
      <br>
      (b) If no ID → stop and warn the user.
      <br>
      (c) Tell the server to delete that application.
      <br>
      (d) If it fails → show an error.
      <br>
      (e) If it works → confirm, clear input, refresh the table.
  </li>
  <li>
    This function <strong>"updateApplications()"</strong> updates an existing application by ID, safely changes only the provided fields, and refreshes the UI.
    <br>
    <br>
      (a) Get the ID of the application to update.
      <br>
      (b) Stop if no ID is provided.
      <br>
      (c) Read new values from the form.
      <br>
      (d) Only include fields that were filled in.
      <br>
      (e) Send those changes to the server.
      <br>
      (f) If it fails → show an error.
      <br>
      (h) If it succeeds → refresh the list.
  </li>
</ol>
