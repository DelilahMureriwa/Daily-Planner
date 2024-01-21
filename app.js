const inputForm = document.querySelector("#form-item");
let inputItem = document.querySelector(".input-field");
const submitButton = document.getElementById("submit-button");
const items = document.getElementById("items");
const clear = document.getElementById("clear");
const filter = document.getElementById("filter");
let isEditMode = false;

function displayItemsToDOM() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.classList = "item";
  li.textContent = item;

  const button = deleteBtn();
  li.appendChild(button);

  items.appendChild(li);
}

function addItem(e) {
  e.preventDefault();
  const itemInput = inputItem.value;

  if (itemInput !== "") {
    if (isEditMode) {
      const itemToEdit = items.querySelector(".edit-mode");
      removeItemFromStorage(itemToEdit.textContent);
      itemToEdit.remove();
      isEditMode = false;
    } else {
      if (checkIfItemExist(itemInput)) {
        alert("Item already exists!");
        inputItem.value = "";
        return;
      }
    }
    addItemToDOM(itemInput);
    addItemToLocalStorage(itemInput);
    checkUI();
    inputItem.value = "";
  } else {
    alert("Please add item");
  }
}

function addItemToLocalStorage(item) {
  //call getItemsFromStorage
  let itemsFromStorage = getItemsFromStorage();

  //push items
  itemsFromStorage.push(item);

  //set items to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(item) {
  let itemsFromStorage = localStorage.getItem("items");
  if (itemsFromStorage === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(itemsFromStorage);
  }

  return itemsFromStorage;
}

function deleteBtn() {
  const button = document.createElement("buttton");
  button.classList = "delete";
  const i = document.createElement("i");
  i.classList.add("fa-solid", "fa-trash");
  i.style.color = "#0f2523";
  button.appendChild(i);
  return button;
}

function onClickItem(e) {
  if (
    e.target.classList.contains("fa-trash") ||
    e.target.classList.contains("delete")
  ) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    editItem(e.target);
  }
}

function editItem(item) {
  isEditMode = true;

  items.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  submitButton.innerHTML = `
      <i class="fa-solid fa-pen"></i> Update Item
    `;
  submitButton.style.background = "#eaa200";
  inputItem.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you sure you want to delete item?")) {
    item.remove();
  }

  removeItemFromStorage(item.textContent);

  checkUI();
}

function removeItemFromStorage(itemText) {
  const itemsFromStorage = getItemsFromStorage();

  //method 1
  //itemsFromStorage = itemsFromStorage.filter((i) => i !== item)

  //method 2
  const index = itemsFromStorage.indexOf(itemText);

  if (index !== -1) {
    itemsFromStorage.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
  }
}

function clearItems() {
  items.innerHTML = "";

  //method 2
  // while(items.firstChild){
  //     items.removeChild(items.firstChild)
  // }

  //Remove from local storage
  //localStorage.clear(); method 1

  localStorage.removeItem("items");

  checkUI();
}

function filterItems() {
  let item = items.querySelectorAll("li");
  item.forEach((i) => {
    let list = i.textContent.toLowerCase();
    let filterValue = filter.value.toLowerCase();
    if (list.includes(filterValue)) {
      i.style.display = "flex";
    } else {
      i.style.display = "none";
    }
  });
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  if (itemsFromStorage.includes(item)) {
    return true;
  } else {
    false;
  }
}

function checkUI() {
  if (items.children.length === 0) {
    filter.style.display = "none";
    clear.style.display = "none";
  } else {
    filter.style.display = "block";
    clear.style.display = "block";
  }

  submitButton.innerHTML = `
      <i class="fa-solid fa-plus"></i> Add Item
    `;
  submitButton.style.background = "#24514e";

  isEditMode = false;
}

checkUI();

function initialization() {
  clear.addEventListener("click", clearItems); //clear
  items.addEventListener("click", onClickItem); // remove
  inputForm.addEventListener("submit", addItem); // add item from form to list
  filter.addEventListener("input", filterItems); //filter items
  document.addEventListener("DOMContentLoaded", displayItemsToDOM); // display items on DOM
}

initialization();
