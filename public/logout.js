document.getElementById('logoutform').addEventListener('submit', function(event){
    event.preventDefault()

    // Perform the logout action via AJAX
    fetch('/logout', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data =>{
        if(data.code === 1){
            window.location.href = 'login.html'
        }
        else{
            alert('Logout failed. Please try again.')
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
        alert('An error occurred. Please try again.');
    })
})

