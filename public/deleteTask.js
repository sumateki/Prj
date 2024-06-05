// const { response } = require("express")

document.getElementById('deleteTaskForm').addEventListener('submit', function(event){
    event.preventDefault()

    var taskId = document.getElementById('taskId').value

    fetch('/deleteTask',{
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ taskid: taskId })
    })
    .then(response => response.json())
    .then(data => {
        var msg = document.getElementById('message')
        if(data.result){
            msg.textContent = data.result
            msg.style.color = 'green'
        }
        else if(data.error){
            msg.textContent = data.error
            msg.style.color = 'red'
        }
    })
    .catch(error =>  {
        var msg = document.getElementById('message')
        msg.textContent = 'Error: '+ error
        msg.style.color = 'red'
    })

})
