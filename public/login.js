
document.getElementById('loginform').addEventListener('submit', function(event){
    event.preventDefault()

    const email = document.querySelector('input[name="email"]').value
    const password = document.querySelector('input[name="password"]').value

    fetch('/login',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })    
    })
    .then(response => response.json())
    .then(data => {
        var msg = document.getElementById('message')
        if(data.result){
            msg.textContent = data.result
            msg.style.color = 'green'
        }
        if(data.code === 1){
            // alert(data.result)
            window.location.href = 'tasksList.html'
        }
        else if(data.error){
            msg.textContent = data.error
            msg.style.color = 'red'
        }
    })
    .catch(error => {
        console.error('Error during login: ',error)
        alert('An error occured. Pleasae try again.!!')
    })
})


