// const { response } = require("express")

document.getElementById('registerForm').addEventListener('submit', function(event){
    event.preventDefault()

    var name = document.querySelector('input[name="name"]').value
    var email = document.querySelector('input[name="email"]').value
    var dob = document.querySelector('input[name="dob"]').value
    var phone = document.querySelector('input[name="phone"]').value
    var password = document.querySelector('input[name="password"]').value
    var gender = document.querySelector('select[name="gender"]').value

    fetch('/register', {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            dob: dob,
            phone: phone,
            password: password,
            gender: gender
        })
    })
    .then(response => response.json())
    .then(data =>{
        var msg = document.getElementById('message')
        if(data.result){
            msg.textContent = data.result
            msg.style.color = 'green'
        }
        if(data.code === 1){
            // alert(data.result)
            window.location.href = 'login.html'
        }
        else if(data.error){
            msg.textContent = data.error
            msg.style.color = 'red'
        }
        // document.body.appendChild(msg)
    })
    .catch(error =>{
        var msg = document.getElementById('message')
        msg.textContent = 'Error: '+error
        msg.style.color = 'red'

    })
})
