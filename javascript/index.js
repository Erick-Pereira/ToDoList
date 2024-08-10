const localStorageKey = 'to-do-list-gn'
function addTask() {
    let input = document.getElementById('Input-Task')


    if(!input.value){
      alert('Digite algo para inserir em sua lista');
    }
    else{
      let values = JSON.parse(localStorage.getItem(localStorageKey)|| "[]")
      let lenght = values.lenght
      if(lenght == null){
        lenght=0;
      }
      console.log(lenght)
      console.log(values)
      console.log(values.lenght);
      lenght++;
      values.push({
        id: lenght,
        name: input.value,
        finished: false
      })
      console.log(values)
      localStorage.setItem(localStorageKey,JSON.stringify(values));
      showValues();
    }
  }
  function deleteTask(){
    console.log("Eu não sei oq eu vou fazer aqui")
  }
  function checou(){
    console.log("aaaaaaaaa")
  }

  function showValues(){
    let values = JSON.parse(localStorage.getItem(localStorageKey)|| "[]")
    let list = document.getElementById('toDoList')
    list.innerHTML= ''
    for(let i = 0; i<values.lenght; i++)
      {
        list.innerHTML += `<li>${values[i]['name']}<button id='btn-ok' onClick='removeItem()'></button></li>`
      }
  }
  showValues();

  function removeItem(data){
    console.log(data)
    let values = JSON.parse(localStorage.getItem(localStorageKey)|| "[]")
  }