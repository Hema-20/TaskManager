const inputBox = document.getElementById("inputbox");
const list = document.getElementById("list");

// Function to fetch tasks from the backend and display them
const fetchTasks = async () => {
    try {
        const response = await fetch('http://localhost:5003/tasks');
        const tasks = await response.json();
        list.innerHTML = tasks.map(task => `
            <li data-id="${task._id}" class="${task.completed ? 'checked' : ''}">
                ${task.title}
                <span class="delete-btn">\u00d7</span>
            </li>
        `).join('');
    } catch (error) {
        console.error('Failed to fetch tasks:', error.message);
    }
};

// Function to add a new task
const addTask = async () => {
    const taskTitle = inputBox.value.trim();
    if (!taskTitle) {
        alert("Please enter a task title.");
        return;
    }
    try {
        const task = {
            title: taskTitle,
            completed: false
        };
        const response = await fetch('http://localhost:5003/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (response.ok) {
            const newTask = await response.json();
            const li = document.createElement("li");
            li.dataset.id = newTask._id;
            li.textContent = newTask.title;
            list.appendChild(li);
            inputBox.value = '';
            console.log('Task added successfully:', newTask);
        } else {
            console.error('Failed to add task:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to add task:', error.message);
    }
};

// Event listener to handle click on delete button
list.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const taskId = e.target.parentElement.dataset.id;
        try {
            const response = await fetch(`http://localhost:5003/tasks/${taskId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                e.target.parentElement.remove();
                console.log('Task deleted successfully');
            } else {
                console.error('Failed to delete task:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to delete task:', error.message);
        }
    }
});

// Event listener to handle click on task item
list.addEventListener('click', async (e) => {
    if (e.target.tagName === 'LI') {
        const taskId = e.target.dataset.id;
        try {
            const response = await fetch(`http://localhost:5003/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !e.target.classList.contains('checked') })
            });
            if (response.ok) {
                const updatedTask = await response.json();
                e.target.classList.toggle('checked'); 
                console.log('Task updated successfully:', updatedTask);
            } else {
                console.error('Failed to update task:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to update task:', error.message);
        }
    }
});

// Fetch tasks when the page loads
window.addEventListener('load', fetchTasks);

// Attach event listener to the "Add" button
const addButton = document.querySelector('button');
addButton.addEventListener('click', addTask);
