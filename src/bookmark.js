/* eslint-disable quotes */
import $ from 'jquery';

import store from './store';
import api from './api';

//* HTML generating functions *//
const generateHomeHTML = function() {
  return `
    <h1>Welcome to Josh's Bookmarks!</h1>
    <section class="bookmark-container">
      <section class="button-container">
        <button name="js-add-new-button" class="js-add-new-button add-new-button">
            <span class="button-label">Add new bookmark!</span>
        </button>
        <span class="rating-filter-label">Filter by rating!</span>
        <select id="ratingFilter" name="ratingFilter" aria-label="desired-bookmark-rating">
          <option value="0"> 0 </option>              
          <option value="1"> &#xf185 </option>
          <option value="2"> &#xf185 &#xf185 </option>
          <option value="3"> &#xf185 &#xf185 &#xf185 </option>
          <option value="4"> &#xf185 &#xf185 &#xf185 &#xf185 </option>
          <option value="5"> &#xf185 &#xf185 &#xf185 &#xf185 &#xf185 </option>            
        </select>
      </section>
      <ul name="bookmarked-pages" class="js-bookmarked-pages">
        <li></li>
      </ul>
    <div class="errorContainer"></div>
    </section>`;
};

const generateNewBookmarkHTML = function() {
  return `
    
        <section class="home-container">
        <form id="bookmarkForm" class="bookmark-form">
          <h1>Add a new bookmark:</h1>
                <section class="form-box">
                    <label for="bookmark-entry"></label>
                    <span>Website Name:</span>
                    <input type="text" name="bookmarkTitle" class="js-bookmark-title" placeholder="google" aria-label="new-bookmark-name" required>
                </section>
                <section class="form-box">
                    <label for="website-url"></label>
                    <span>Website Url:</span>
                    <input type="text" name="websiteURL" class="js-bookmark-entry" placeholder="https://google.com" aria-label="Bookmark url starts with https://" required>
                </section>
                <section class="form-box">
                <label for="bookmarkRating">Bookmark Rating</label>                
                <select name="ratingSelect-zero-to-five" id='ratingSelect' aria-label="Bookmark-rating">
                  <option value="1"> &#xf185 </option>
                  <option value="2"> &#xf185 &#xf185 </option>
                  <option value="3"> &#xf185 &#xf185 &#xf185 </option>
                  <option value="4"> &#xf185 &#xf185 &#xf185 &#xf185 </option>
                  <option value="5"> &#xf185 &#xf185 &#xf185 &#xf185 &#xf185 </option>
                </select>                
                </section>
                <section class="form-box">
                    <label for="website-description">Description:</label>
                    <textarea type="text" 
                    name="descriptionForm" 
                    id='descriptionForm' 
                    placeholder="Why you do you like this website?"
                    aria-label="Enter what you like about this site."></textarea>
                </section>
                <section class="form-box">
                    <button type="submit" name="submitBookmark">Add Bookmark</button>
                </section>
                <div class="error-container"></div>
        </form>         
        </section>`;
};

const generateBookmarkElementCondensed = function(bookmark) {
  let bookmarkTitle = `<span class="bookmarked-pages">${bookmark.title}</span>`;
    
  return `
  <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
    ${bookmarkTitle}
    <span class="bookmarked-star-rating">${bookmark.ratingByStars}</span>  
    <section class="bookmark-controls" name="bookmark-controls">
      <button class="bookmark-expand-details js-bookmark-expand">
        <span class="bookmark-label" name="expand-bookmark">Expand Bookmark</span>
      </button>
      <button class="bookmark-delete js-bookmark-delete">
        <span class="bookmark-label">Delete Bookmark</span>
      </button>    
    </section>
    </li>`;
};

