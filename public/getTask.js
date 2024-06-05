

document.addEventListener('DOMContentLoaded', function(){
    var getTaskForm = document.getElementById('getTaskForm')

    if(getTaskForm){
        getTaskForm.addEventListener('submit', function(event){
            event.preventDefault()

            var taskId = document.getElementById('taskId').value
            if(taskId.trim() !== ""){
                window.location.href = '/getTask/' + taskId  // Redirect to the correct URL
            }
            else{
                alert("please enter a task ID.")  // Show an alert if task ID is empty
            }

        })
    }

})

   
