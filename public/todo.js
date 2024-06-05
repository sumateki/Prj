// Initialize PouchDB
const db = new PouchDB('todos');

// Function to save todos to PouchDB
function saveTodos(todos) {
    todos.forEach(todo => {
        db.put(todo).catch((err) => {
            console.error('Error saving todo:', err);
        });
    });
}

// Function to retrieve todos from PouchDB
function getTodos(callback) {
    db.allDocs({ include_docs: true, descending: true }, function(err, doc) {
        if (err) {
            return console.error('Error retrieving todos:', err);
        }
        callback(doc.rows.map(row => row.doc));
    });
}

// Example of adding a new todo
function addTodo(title) {
    const newTodo = {
        _id: new Date().toISOString(),
        title: title,
        completed: false
    };
    db.put(newTodo).then(() => {
        console.log('Todo added successfully');
        loadTodos(); // Refresh the list of todos
    }).catch((err) => {
        console.error('Error adding todo:', err);
    });
}

// Example of loading and displaying todos
function loadTodos() {
    getTodos((todos) => {
        // Clear existing todos from the display
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        // Display each todo
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.title;
            todoList.appendChild(li);
        });
    });
}

// Load todos when the page is loaded
document.addEventListener('DOMContentLoaded', loadTodos);

// Example of handling form submission to add a new todo
document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('todo-title').value;
    if (title) {
        addTodo(title);
        document.getElementById('todo-title').value = ''; // Clear the input
    }
});

// Existing login and registration logic
document.addEventListener('DOMContentLoaded', function(){
    var signinLink = document.getElementById('signin-link');
    var signupLink = document.getElementById('signup-link');

    if(signinLink){
        signinLink.addEventListener('click',function(event){
            event.preventDefault();
            event.target.style.color = 'blue';
            window.location.href = 'login.html';
        });
    }

    if(signupLink){
        signupLink.addEventListener('click', function(event){
            event.preventDefault();
            event.target.style.color = 'blue';
            window.location.href = 'register.html';
        });
    }
});
