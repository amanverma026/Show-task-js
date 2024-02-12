
let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }
    if (dragSrcEl !== this) {
        this.parentNode.removeChild(dragSrcEl);
        let dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin', dropHTML);
        let dropElem = this.previousSibling;
        addDnDHandlers(dropElem);
    }
    this.classList.remove('over');
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragenter', handleDragEnter, false);
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);
}

// Declare an array to store tasks
let tasksArray = [];

// Add task function
function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const taskList = document.getElementById('task-list');
        const newTask = document.createElement('div');
        newTask.className = 'task';
        newTask.draggable = true;
        newTask.innerHTML = `<input type="checkbox"> ${taskText}`;
        taskList.appendChild(newTask);
        addDnDHandlers(newTask);

        // Push task to the tasks array
        tasksArray.push(taskText);

        taskInput.value = '';
    } else {
        alert('Please enter a task!');
    }
}

// Save selected tasks function
function saveSelectedTasks() {
    const selectedTasks = [];
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            selectedTasks.push(task.textContent.trim());
        }
    });

    // Update tasksArray with selected tasks
    tasksArray = selectedTasks;

    // Render tasks in the table
    renderTaskTable();
}


function renderTaskTable() {
    const tableBody = document.querySelector('#task-table tbody');
    tableBody.innerHTML = ''; // Clear previous table rows

    tasksArray.forEach((task, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${task}</td>
            <td>
                <button class="edit-btn" onclick="editTask(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// // Function to edit a task
// function editTask(index) {
//     const newTask = prompt('Enter the new task:');
//     if (newTask !== null && newTask.trim() !== '') {
//         tasksArray[index] = newTask.trim();
//         renderTaskTable();
//     }
// }

// // Function to delete a task
// function deleteTask(index) {
//     tasksArray.splice(index, 1);
//     renderTaskTable();
// }

document.addEventListener('DOMContentLoaded', () => {
    const taskButton = document.getElementById('task-button');
    const taskInput = document.getElementById('task-input');
    const saveSelectedTasksButton = document.getElementById('save-selected-tasks');

    taskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    saveSelectedTasksButton.addEventListener('click', saveSelectedTasks);

    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        addDnDHandlers(task);
    });
});
