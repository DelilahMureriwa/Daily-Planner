const saveItemBtn = document.getElementById("save-button");
const clearItemBtn = document.getElementById("clear-item-button");
const deleteItemBtn = document.getElementById("delete-item-button");


//store information on page
function displayItemsTODOM() {
  const storedValues = localStorage.getItem("userValues");
  if (storedValues) {
    const parsedValues = JSON.parse(storedValues);
    parsedValues.forEach((item) => {
      displaySavedItem(item);
    });
  }
}


function AddToDoItem() {
  const addItem = document.getElementById("add-item").value;
  const itemDescription = document.getElementById("description-text").value;
  let startDate = document.getElementById("start").value;
  let endDate = document.getElementById("end").value;
  const closeModal = document.getElementById("exampleModal");
  const fade = document.querySelector(".modal-backdrop");

  //display date in card
  if (startDate && endDate) {
    const valuesToSave = {
      item: addItem,
      description: itemDescription,
      startDate: startDate,
      endDate: endDate,
    };

    //display items saved in storage
    displaySavedItem(valuesToSave); // Display with current form values
    saveItemToLocalStorage(valuesToSave); // Save the item to local storage

    //close the modal on submit
    closeModal.style.display = "none";
    fade.classList.remove("modal-backdrop");
    // document.getElementById("myForm").reset();
    let removeItems = document.querySelectorAll(".form-control");
    removeItems.forEach((item) => {
      item.value = "";
      location.reload(); // reload to remove information in the form on submit
    });
    startDate.reset();
    endDate.reset();
  } else {
    alert("Please enter valid start and end dates.");
  }
}

//display information on page
function displaySavedItem(userValues) {
  const row = document.querySelector(".row");

  if (userValues && userValues.item !== undefined) {
    const div = document.createElement("div");
    div.classList.add("col-sm-3");
    div.setAttribute("id", "item-card");
    div.innerHTML = `
      <div class="card text-bg-warning mb-3" style="max-width: 18rem">
        <div class="card-header">
          <i id="fa-square" class="fa-regular fa-square"></i>
          <span id="card-header">${userValues.item}</span>
          <i class="fa-regular fa-trash-can"></i>
        </div>
        <div class="card-body" id="card-body">
          <div class="card-body">
            <p class="card-text">${userValues.description}</p>
            <div class="card-title">Start Date: ${formatDate(
              userValues.startDate
            )}</div>
            <div class="card-title end-date">Due Date: ${formatDate(
              userValues.endDate
            )}</div>
          </div>
        </div>
      </div>
    `;

    row.appendChild(div);

    //delete item from local storage
    const deleteBtn = div.querySelector(".fa-trash-can");
    deleteBtn.addEventListener("click", function () {
      row.removeChild(div);
      removeItemFromLocalStorage(userValues); // Remove the item from local storage
    });

    
    let checkBoxBtn = div.querySelector(".fa-square");
    checkBoxBtn.addEventListener("click", function () {
    checkBoxBtn.classList.remove("fa-square");
    checkBoxBtn.classList.add("fa-square-check");
    // row.removeChild(div);
    // removeItemFromLocalStorage(userValues);
    
    });
  }
}


//format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toString() !== "Invalid Date"
    ? date.toLocaleDateString(undefined, options)
    : "Invalid Date";
}

//save items from local storage
function saveItemToLocalStorage(item) {
  if (localStorage.getItem("userValues")) {
    const storedValues = JSON.parse(localStorage.getItem("userValues"));
    storedValues.push(item);
    localStorage.setItem("userValues", JSON.stringify(storedValues));
  } else {
    const itemsArray = [item];
    localStorage.setItem("userValues", JSON.stringify(itemsArray));
  }
}


//remove / delete items from local storage
function removeItemFromLocalStorage(item) {
  if (localStorage.getItem("userValues")) {
    const storedValues = JSON.parse(localStorage.getItem("userValues"));
    const updatedItemsArray = storedValues.filter((existingItem) => {
      return existingItem.item !== item.item;
    });
    localStorage.setItem("userValues", JSON.stringify(updatedItemsArray));
  }
}



//clear items in local storage
function clearList() {
  const row = document.querySelector(".row");
  row.innerHTML = "";
  localStorage.removeItem("userValues"); // Remove all stored values when clearing the list
}



function init(){
  clearItemBtn.addEventListener("click", clearList);
  saveItemBtn.addEventListener("click", AddToDoItem);
  window.addEventListener("load", displayItemsTODOM);
}

init()

