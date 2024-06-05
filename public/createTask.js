// const { response } = require("express")

document.getElementById('createTaskForm').addEventListener('submit', function(event){
    event.preventDefault()

    //gather the form data
    // Access the form fields using 'event.target'
    const form = event.target
    const taskData = {
        title: form.title.value,
        description: form.description.value,
        strtDate: form.strtDate.value,
        endDate: form.endDate.value
    }

    //send data to the backend
    fetch('/createTask',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById('message');
        if(data.code === 1){
            //display success msg
            // document.getElementById('message').innerText = data.result;
            messageElement.innerText = data.result;
            messageElement.style.color = 'green';
        }
        else{
            // Handle failure
            messageElement.innerText = 'Task creation failed. Please try again.';
            messageElement.style.color = 'red';
            
            // document.getElementById('message').innerText = 'Task Creation failed. Please try again..!!'
        }
    })
    .catch(error => {
        console.error('Error: ',error)
        // document.getElementById('message').innerText = 'An error occured. Please try again..!!'
        const messageElement = document.getElementById('message');
        messageElement.innerText = 'An error occurred. Please try again.';
        messageElement.style.color = 'red';
    })
})
