const TRACKER_LIST_URL = 'http://localhost:3000/trackerList'

$.get(TRACKER_LIST_URL).then(data => console.log(data))

$('#addApplicationForm').on('submit', function (e) {
    e.preventDefault();

    fetch(TRACKER_LIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            applicantName: $('#addApplicantName').val(),
            companyName: $('#addCompanyName').val(),
            position: $('#addPosition').val(),
            applicationStatus: $('#addApplicationStatus').val()
        })
    }).then(async (res) => {
        if (!res.ok) {
            const msg = await res.text().catch(() => "");
            throw new Error(`Created failed (${res.status}):${msg || res.statusText}`)
        }
        return res.json();
    }).then((created) => {
        alert(`Created Application Id ${created.id}`);

        $('#addApplicantName').val('');
        $('#addCompanyName').val('');
        $('#addPosition').val('');
        $('#addApplicationStatus').val('');

        displayApplications();
    })
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
});

function displayApplications() {
    $('#trackerTableBody').empty();

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

        data.forEach(tracker => {
            $('#trackerTableBody').append(`
                <tr>
                    <td data-label="Application Id">${tracker.id}</td>
                    <td data-label="Applicant Name">${tracker.applicantName}</td>
                    <td data-label="Company Name">${tracker.companyName}</td>
                    <td data-label="Position">${tracker.position}</td>
                    <td data-label="Application Status">${tracker.applicationStatus}</td>
                </tr>
            `);
        }).catch(err => {
    console.error("GET failed:", err);
    alert("Failed to load applications. Check console.");
  });
    });
}

displayApplications();

function deleteApplications() {
    const trackerId = document.getElementById("applicationId").value;

    if (!trackerId) {
        alert("Please enter a application id!");
        return;
    }

    fetch(`${TRACKER_LIST_URL}/${trackerId}`, {
        method: "DELETE"
    }).then(async (res) => {
        if (!res.ok) {
            const msg = await res.text().catch(() => "");
            throw new Error(`Delete Failed (${res.status}): ${msg || res.statusText}`);
        }

        alert(`Deleted tracker id ${trackerId}`);
        document.getElementById("applicationId").value = "";
        displayApplications();
    })
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
}

function updateApplications() {
    const trackerId = document.getElementById("updateApplicationId").value;

    if (!trackerId) {
        alert("Please enter a application id to update!");
        return;
    }

    const applicantNameVal = document.getElementById("updateApplicantName").value.trim();
    const companyNameVal = document.getElementById("updateCompanyName").value.trim();
    const positionVal = document.getElementById("updatePosition").value.trim();
    const applicationStatusVal= document.getElementById("updateApplicationStatus").value.trim();

    const updates = {};
    if (applicantNameVal) updates.applicantName = applicantNameVal;
    if (comapnyNameVal) updates.comapnyName = companyNameVal;
    if (positionVal) updates.position = positionVal;
    if (applicationStatusVal) updates.applicationStatus = applicationStatusVal

    fetch(`${TRACKER_LIST_URL}/${trackerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    })
        .then(async (res) => {
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(`Update failed (${res.status}): ${msg || res.statusText}`);
            }
            return res.json(); // json-server returns the updated object
        })
        .then((updated) => {
            alert(`Updated application id ${updated.id}`);
            displayApplications();
        })
        .catch((err) => {
            console.error(err);
            alert(err.message);
        });
}
