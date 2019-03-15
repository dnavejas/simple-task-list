let db;
function initDatabase() {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.")
    }
    let request = window.indexedDB.open("employees", 1);
    request.onerror = function(event) {
        console.log(event);
    };
    request.onsuccess = function(event) { 
        db = request.result;
        console.log("success: " + db);
    };
    request.onupgradeneeded = function(event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore("employee", {keyPath: "id"});
      
      for (var i in employeeData) {
         objectStore.add(employeeData[i]);
      }
   }
}
function add() {
    let name = document.querySelector("#name").value;
    let id = document.querySelector("#id").value;
    let email = document.querySelector("#email").value;
    let age = document.querySelector("#age").value;
    let tel = document.querySelector("#tel").value;
    let comment = document.querySelector("#comment").value;


    console.log(tel, comment)

    var request = db.transaction(["employee"], "readwrite")
    .objectStore("employee")
    .add({id: id, name: name, age: age, email: email, tel: tel, comment: comment});

    request.onsuccess = function(event) {
        alert(`${name} has been added to your database.`);
    };

    request.onerror = function(event) {
    alert(`Unable to add data\r\n${name} is already in your database! `);
    }
}

function read() {
   var transaction = db.transaction(["employee"]);

   var objectStore = transaction.objectStore("employee");

   var request = objectStore.get("00-03");
   
   request.onerror = function(event) {
      alert("Unable to retrieve daa from database!");
   };
   
   request.onsuccess = function(event) {
      if(request.result) {
         alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
      }
      
      else {
         alert("Kenny couldn't be found in your database!");
      }
   };
}

function readAll() {
   var objectStore = db.transaction("employee").objectStore("employee");
   objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
         alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
         cursor.continue();
      }
      
      else {
         alert("No more entries!");
      }
   };
}

function remove() {
    let delid = document.querySelector("#delid").value;
   var request = db.transaction(["employee"], "readwrite")
   .objectStore("employee")
   .delete(delid);
   
   request.onsuccess = function(event) {
      alert("Entry has been removed from your database.");
   };
}
// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("li");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("span");
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
  if (ev.target.tagName === 'li') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myinput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myul").appendChild(li);
  }
  document.getElementById("myinput").value = "";

  var span = document.createElement("span");
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
 
initDatabase();