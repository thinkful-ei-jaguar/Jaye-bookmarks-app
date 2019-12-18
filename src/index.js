import $ from 'jquery';
import './index.css';
import api from './api';
import store from './store';
import bookmarkList from './bookmark-list';

const main = function () {
  api.getItems()
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarkList.render();
    });
  bookmarkList.bindEventListeners();
  bookmarkList.render();
};

$(main);