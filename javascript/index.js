const localStorageKey1 = 'to-do-list-gn';
const localStorageKey2 = 'to-do-list-dn';

document.getElementById('add-task-button').addEventListener('click', addTask);

function addTask() {
    let input = document.getElementById('Input-Task');
    if (!input.value.trim()) {
        alert('Digite algo para inserir em sua lista');
        return;
    }
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    let length = values.length;
    length = length ? length : 0;
    length++;
    values.push({
        id: length,
        name: input.value,
        finished: false
    });
    localStorage.setItem(localStorageKey1, JSON.stringify(values));
    input.value = '';
    showValues();
}

function showValues() {
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    let list = document.getElementById('toDoList');
    list.innerHTML = '';
    values.forEach(task => {
        let comp = task.finished ? `<del>${task.name}</del>` : task.name;
        let check = task.finished ? 'checked' : '';
        list.innerHTML += `
            <li>
                <input type="checkbox" ${check} onclick="handleCheckboxChange(${task.id})">
                <span style="margin-left: 10px;">${comp}</span>
                <button onclick="finalizeItem(${task.id})">Finalizar</button>
                <button onclick="editItem(${task.id})">Editar</button>
                <button onclick="removeItem(${task.id})">Deletar</button>
            </li>
        `;
    });
    showFinishedTasks();
}

function showFinishedTasks() {
    let values = JSON.parse(localStorage.getItem(localStorageKey2) || "[]");
    let list = document.getElementById('finished');
    list.innerHTML = '';
    values.forEach(task => {
        list.innerHTML += `
            <li>
                <span>${task.name}</span>
            </li>
        `;
    });
}

function removeItem(id) {
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    values = values.filter(task => task.id !== id);
    localStorage.setItem(localStorageKey1, JSON.stringify(values));
    showValues();
}

function finalizeItem(id) {
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    let finishedTasks = JSON.parse(localStorage.getItem(localStorageKey2) || "[]");
    let task = values.find(task => task.id === id);
    if (task) {
        task.finished = true;
        finishedTasks.push(task);
        values = values.filter(task => task.id !== id);
        localStorage.setItem(localStorageKey1, JSON.stringify(values));
        localStorage.setItem(localStorageKey2, JSON.stringify(finishedTasks));
        showValues();
    }
}

function handleCheckboxChange(id) {
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    let task = values.find(task => task.id === id);
    if (task) {
        task.finished = !task.finished;
        localStorage.setItem(localStorageKey1, JSON.stringify(values));
        showValues();
    }
}

function editItem(id) {
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    let task = values.find(task => task.id === id);
    if (task) {
        let newName = prompt('Edit task:', task.name);
        if (newName !== null && newName.trim() !== '') {
            task.name = newName;
            localStorage.setItem(localStorageKey1, JSON.stringify(values));
            showValues();
        }
    }
}

// Initial call to show tasks
showValues();
