const localStorageKey1 = 'to-do-list-gn'
const localStorageKey2 = 'to-do-list-dn'
function addTask() {
  let input = document.getElementById('Input-Task')
  if (!input.value) {
    alert('Digite algo para inserir em sua lista');
  }
  else {
    let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]")
    let length = values.length
    if (length == null) {
      length = 0;
    }
    length++;
    values.push({
      id: length,
      name: input.value,
      finished: false
    })
    localStorage.setItem(localStorageKey1, JSON.stringify(values));
    input.innerText= '';
    showValues();
  }
}

function showValues() {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]")
  let list = document.getElementById('toDoList')
  list.innerHTML = ''
  for (let i = 0; i < values.length; i++) {
    let comp = `${values[i].name}`
    let check = '';
    if (values[i].finished) {
      comp = `<del>${values[i].name}</del>`
      check = 'checked';
    }
    list.innerHTML += `<li><input type="checkbox"
                      ${check} onClick="handleCheckboxChange(${values[i].id})"><span style={{ marginLeft: "10px" }}> 
                      ${comp}
                      </span> <button id='btn-finalizar' onClick='finalizarItem(${values[i].id})'>finalizar</button><button id='btn-edit' onClick='editItem(${values[i].id})'>Editar</button><button id='btn-delete' onClick='removeItem(${values[i].id})'>Deletar</button></li>`
  }
}
showValues();

function removeItem(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]")
  let index = values.findIndex(x => x.id == data)
  values.splice(index, 1)
  localStorage.setItem(localStorageKey1, JSON.stringify(values))
  showValues()
}
function finalizarItem(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]")
  let values2 = JSON.parse(localStorage.getItem(localStorageKey2)|| "[]")
  let index = values.findIndex(x => x.id == data)
  values2.push(values[index]);
  values.splice(index, 1)
  localStorage.setItem(localStorageKey2,)
  localStorage.setItem(localStorageKey1, JSON.stringify(values))
  showValues()
}

function handleCheckboxChange(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey1) || "[]")
  let index = values.findIndex(x => x.id == data)
  let value = values[index]
  value.finished = !value.finished
  values[index] = value;
  localStorage.setItem(localStorageKey1, JSON.stringify(values))
  showValues()
}