import $ from 'jquery';

import 'normalize.css';
import './styles.css';

import bookmark from './bookmark';
import api from './api';
import store from './store';

function main() {

  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) =>
        store.addBookmark(bookmark));
      bookmark.render();
    });

  bookmark.bindEventListeners();
  bookmark.render();
}

$(main);