/** Javascript that uses the CRUD process for an applicant tracker: Add, Delete, and Update from our 
 * A database that holds the trackerList array. This Tracker will allow employment to add or change employee's
 * applicant name,  applicant position and application status.
 */

// constant variable called TRACKER_LIST_URL that sotres a localhost.
// on 'port 3000'. This request allows us to access our tracker.db for our applicant tracker.
const TRACKER_LIST_URL = 'http://localhost:3000/trackerList'

// $.get() sends a GET request to the URL (database), after the request.
// .then() runs after the server responds successfully and prints the data to the console.
// the data is whatever the server sends back.
$.get(TRACKER_LIST_URL).then(data => console.log(data))

// selecting the id addApplicationForm (our form that adds new applicants).
// we listen to a submit event (by pressing the add button or pressing Enter).
$('#addApplicationForm').on('submit', function (e) {
    e.preventDefault(); // prevents the page from reloading.

    /**
     * fetch() sends an HTTP request to our API.
     * method: 'POST' creates new data.
     * headers tells the server to send JSON data.
     * the body contains the form values that needs to be read and then convert to JSON text. 
     */

    fetch(TRACKER_LIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // tells the server to send JSON data.
        body: JSON.stringify({
            applicantName: $('#addApplicantName').val(),
            position: $('#addPosition').val(),
            applicationStatus: $('#addApplicationStatus').val()
        })
    })
        /**
         * The first .then(): server sends back a respone that is stored in 'res'.
         * res.ok check to see if the request succeed.
         * the await throws a catch/err message if the request fails.
         * otherwise the then block returns res.json(), that is converted JSON response into a Javascript object.
         * the javascript object is then passed to the next .then().
         */
        .then(async (res) => {
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(`Created failed (${res.status}):${msg || res.statusText}`)
            }
            return res.json();
        })
        /**
         * the second .then(): creates the new application object that was returned by the server.
         * this is attach with an alert, that shows the user the id has been created.
         */
        .then((created) => {
            alert(`Created Application Id ${created.id}`);

            // Clears the form inputs and makes the form ready for the next entry/submit.
            $('#addApplicantName').val('');
            $('#addPosition').val('');
            $('#addApplicationStatus').val('');

            // displayApplication function is called and refresh our display list or trackerList.
            displayApplications();
        })
        // a catch/err that will alert us if something goes wrong.
        // such as: fetch request fail, server response fail, or a JSON conversion fail.
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
});

/**
 * @function displayApplication() will allows us to create new applications/entry
 * and get added to our trackerTableBody and tackerList array(tracker.db). 
 */

// starts by clearing all rows inside the table body (if any), and prevent duplicate rows.
// this is done by calling the id ('#trackerTableBody') for our table body and adding the .empty() method to clear it.
function displayApplications() {
    $('#trackerTableBody').empty();

    // $.get a request from our URL and then passing the response in data.
    // if the data returns empty or null then we create a "no applications found" error in the table body.
    // Also, continue to build our <tr> and <td> tags and append it to the '#trackerTableBody'.
    $.get(TRACKER_LIST_URL).then(data => {
        if (!data || data.length === 0) {
            $('#trackerTableBody').append(
                `<tr>
                    <td colspan="5" class="text-center text-muted">
                        No applications found
                    </td>
                </tr>`
            );
            return;
        }

        // This forEACH loops through each application and stores the data in the variable called "tracker".
        // The loops continues to attach each trackerList value with its corresponding inputs that "tracker" pass in. 
        // we then append all the data to our table '#trackerTableBody' and displays the data at the bottom of the page.
        // the data-label is use for mobile styling (responsive table).
        data.forEach(tracker => {
            $('#trackerTableBody').append(`
                <tr>
                    <td data-label="Application Id">${tracker.id}</td>
                    <td data-label="Applicant Name">${tracker.applicantName}</td>
                    <td data-label="Position">${tracker.position}</td>
                    <td data-label="Application Status">${tracker.applicationStatus}</td>
                </tr>
            `);
        })
            // a .catch(err) in case the request, responds or JSON convert fails.
            .catch(err => {
                console.error("GET failed:", err);
                alert("Failed to load applications. Check console.");
            });
    });
}

// calls the function to display all data on the page.
displayApplications();

/**
 * @function deleteApplications(): deletes one application from the server by using an application ID entered by the user,
 * then refreshes the table after the deletion.
 * 
 */
function deleteApplications() {
    // reads the user input from '#applicationId' and stores the value in trackerId.
    const trackerId = document.getElementById("applicationId").value;

    // checks if trackerId is empty, if yes, prompt an alert.
    if (!trackerId) {
        alert("Please enter a application id!");
        return;
    }

    // sends a delete request to the URL server. 
    fetch(`${TRACKER_LIST_URL}/${trackerId}`, {
        method: "DELETE"
    })
    // .then() checks if the deletion request was a success. if not, then throw and error.
    .then(async (res) => {
        if (!res.ok) {
            const msg = await res.text().catch(() => "");
            throw new Error(`Delete Failed (${res.status}): ${msg || res.statusText}`);
        }

        // a success alert that the deletion request worked and removes the application for trackerId.
        alert(`Deleted tracker id ${trackerId}`);
        document.getElementById("applicationId").value = "";
        // refresh the display.
        displayApplications();
    })
        // throws alert error message if something goes wrong.  
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
}

/**
 * @function updateApplications(): updates one existing application on the server, but only updates the fields the user actually typed in,
 * then refreshes the table after the update.
 */
function updateApplications() {
    // reads the id input from '#updateApplicationId' and stores the value in trackerId.
    const trackerId = document.getElementById("updateApplicationId").value;

    // checks trackerId if empty, if yes, prompt an alert.
    if (!trackerId) {
        alert("Please enter a application id to update!");
        return;
    }

    // reads new user inputs from input fields and stores data in variables.
    // .trim() removes extra spaces so empty input stays empty.
    const applicantNameVal = document.getElementById("updateApplicantName").value.trim();
    const positionVal = document.getElementById("updatePosition").value.trim();
    const applicationStatusVal = document.getElementById("updateApplicationStatus").value.trim();

    // an empty array the only adds fields that the user actually filled out. 
    // this avoids overwriting existing data with empty strings.
    const updates = {};
    if (applicantNameVal) updates.applicantName = applicantNameVal;
    if (positionVal) updates.position = positionVal;
    if (applicationStatusVal) updates.applicationStatus = applicationStatusVal

    // sends a PATCH/UPDATE values as JSON text to the server.
    fetch(`${TRACKER_LIST_URL}/${trackerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    })
        // if the request sends back an error. 
        // therefore, throw an error message for the failed update.
        .then(async (res) => {
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(`Update failed (${res.status}): ${msg || res.statusText}`);
            }
            return res.json(); 
        })
        // checks for the update request was a success, then throw a success message.
        .then((updated) => {
            alert(`Updated application id ${updated.id}`);
            displayApplications();
        })
        // catch any errors that went wrong.
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
}
