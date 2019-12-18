import $ from 'jquery';
import api from './api';
import store from './store';

const generateItemElement = function (item) {
  let itemID = `
    <li class="js-item-element" data-item-id="${item.id}">
    <button type="button" class="collapsible">
    `;
  let itemExpand = '<div class="hidden">';
  let stars = generateStars(item.rating);
  if (item.filter) {
    itemID = `
      <li class="hidden" data-item-id="${item.id}">
      <button type="button" class="hidden">
      `;
  }
  if(item.expand) {
    itemExpand = '<div class="content">';
  }
  return `
    ${itemID}
      <span class="bookmark-item">${item.title} </span>
      <span>${stars}</span>
    </button>
    ${itemExpand}
      <a href="${item.url}">Visit Site</a>
      <p>${item.desc} </p>
      <button class="bookmark-item-delete js-item-delete">
      <span class="button-label">Delete</span>
      </button>
    </div>
  </li>
  `;
};

const generatebookmarkItemsString = function (bookmarkList) {
  const items = bookmarkList.map((item) => generateItemElement(item));
  return items.join('');
};

const generateStars = function(rating) {
  let html =[];
  for(let i = 0; i < 5; i++) {
    if (i < rating)
      html.push(' <span class = "star">&#9733;</span> ');
    else
      html.push(' <span class = "star">&#9734;</span> ');
  }
  return html.join('');
};

const generateAddItemForm = function () {
  let addItemHtml = `
    <label for="bookmark-list-entry">Add a bookmark</label>
    <input type="text" name="bookmark-list-entry" class="name-entry" placeholder="e.g., YouTube" required> 
    <label for="bookmark-list-entry-url">Link the URL</label>
    <input type="text" name="bookmark-list-entry-url" class="url-entry" placeholder="e.g., YouTube.com" required>
    <label for="bookmark-list-entry-rate">Rating (1-5)</label>
    <input type="text" name="bookmark-list-entry-rate" class="rate-entry" placeholder="Ex. 3" min=1 max=5 step=1 required>
    <label for="bookmark-list-entry-desc">Description</label>
    <input type="text" name="bookmark-list-entry-desc" class="desc-entry" placeholder="(optional)">
    <button type="submit">Create</button>
    <input type="button" class="cancel" name="cancel" value="Cancel"/>
  `;
  
  $('#js-bookmark-list-form').html(addItemHtml);
};

const generateDefaultForm = function () {
  return `
    <button class = "addButton">Add a Bookmark</button>
    <select class="filter">
      <option value="" selected disabled hidden>Filter By</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    `;
};

const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const render = function () {
  renderError();
  let items = [...store.items];
  const bookmarkListItemsString = generatebookmarkItemsString(items);
  $('#js-bookmark-list-form').html(generateDefaultForm);
  $('.js-bookmark-list').html(bookmarkListItemsString);
};

const handleNewItemAdd = function () {
  $('#js-bookmark-list-form').on('click', '.addButton', event => {
    event.preventDefault();
    generateAddItemForm();
  });
};

const handleNewItemSubmit = function () {
  $('#js-bookmark-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.name-entry').val();
    $('.name-entry').val('');
    const newItemURL = $('.url-entry').val();
    $('.url-entry').val('');
    const newItemDesc = $('.desc-entry').val();
    $('.desc-entry').val('');
    const newItemRate = $('.rate-entry').val();
    $('.rate-entry').val('');
    api.createItem(newItemName, newItemURL, newItemDesc, newItemRate)
      .then((newItem) => {
        store.addItem(newItem);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
 
  });
};


const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

const handleDeleteItemClicked = function () {
  $('.js-bookmark-list').on('click', '.js-item-delete', event => {
    const id = getItemIdFromElement(event.currentTarget);
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleFilterBy = function () {
  $('#js-bookmark-list-form').on('change', '.filter', event => {
    event.preventDefault();
    const star =  parseInt($(event.currentTarget).children('option:selected').val());
    store.setFilter(star);
    render();
  });
};

const handleCollapsible = function () {
  $('.js-bookmark-list').on('click', '.collapsible', event => {
    const id = getItemIdFromElement(event.currentTarget);
    store.setExpand(id);
    render();
  });
};

const handleCancel = function () {
  $('#js-bookmark-list-form').on('click', '.cancel', event => {
    event.preventDefault();
    render();
  });
};

const bindEventListeners = function () {
  handleNewItemSubmit();
  handleNewItemAdd();
  handleDeleteItemClicked();
  handleFilterBy();
  handleCloseError();
  handleCollapsible();
  handleCancel();
};

export default {
  render,
  bindEventListeners
};