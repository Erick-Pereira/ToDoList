const localStorageKey = 'to-do-list-gn'
function addTask() {
  let input = document.getElementById('Input-Task')
  if (!input.value) {
    alert('Digite algo para inserir em sua lista');
  }
  else {
    let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
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
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    showValues();
  }
}

function showValues() {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
  let list = document.getElementById('toDoList')
  list.innerHTML = ''
  for (let i = 0; i < values.length; i++) {
    let comp = `${values[i].name}`
    let check = '';
    if (values[i].finished) {
      comp = `<del>${values[i].name}</del>`
      check = 'checked';
    }
    list.innerHTML += `<li><input type="checkbox" ${check} onClick="handleCheckboxChange(${values[i].id})"><span style={{ marginLeft: "10px" }}> 
                        ${comp}
                        </span> <button id='btn-delete' onClick='removeItem(${values[i].id})'></button></li>`
  }
}
showValues();

function removeItem(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
  let index = values.findIndex(x => x.id == data)
  values.splice(index, 1)
  localStorage.setItem(localStorageKey, JSON.stringify(values))
  showValues()
}

function handleCheckboxChange(data) {
  let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]")
  let index = values.findIndex(x => x.id == data)
  let value = values[index]
  value.finished = !value.finished
  values[index] = value;
  localStorage.setItem(localStorageKey, JSON.stringify(values))
  showValues()
}