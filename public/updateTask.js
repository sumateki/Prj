document.getElementById('updateTaskForm').addEventListener('submit', function(event){
    event.preventDefault();

    var taskId = document.getElementById('taskId').value;
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var strtDate = document.getElementById('strtDate').value;
    var endDate = document.getElementById('endDate').value;

    fetch('/updateTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            taskid: taskId,
            updatedTask: {
                title: title,
                description: description,
                strtDate: strtDate,
                endDate: endDate
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        var msg = document.getElementById('message')
        if (data.result) {
            msg.textContent = data.result
            msg.style.color = 'green'
        } else if (data.error) {
            msg.textContent = data.error
            msg.style.color = 'red'
        }
    })
    .catch(error => {
        var msg = document.getElementById('messaage')
        msg.textContent = 'Error: '+error
        msg.style.color = 'red'
        // console.log('Error:', error)
    });
});


