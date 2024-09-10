const localStorageKey1 = "http://localhost:3000/to-do-list-gn"; // Lista de tarefas pendentes
const localStorageKey2 = "http://localhost:3000/to-do-list-dn"; // Lista de tarefas finalizadas

document.getElementById("add-task-button").addEventListener("click", addTask);
document.getElementById("filter-by").addEventListener("change", getTasks); // Adiciona o listener para mudança de filtro

async function getTasks() {
  let dataPending = await fetch(localStorageKey1);
  let responsePending = await dataPending.json();
  showValues(responsePending);

  let dataFinished = await fetch(localStorageKey2);
  let responseFinished = await dataFinished.json();
  showFinishedTasks(responseFinished);
}

async function addTask() {
  let input = document.getElementById("Input-Task");
  let priority = document.getElementById("Input-Priority").value;
  if (!input.value.trim()) {
    alert("Digite algo para inserir em sua lista");
    return;
  }
  let values =
    (await fetch(localStorageKey1, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: input.value,
        finished: false,
        priority: priority,
        date: new Date().toISOString(),
      }),
    })) || "[]";

  input.value = "";
  getTasks();
}

function showValues(data) {
  let filter = document.getElementById("filter-by").value;
  console.log(data);
  // Ordena a lista com base no filtro
  data.sort((a, b) => {
    if (filter === "name") {
      return a.name.localeCompare(b.name);
    } else if (filter === "priority") {
      //Consertado, agora ordena corretamente da maior prioridade para a menor
      console.log(data);

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
  data.forEach((task) => {
    let comp = task.finished ? `<del>${task.name}</del>` : task.name;
    let check = task.finished ? "checked" : "";
    let priorityClass = task.priority;
    list.innerHTML += `
            <li class="${priorityClass}">
                <input type="checkbox" ${check} onclick="handleCheckboxChange('${
      task.id
    }')">
                <span style="margin-left: 10px;">${comp} - ${new Date(
      task.date
    ).toLocaleDateString()}</span>
                <button onclick="finalizeItem('${task.id}')">Finalizar</button>
                <button onclick="editItem('${task.id}')">Editar</button>
                <button onclick="removeItem('${task.id}')">Deletar</button>
            </li>
        `;
  });
}

function showFinishedTasks(data) {
  let list = document.getElementById("finished");
  list.innerHTML = "";
  data.forEach((task) => {
    list.innerHTML += `
            <li>
                <span>${task.name} - ${new Date(
      task.date
    ).toLocaleDateString()}</span>
                <button onclick="moveToDo('${task.id}')">Reverter</button>
                <button onclick="deleteFinished('${task.id}')">Deletar</button>
            </li>
        `;
  });
}

async function removeItem(id) {
  console.log(id);
  await fetch(`${localStorageKey1}/${id}`, {
    method: "DELETE",
  });
}

async function finalizeItem(id) {
  let dataPending = await fetch(localStorageKey1);
  let responsePending = await dataPending.json();

  let task = responsePending.find((task) => task.id === id);
  if (task.finished !== false) {
    //Adicionado um motivo para que o checkbox exista.
    task.finished = true;
    (await fetch(localStorageKey2, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    })) || "[]";
    removeItem(task.id);
  } else {
    alert("Tarefa ainda não cumprida!");
  }
}

async function handleCheckboxChange(id) {
  let data = await fetch(localStorageKey1);
  let response = await data.json();
  let task = response.find((task) => task.id === id);
  if (task) {
    task.finished = !task.finished;

    await fetch(`${localStorageKey1}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task), // Envia o objeto task atualizado
    });
  }
}

async function editItem(id) {
  let data = await fetch(localStorageKey1);
  let response = await data.json();
  let task = response.find((task) => task.id === id);
  if (task) {
    let newName = prompt("Edit task:", task.name);
    if (newName !== null && newName.trim() !== "") {
      task.name = newName;
      await fetch(`${localStorageKey1}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task), // Envia o objeto task atualizado
      });
    }
  }
}

async function moveToDo(id) {
  let dataFinished = await fetch(localStorageKey2);
  let responseFinished = await dataFinished.json();
  let task = responseFinished.find((task) => task.id === id);
  if (task) {
    task.finished = false;
    await fetch(`${localStorageKey1}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    deleteFinished(task.id);
  }
}

async function deleteFinished(id) {
  await fetch(`${localStorageKey2}/${id}`, {
    method: "DELETE",
  });
}
getTasks();
