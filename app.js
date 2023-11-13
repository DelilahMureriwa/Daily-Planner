//all elements we will use
const itemForm = document.getElementById(`item-form`);
const itemInput = document.getElementById(`item-input`);
const itemList = document.getElementById(`item-list`);
const clearButton = document.getElementById(`clear`);
const itemFilter = document.getElementById(`filter`);
const formButton = itemForm.querySelector(`button`);
let isEditMode = false;

//FUNCTIONS:-

//DISPAY STORAGE ITEMS
function displayStorageItems(event) {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

//ADD ITEM SUBMITED
function onAddItemSubmit(event) {
  event.preventDefault();

  //create new variable to store input value
  const newItem = itemInput.value;

  //Validate Input
  if (newItem === "") {
    alert(`Please add item`);
    return;
  }

  //check for edit mode
  //remove the old item and replace with new itea
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(`.edit-mode`);

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove(`edit-mode`);
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert(`That item already exists`);
      return;
    }
  }

  //create item to DOM element
  addItemToDOM(newItem);

  //Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = "";
}

//ADD ITEM TO DOM
function addItemToDOM(item) {
  const li = document.createElement(`li`);
  li.appendChild(document.createTextNode(item));

  const button = createButton(`remove-item btn-link text-red`);
  li.appendChild(button);

  itemList.appendChild(li);
}

//CREATE BUTTON
function createButton(classes) {
  const button = document.createElement(`button`);
  button.className = classes;
  const icon = createIcon(`fa-solid fa-xmark`);
  button.appendChild(icon);
  return button;
}

//CREATE ICON
function createIcon(classes) {
  const icon = document.createElement(`i`);
  icon.className = classes;
  return icon;
}

//ADD ITEM TO LOCAL STORAGE
function addItemToStorage(item) {
  //check to see if we item already exists in the storage
  const itemsFromStorage = getItemFromStorage();

  //Add item to array
  itemsFromStorage.push(item);

  //Convert to JSON string and set to local storage
  localStorage.setItem(`items`, JSON.stringify(itemsFromStorage));
}

//GET ITEMS FROM STORAGE
function getItemFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem(`items`) === null) {
    //if there is null, set empty array
    itemsFromStorage = [];
  } // add item to items from storge
  else {
    itemsFromStorage = JSON.parse(localStorage.getItem(`items`));
  }

  //return items from storage
  return itemsFromStorage;
}

//
function onClickItem(event) {
  if (event.target.parentElement.classList.contains(`remove-item`)) {
    removeItem(event.target.parentElement.parentElement);
  } else {
    setItemToEdit(event.target);
  }
}

//REMOVE DUPLICATE ITEMS
function checkIfItemExist(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

//UPDATE ITEM
function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll(`li`)
    .forEach((i) => i.classList.remove(`edit-mode`));
  item.classList.add(`edit-mode`);
  formButton.innerHTML = `<i class="fa-solid fa-pen"> </i> Update Item`;
  formButton.style.background = `#24403e`;

  itemInput.value = item.textContent;
}

//REMOVE ITEM
// give a condition that if the event.target"s parent Element has a classList, with a className of (remove.Item),
//target parentElement - buttion, parentElement - listItem

function removeItem(item) {
  if (confirm(`Are you sure you want to delete item?`)) {
    //Remove item from DOM
    item.remove();

    //Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

//REMOVE ITEM FROM STORAGE // call frunction in removeItem function
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  //Filter out item to be removed using the filter method
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  //Re-set to localstorage
  localStorage.setItem(`items`, JSON.stringify(itemsFromStorage));
}

//CLEAR ALL
//can use the innerHTML = "" - method
function clearItems(e) {
  //simple method
  //itemList.innerHTML = ""
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);

    //clear from localStorage
    localStorage.removeItem("items");

    checkUI();
  }
}

//FILTER ITEMS
function filterItems(event) {
  const items = itemList.querySelectorAll(`li`);
  const text = event.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = `flex`;
    } else {
      item.style.display = `none`;
    }
  });
}

//CHECK IF ITEM EXISTS
function checkUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll(`li`);

  if (items.length === 0) {
    clearButton.style.display = `none`;
    itemFilter.style.display = `none`;
  } else {
    clearButton.style.display = `block`;
    itemFilter.style.display = `block`;
  }

  formButton.innerHTML = `<i class="fa-solid fa-plus"></i> Add Item`;
  formButton.style.backgroundColor = `#333`;
  isEditMode = false;
}

//EVENT LISTENERS

//INITIALIZE APP
function initializeApp() {
  itemForm.addEventListener(`submit`, onAddItemSubmit);
  itemList.addEventListener(`click`, onClickItem);
  clearButton.addEventListener(`click`, clearItems);
  itemFilter.addEventListener(`input`, filterItems);
  document.addEventListener(`DOMContentLoaded`, displayStorageItems);

  checkUI();
}

initializeApp();
