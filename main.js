const title = document.createElement('h1');
const tasksContainer = document.createElement('div');
const taskInput = document.createElement('input');
const createButton = document.createElement('button');
const tasksList = document.createElement('ul');

title.innerHTML = "TODOs";
title.classList.add('header');

tasksContainer.classList.add('container');

taskInput.setAttribute('type', 'text');
taskInput.classList.add('task-input');

createButton.setAttribute('href', '#');
createButton.classList.add("create-button","far","fa-plus-square");

tasksList.classList.add('tasks-list');


document.body.append(title);
document.body.append(tasksContainer);
tasksContainer.append(taskInput);
tasksContainer.append(createButton);
tasksContainer.append(tasksList);


function getAllSiblings(elem) {
    let siblings = [];
    let sibling = elem.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }

    return siblings;
};

function addTask() {
    let value = document.querySelector('input[type=text]').value;
    const taskContainer = document.createElement('li');
    const task = document.createElement('p');
    
    const completeButton = document.createElement('button');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    taskContainer.classList.add('task-container');
    task.classList.add('task');
    task.innerHTML = value;

    completeButton.classList.add("comp-button","far","fa-check-square");
    completeButton.setAttribute('href', '#');

    editButton.classList.add("edit-button","far","fa-edit");
    editButton.setAttribute('href', '#');

    deleteButton.classList.add("delete-button","far","fa-trash-alt");
    deleteButton.setAttribute('href', '#');

    if (value != '') {
        tasksList.append(taskContainer);
        taskContainer.append(completeButton);
        taskContainer.append(task);
        taskContainer.append(editButton);
        taskContainer.append(deleteButton);
        document.querySelector('.task-input').value = '';
    }
}

function completeTask(event) {
    const completeButton = event.target;
    const task = completeButton.nextElementSibling;
    const siblings = getAllSiblings(completeButton);

    if (completeButton.classList.contains('comp-button')) {
        task.style.textDecoration = "line-through";
        completeButton.remove();
        siblings[1].remove();
        siblings[2].remove();
    }
    else return;
}

function editTask(event) {
    const editButton = event.target;
    const editTaskInput = document.createElement('input');
    editTaskInput.setAttribute('type', 'text');

    if (editButton.classList.contains('edit-button')) {
        const siblings = getAllSiblings(editButton);
        const task = siblings[1];
        const deleteButtton = siblings[2];
        const completeButton = siblings[0];

        editTaskInput.value = task.innerHTML;
        task.replaceWith(editTaskInput);
        task.remove();
        editButton.classList.remove("edit-button","fa-edit");
        editButton.classList.add("save-button","fa-save");
        deleteButtton.classList.add("disabled");
        completeButton.classList.add("disabled");
        deleteButtton.setAttribute('disabled', '');
        completeButton.setAttribute('disabled', '');
        tasksList.removeEventListener('click', editTask);
        tasksList.addEventListener('click', saveTask);
    }
    else return;
}

function saveTask(event) {
    const saveButton = event.target;
    const task = document.createElement('p');

    if (saveButton.classList.contains('save-button')) {
        const siblings = getAllSiblings(saveButton);
        const editTaskInput = siblings[1];
        const deleteButtton = siblings[2];
        const completeButton = siblings[0];

        task.innerHTML = editTaskInput.value;
        editTaskInput.replaceWith(task);
        task.classList.add('task');
        editTaskInput.remove();
        saveButton.classList.add("edit-button","fa-edit");
        saveButton.classList.remove("save-button","fa-save");
        deleteButtton.classList.remove("disabled");
        completeButton.classList.remove("disabled");
        deleteButtton.removeAttribute('disabled', '');
        completeButton.removeAttribute('disabled', '');

        tasksList.removeEventListener('click', saveTask);
        tasksList.addEventListener('click', editTask);
    }
    else return;
}

function deleteTask(event) {

    if (event.target.classList.contains('delete-button')) {
        const item = event.target.closest('li');
        item.remove();
    }
    else return;
}



tasksList.addEventListener('click', editTask);
tasksList.addEventListener('click', completeTask);
tasksList.addEventListener('click', deleteTask);
createButton.addEventListener('click', addTask);