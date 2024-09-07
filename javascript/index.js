const localStorageKey1 = "to-do-list-gn"; // Lista de tarefas pendentes
const localStorageKey2 = "to-do-list-dn"; // Lista de tarefas finalizadas

document.getElementById("add-task-button").addEventListener("click", addTask);
document.getElementById("filter-by").addEventListener("change", showValues); // Adiciona o listener para mudança de filtro

function addTask() {
  let input = document.getElementById("Input-Task");
  let priority = document.getElementById("Input-Priority").value;
  if (!input.value.trim()) {
    alert("Digite algo para inserir em sua lista");
    return;
  }
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
  let length = values.length;
  length = length ? length : 0;
  length++;

  values.push({
    id: length,
    name: input.value,
    finished: false,
    priority: priority,
    date: new Date().toISOString(), // Adiciona a data atual
  });
  localStorage.setItem(localStorageKey1, JSON.stringify(values));
  input.value = "";
  showValues();
}

function showValues() {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
  let filter = document.getElementById("filter-by").value;

  // Ordena a lista com base no filtro
  values.sort((a, b) => {
    if (filter === "name") {
      return a.name.localeCompare(b.name);
    } else if (filter === "priority") {
      //Consertado, agora ordena corretamente da maior prioridade para a menor
      return a.priority.localeCompare(b.priority);
    } else if (filter === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (filter === "status") {
      // Ordena primeiro por status (checked antes de unchecked) e depois por data
      return a.finished - b.finished || new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  let list = document.getElementById("toDoList");
  list.innerHTML = "";
  values.forEach((task) => {
    let comp = task.finished ? `<del>${task.name}</del>` : task.name;
    let check = task.finished ? "checked" : "";
    let priorityClass = task.priority;
    list.innerHTML += `
            <li class="${priorityClass}">
                <input type="checkbox" ${check} onclick="handleCheckboxChange(${
      task.id
    })">
                <span style="margin-left: 10px;">${comp} - ${new Date(
      task.date
    ).toLocaleDateString()}</span>
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
  let list = document.getElementById("finished");
  list.innerHTML = "";
  values.forEach((task) => {
    list.innerHTML += `
            <li>
                <span>${task.name} - ${new Date(
      task.date
    ).toLocaleDateString()}</span>
                <button onclick="moveToDo(${task.id})">Reverter</button>
                <button onclick="deleteFinished(${task.id})">Deletar</button>
            </li>
        `;
  });
}

function removeItem(id) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
  values = values.filter((task) => task.id !== id);
  localStorage.setItem(localStorageKey1, JSON.stringify(values));
  showValues();
}

function finalizeItem(id) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
  let finishedTasks = JSON.parse(
    localStorage.getItem(localStorageKey2) || "[]"
  );
  let task = values.find((task) => task.id === id);
  if (task.finished !== false) {
    //Adicionado um motivo para que o checkbox exista.
    task.finished = true;
    finishedTasks.push(task);
    values = values.filter((task) => task.id !== id);
    localStorage.setItem(localStorageKey1, JSON.stringify(values));
    localStorage.setItem(localStorageKey2, JSON.stringify(finishedTasks));
    showValues();
  } else {
    alert("Tarefa ainda não cumprida!");
  }
}

function handleCheckboxChange(id) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
  let task = values.find((task) => task.id === id);
  if (task) {
    task.finished = !task.finished;
    localStorage.setItem(localStorageKey1, JSON.stringify(values));
    showValues();
  }
}

function editItem(id) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
  let task = values.find((task) => task.id === id);
  if (task) {
    let newName = prompt("Edit task:", task.name);
    if (newName !== null && newName.trim() !== "") {
      task.name = newName;
      localStorage.setItem(localStorageKey1, JSON.stringify(values));
      showValues();
    }
  }
}

function moveToDo(id) {
  let finishedTasks = JSON.parse(
    localStorage.getItem(localStorageKey2) || "[]"
  );
  let task = finishedTasks.find((task) => task.id === id);
  if (task) {
    task.finished = false;
    let toDoList = JSON.parse(localStorage.getItem(localStorageKey1) || "[]");
    toDoList.push(task);
    finishedTasks = finishedTasks.filter((task) => task.id !== id);
    localStorage.setItem(localStorageKey1, JSON.stringify(toDoList));
    localStorage.setItem(localStorageKey2, JSON.stringify(finishedTasks));
    showValues();
  }
}

function deleteFinished(id) {
  let finishedTasks = JSON.parse(
    localStorage.getItem(localStorageKey2) || "[]"
  );
  finishedTasks = finishedTasks.filter((task) => task.id !== id);
  localStorage.setItem(localStorageKey2, JSON.stringify(finishedTasks));
  showFinishedTasks();
}

// Chamada inicial para exibir tarefas
showValues();
