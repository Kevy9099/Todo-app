const TODO_LIST_URL = 'http://localhost:3000/todoList'

$.get(TODO_LIST_URL).then(data => console.log(data))

$('#addTodoForm').on('submit', function (e) {
    e.preventDefault();

    fetch(TODO_LIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fullName: $('#newName').val(),
            taskName: $('#newTaskName').val(),
            taskDescription: $('#newTaskDescription').val()
        })
    });
});

function displayTodos() {
    $('#todoTableBody').empty();

    $.get(TODO_LIST_URL).then(data => {
        if (data.length === 0) {
            $('#todoTableBody').append(
                `<tr>
                    <td colspan="5" class="text-center text-muted">
                        No tasks found
                    </td>
                </tr>`
            );
            return;
        }

        data.forEach(todo => {
            $('#todoTableBody').append(`
                <tr>
                    <td data-label="Task ID">${todo.id}</td>
                    <td data-label="Name">${todo.fullName}</td>
                    <td data-label="Task Name">${todo.taskName}</td>
                    <td data-label="Task Description">${todo.taskDescription}</td>
                <tr>
            `);
        });
    });
}

displayTodos();

function deleteTodo() {
    const taskId = document.getElementById("idNumber").value;

    if (!taskId) {
        alert("Please enter a task ID!");
        return;
    }

    fetch(`${TODO_LIST_URL}/${taskId}`, {
        method: "DELETE"
    }).then(async (res) => {
        if (!res.ok) {
            const msg = await res.text().catch(() => "");
            throw new Error(`Delete Failed (${res.status}): ${msg || res.statusText}`);
        }

        console.log(`Deleted Task ID ${taskId}.`);
        document.getElementById("idNumber").value = "";
        displayTodos();
    }).catch((err) => {
        console.error(err);
        alert(err.message);
    })
}

function updateTodo() {
const taskId = document.getElementById("updateIdNumber").value;

  if (!taskId) {
    alert("Please enter a task ID to update!");
    return;
  }

  const fullNameVal = document.getElementById("updateName").value.trim();
  const taskNameVal = document.getElementById("updateTaskName").value.trim();
  const taskDescVal = document.getElementById("updateTaskDescription").value.trim();

  const updates = {};
  if (fullNameVal) updates.fullName = fullNameVal;
  if (taskNameVal) updates.taskName = taskNameVal;
  if (taskDescVal) updates.taskDescription = taskDescVal;

  fetch(`${TODO_LIST_URL}/${taskId}`, {
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
      console.log("Updated:", updated);

      // Clear inputs
      document.getElementById("updateIdNumber").value = "";
      document.getElementById("updateName").value = "";
      document.getElementById("updateTaskName").value = "";
      document.getElementById("updateTaskDescription").value = "";

      displayTodos(); // refresh list
    })
    .catch((err) => {
      console.error(err);
      alert(err.message);
    });
}