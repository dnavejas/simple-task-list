let db;
function initDatabase() {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.")
    }
    let request = window.indexedDB.open("honeytodo", 1);

    request.onerror = function(event) {
        console.log(event);
    };
    request.onsuccess = function(event) { 
        db = request.result;
        console.log("success: " + db);
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("todo", {keyPath: "id", autoIncrement:true});
   }
}
function add() {
    let name = document.getElementById("myInput").value;
    console.log(name)

    var request = db.transaction(["todo"], "readwrite")
    .objectStore("todo")
    .add({name: name});

    request.onsuccess = function(event) {
        alert(`${name} has been added to your database.`);
    };

    request.onerror = function(event) {
    alert(`Unable to add data\r\n${name} is already in your database! `);
    }

    readAll()
}

function read() {
   var transaction = db.transaction(["todo"]);

   var objectStore = transaction.objectStore("todo");

   var request = objectStore.get("Pay bills");
   
   request.onerror = function(event) {
      console.log("Unable to retrieve data from database!");
      alert("Unable to retrieve data from database!");
   };
   
   request.onsuccess = function(event) {
      if(request.result) {
         alert("Name: " + request.result.name);
      }
      
      else {
         alert("Pay mortgage couldn't be found in your database!");
      }
   };
}

function readAll() {
   clearList();

   var objectStore = db.transaction("todo").objectStore("todo");
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         console.log("Name:" + cursor.value.name);
         // newElement(cursor.value.name);
         addEntry(cursor.value.name, cursor.value.id)
         cursor.continue();
      }
      
      else {
         console.log("No more entries!");
         alert("No more entries!");
      }
   };
}


function addEntry(name, id) {
   var listItem = document.createElement('li');
   listItem.class = 'entry';
   listItem.innerHTML = name + `<button class="remove-btn" onclick="remove(${id})">X</button>`;
   document.querySelector("#entries").appendChild(listItem);
}


function remove(id) {
   var request = db.transaction(["todo"], "readwrite")
    .objectStore("todo")
    .delete(id);

   request.onerror = function(event) {
      console.log("Unable to delete item");
   };
   
   request.onsuccess = function(event) {
      console.log("Deleted successfully");
   };

   readAll();
}


function clearList() {
   document.querySelector("#entries").innerHTML = " ";
}

initDatabase();


var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);


  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}