const generateBookmarkElementExpanded = function(bookmark) {
  let bookmarkTitle = `<span class="bookmarked-pages">${bookmark.title}</span>`;
  if (store.adding) {
    bookmarkTitle = `
        <form class="js-edit-bookmark-form">
            <input name="bookmark-edit" class="bookmark-edit" type="text" placeholder="${bookmark.title}" required/>
            <button type="submit" class="submit-edit js-edit-bookmark">Submit Edit</button>
        </form>`;
  }

  return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
    ${bookmarkTitle}
    <span class="bookmarked-star-rating">${bookmark.ratingByStars}</span>
      <section class="link-container"><a href="${bookmark.url}" target="_blank">${bookmark.title}</a></section>    
    <article class="description-container">${bookmark.desc}</article>      
    <form>
      <button class="bookmark-delete js-bookmark-delete">
        <span class="bookmark-label">delete</span>
      </button>
      <button class="js-edit-button edit-button">
        <span class="bookmark-label">Edit Title</span>
      </button>
    </form>   
    </li>
    `;
};


const generateBookmarks = function(bookmarks) {
  // const allBookmarks = store.bookmarks.map((bookmark) => generateBookmarkElementCondensed(bookmark));
  const someBookmarks = [];
  //filter by rating needs to come first.
  store.bookmarks.map((bookmark) => {
    if (bookmark.rating >= $('#ratingFilter').val() || ($('#ratingFilter') === undefined)) {
      if (bookmark.expanded) {
        someBookmarks.push(generateBookmarkElementExpanded(bookmark));
      } else {
        someBookmarks.push(generateBookmarkElementCondensed(bookmark));
      }
    }
  });
  return someBookmarks.join('');
};

const generateError = function(message) {
  return `
  <section class="error-content">
  <button id="cancel-error">
  <span aria-label="close-error-message">X</span>
  </button>
  <p>${message}</p>
  </section>
  `;
};

//* Rendering functions *//

const renderError = function() {
  if (store.error) {
    const el = generateError(store.error);
    $('.errorContainer').html(el);
  } else {
    $('.errorContainer').empty();
  }
};


function renderNewBookmarkPage() {
  $('main').html(generateNewBookmarkHTML());
}

function render() {
  renderError();
  let bookmarks = [...store.bookmarks];
  const bookmarksElementString = generateBookmarks(bookmarks);
  $('main').html(generateHomeHTML);
  $('.js-bookmarked-pages').html(bookmarksElementString);
}


//* Event Handler Functions *//


function handleNewBookmarkClick() {
  $('main').on('click', '.js-add-new-button', (event) => {
    event.preventDefault();
    renderNewBookmarkPage();
  });
}

function handleNewBookmarkSubmit() {
  $('main').on('submit', '#bookmarkForm', (event) => {
    event.preventDefault();

    let newBookmark = {
      "title": $('input[name=bookmarkTitle]').val(),
      "url": $('input[name=websiteURL]').val(),
      "desc": $('#descriptionForm').val(), //input[name=] doesn't work for these two..
      "rating": $('#ratingSelect').val(),
    };
    api.createBookmark(newBookmark)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        render();
      })
      .catch((error) => {
        console.log('catch', error);
        store.setError(error.message);
        renderError();
      });
    render();
  });
}

const getBookmarkIdFromElement = function(bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleDeleteBookmarkClick = function() {
  $('main').on('click', '.js-bookmark-delete', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);

    api.deleteBookmark(id)
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

const handleExpandedClick = function() {
  $('main').on('click', '.js-bookmark-expand', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    store.findAndExpand(id);
    render();
  });
};

const handleRatingFilterSelect = function() {
  $('main').on('change', '#ratingFilter', event => {
    event.preventDefault();
    render();
  });
};

const handleBookmarkEditClick = function() {
  $('main').on('click', '.js-edit-button', event => {
    event.preventDefault();
    store.adding = true;
    render();
  });
};



const handleEditBookmarkSubmit = function() {
  $('main').on('submit', '.js-edit-bookmark-form', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    const newBookmarkTitle = { "title": $('input[name=bookmark-edit]').val() };

    console.log(id);
    api.updateBookmark(id, newBookmarkTitle)
      .then(() => {
        store.findAndUpdate(id, newBookmarkTitle);
        store.adding = false;
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        render();
      });
  });
};

const handleErrorCloseClicked = function() {
  $('main').on('click', '#cancel-error', event => {
    event.preventDefault();
    store.setError(null);
    render();
  });
};


function bindEventListeners() {
  handleNewBookmarkClick();
  handleNewBookmarkSubmit();
  handleDeleteBookmarkClick();
  handleExpandedClick();
  handleRatingFilterSelect();
  handleBookmarkEditClick();
  handleEditBookmarkSubmit();
  handleErrorCloseClicked();
}

//*  *//

export default {
  bindEventListeners,
  render,
};