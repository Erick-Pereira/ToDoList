function addTask() {
    var task = document.getElementById("Task").value;
    taskList.push(task);
      var b = "<div name=tasks id=tasks><input type=checkbox onClick=checou()><p>"+task+"</p><button onClick=deleteTask()>Delete</button></div>"
      var c = document.getElementById("toDoList");
      c.innerHTML = c.innerHTML + b;
    document.getElementById("Task").value = "";
    console.log(taskList);
  }
  var taskList = []

  function deleteTask(){
    console.log("Eu não sei oq eu vou fazer aqui")
  }
  function checou(){
    console.log("aaaaaaaaa")
  }