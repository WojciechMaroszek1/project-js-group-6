import placeholder from '/src/images/nothing_to_see.jpg';
import { showLoader, hideLoader } from '../loader';
import Notiflix from 'notiflix';

const AUTH_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDVlODZlMjc2NGU5ODNhODNiMzhlOWM3ZTczOTc1MSIsInN1YiI6IjY1MTFjOTI0YTkxMTdmMDBlMTkzNDUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsP1_BpjRsEtLOVsHhzyIZ6UsRr54tXlsvMn6Ob4lmQ';
const baseUrl = 'https://api.themoviedb.org/3';
export const movieList = document.querySelector('.movies');
const pagination = document.querySelector('.pagination__numbers');
const btnPrev = document.querySelector('#button-prev');
const btnNext = document.querySelector('#button-next');

let currentPage = 1;
let totalPages = 1;
let currentSearch = 'trending';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${AUTH_KEY}`,
  },
};

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('header__form');
  const movieList = document.querySelector('.movies');

  fetchMovies()
    .then(({ data, genreList }) => {
      renderPagination(totalPages);
      window.addEventListener('resize', updateSize);
      renderMovies(data, genreList);
    })
    .catch(error => console.log(error));

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    currentSearch = document.getElementById('header__input').value
      ? document.getElementById('header__input').value
      : 'trending';
    currentPage = 1;
    fetchMovies()
      .then(({ data, genreList }) => {
        renderPagination(totalPages);
        renderMovies(data, genreList);
      })
      .catch(error => console.log(error));
  });
});

const fetchMovies = async query => {
  showLoader();
  try {
    // const baseUrl = 'https://api.themoviedb.org/3';
    const queries = query
      ? [`movie/${query}`, 'genre/movie/list']
      : currentSearch === 'trending'
      ? [`trending/movie/day?page=${currentPage}`, 'genre/movie/list']
      : [`search/movie?query=${currentSearch}&page=${currentPage}`, 'genre/movie/list'];
    const promiseArray = queries.map(async query => {
      const response = await fetch(`${baseUrl}/${query}`, options);
      return response.json();
    });
    const results = await Promise.all(promiseArray);
    if (results[0].total_pages > 500) {
      totalPages = 500;
    } else {
      totalPages = results[0].total_pages;
    }
    hideLoader();
    if (results[0].results) {
      return { data: results[0].results, genreList: results[1].genres };
    }
    return { data: results[0], genreList: results[1].genres };
  } catch (error) {
    hideLoader();
  }
};

export const renderMovies = (data, genreList) => {
  const movieListContent = data
    .map(e => {
      if (!e.poster_path) {
        e.poster_path = placeholder;
      } else {
        e.poster_path = `https://image.tmdb.org/t/p/w500/${e.poster_path}`;
      }
      if (!e.release_date) {
        e.release_year = 'No info';
      } else {
        e.release_year = e.release_date.toString().slice(0, 4);
      }
      if (e.genre_ids.length === 0) {
        e.genres = 'No info';
      } else {
        e.genres = getGenres(e.genre_ids, genreList);
      }
      return `<li class="card" id="toogle-film-card" data-id="${e.id}" data-modal-open>
      <img
        src="${e.poster_path}"
        alt="${e.title}"
        class="card__img"
      />
      <div class="card__info">
        <p class="card__title">${e.title}</p>
        <p class="card__desc">${e.genres} | ${e.release_year}</p>
      </div>
    </li>`;
    })
    .join('');
  movieList.innerHTML = movieListContent;
  let darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    let cardTitle = document.querySelectorAll('.card__title');
    cardTitle.forEach(e => e.classList.add('card__title--dark'));
  }
};

// Tutaj zaczyna się obsług otwarcia i zamknięcia modala po kliknięciu na kartę filmu

//Event listener i funkcja otwierająca modal
movieList.addEventListener('click', event => {
  if (event.target.closest('.card')) {
    document.body.classList.add('modal-film__stop-scrolling');
    const modalId = event.target.closest('.card').getAttribute('data-modal-target');
    fetchMovies(event.target.closest('.card').dataset.id)
      .then(({ data, genreList }) => {
        renderModal(data, genreList);
      })
      .catch(error => console.log(error));
    const modal = document.getElementById('modal-film');
    if (modal) {
      modal.classList.remove('is-hidden');
    }
  }
});

// Funkcja wypełniania modala treścią
const renderModal = (data, genreList) => {
  if (!data.poster_path) {
    data.poster_path = placeholder;
  } else {
    data.poster_path = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
  }
  if (!data.release_date) {
    data.release_year = 'No info';
  } else {
    data.release_year = data.release_date.toString().slice(0, 4);
  }
  if (data.genres.length === 0) {
    data.genres = 'No info';
  } else {
    data.genres = data.genres.map(e => e.name).join(', ');
  }
  const modalContent = `<div class="film-info">
      <img src="${data.poster_path}"  alt="${data.title}" class="film-info__poster" />
      <div class="film-info__wrapper">
        <h1 class="film-info__title">${data.title} (${data.release_year})</h1>
        <table class="film-info__table">
          <tbody>
            <tr>
              <td class="film-info__stats">Vote / Votes</td>
              <td><span class="film-info__vote">${data.vote_average}</span> / ${data.vote_count}</td>
            </tr>
            <tr>
              <td class="film-info__stats">Popularity</td>
              <td>${data.popularity}</td>
            </tr>
            <tr>
              <td class="film-info__stats">Original Title</td>
              <td class="film-info__orign-title">${data.original_title}</td>
            </tr>
            <tr>
              <td class="film-info__stats">Genre</td>
              <td>${data.genres}</td>
            </tr>
          </tbody>
        </table>
        <p class="film-info__about">About</p>
        <p class="film-info__descr">
          ${data.overview}
        </p>
        <div class="modal-film__btns">
      <button type="button" class="modal-film__btns-addToWatched add-watched">
        Add to watched
      </button>
      <button type="button" class="modal-film__btns-addToQueue add-queue">Add to queue</button>
    </div>
      </div>
      
    </div>`;
  // Wyłuskane ID filmu
  const movieId = data.id;
  console.log(movieId);
  // Koniec łuskania
  const modalCard = document.querySelector('.modal-film__card');
  modalCard.innerHTML = modalContent;
  const closeIcon = document.querySelector('.modal-film__icon-close');
  closeIcon.addEventListener('click', filmModalClose);

  // Funkcje obsługujące localStorage
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  function addToLocalStorage(movieId, listType) {
    let moviesList = JSON.parse(localStorage.getItem(listType)) || [];
    if (!moviesList.includes(movieId)) {
      moviesList.push(movieId);
      localStorage.setItem(listType, JSON.stringify(moviesList));
    }
  }

  // Funkcja usuwająca film z localStorage
  function removeFromLocalStorage(movieId, listType) {
    let moviesList = JSON.parse(localStorage.getItem(listType)) || [];
    let updatedList = moviesList.filter(id => id !== movieId);
    localStorage.setItem(listType, JSON.stringify(updatedList));
  }

  function checkMovieInLocalStorage(movieId, listType) {
    let moviesList = JSON.parse(localStorage.getItem(listType)) || [];
    return moviesList.includes(movieId);
  }

  // EventListenery na guzikach watched i queue, zapisujące id w localStorage
  const watchedButton = document.querySelector('.modal-film__btns-addToWatched');
  const queueButton = document.querySelector('.modal-film__btns-addToQueue');

  let isMovieInWatched;
  let isMovieInQueue;

  // Sprawdzenie, czy dany film znajduje się w localStorage
  isMovieInWatched = checkMovieInLocalStorage(movieId, 'watched');
  isMovieInQueue = checkMovieInLocalStorage(movieId, 'queue');

  watchedButton.textContent = isMovieInWatched ? 'ON THE WATCHED ✓' : 'Add to watched';
  queueButton.textContent = isMovieInQueue ? 'ON THE QUEUE ✓' : 'Add to queue';

  watchedButton.addEventListener('click', function () {
    if (isMovieInWatched) {
      removeFromLocalStorage(movieId, 'watched');
    } else {
      addToLocalStorage(movieId, 'watched');
    }

    isMovieInWatched = !isMovieInWatched;
    watchedButton.textContent = isMovieInWatched ? 'ADDED ✓' : 'Add to watched';
  });

  queueButton.addEventListener('click', function () {
    if (isMovieInQueue) {
      removeFromLocalStorage(movieId, 'queue');
    } else {
      addToLocalStorage(movieId, 'queue');
    }

    isMovieInQueue = !isMovieInQueue;
    queueButton.textContent = isMovieInQueue ? 'ADDED ✓' : 'Add to queue';
  });
};

// Funkcja enableScroll
function enableScroll() {
  const closeIcon = document.querySelector('.modal-film__icon-close');
  closeIcon.removeEventListener('click', filmModalClose);
  document.body.classList.remove('modal-film__stop-scrolling');
}

// Funkcja zamykająca modal
function filmModalClose() {
  const modal = document.getElementById('modal-film');
  const closeIcon = document.querySelector('.modal-film__icon-close');
  document.body.classList.remove('modal-film__stop-scrolling');
  enableScroll();
  if (modal) {
    modal.classList.add('is-hidden');
  }
}

const modalBackdrop = document.querySelector('.backdrop');
document.body.addEventListener('click', function (event) {
  if (event.target === modalBackdrop) {
    filmModalClose();
  }
});
// Koniec obsługi otwarcia i zamknięcia modala

// Początek obługi LIBRARY

async function fetchMovieById(movieId) {
  try {
    const response = await fetch(`${baseUrl}/movie/${movieId}`, options);
    const responseObject = await response.json();
    return responseObject;
  } catch (error) {
    console.error(error);
    return null;
  }
}
// fetchMovieById('678512');

// console.log(localStorage);
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Konice obsługi localStorage

const getGenres = (data, genreList) => {
  const filtered = genreList.filter(e => data.includes(e.id));
  return filtered.map(e => e.name).join(', ');
};

const renderPagination = total => {
  const currentPageBtn = `<button class="pagination__button" id="page-${currentPage}" data-page="${currentPage}" type="button">${currentPage}</button>`;
  const paginationContent = [currentPageBtn];
  let before = currentPage - 1;
  for (let i = 1; i <= 2; i++) {
    if (before <= 0) {
      break;
    }
    const pageBtn = `<button class="pagination__button" id="page-${currentPage - i}" data-page="${
      currentPage - i
    }" type="button">${currentPage - i}</button>`;
    before--;
    paginationContent.unshift(pageBtn);
  }

  let after = 5 - paginationContent.length;

  for (let i = 1; i <= after; i++) {
    if (currentPage + i > total) {
      break;
    }
    const pageBtn = `<button class="pagination__button" id="page-${currentPage + i}" data-page="${
      currentPage + i
    }" type="button">${currentPage + i}</button>`;
    paginationContent.push(pageBtn);
  }

  const currentPosition = paginationContent.findIndex(e => currentPageBtn) + 3;
  for (let i = currentPosition; i <= 4; i++) {
    if (paginationContent.length < 5 && currentPage - i > 0) {
      const pageBtn = `<button class="pagination__button" id="page-${currentPage - i}" data-page="${
        currentPage - i
      }" type="button">${currentPage - i}</button>`;
      before--;
      paginationContent.unshift(pageBtn);
    }
  }
  if (window.innerWidth >= 768) {
    const dots = '<span class="pagination__dots">...</span>';
    if (currentPage >= 4 && totalPages > 5) {
      const firstBtn = `<button class="pagination__button" id="page-1" data-page="1" type="button">1</button>`;
      paginationContent.unshift(dots);
      paginationContent.unshift(firstBtn);
    }
    if (totalPages - currentPage >= 3 && totalPages > 5) {
      const lastBtn = `<button class="pagination__button" id="page-${totalPages}" data-page="${totalPages}" type="button">${totalPages}</button>`;
      paginationContent.push(dots);
      paginationContent.push(lastBtn);
    }
  }

  pagination.innerHTML = paginationContent.join('');
  const activePage = document
    .querySelector(`#page-${currentPage}`)
    .classList.add('pagination__button--active');
  let darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    pagination.classList.add('pagination--dark');
    let pageBtn = document.querySelectorAll('.pagination__button');
    let pageCtrl = document.querySelectorAll('.pagination__controls');
    pageBtn.forEach(e => e.classList.add('pagination__button--dark'));
    pageCtrl.forEach(e => e.classList.add('pagination__controls--dark'));
  }
  btnNext.addEventListener('click', nextPage);
  btnPrev.addEventListener('click', prevPage);
  pagination.addEventListener('click', changePage);
};

function updateSize() {
  renderPagination(totalPages);
}

const nextPage = e => {
  if (currentPage === totalPages) {
    return;
  }
  btnNext.removeEventListener('click', nextPage);
  btnPrev.removeEventListener('click', prevPage);
  pagination.removeEventListener('click', changePage);
  currentPage++;
  fetchMovies()
    .then(({ data, genreList }) => {
      renderPagination(totalPages);
      renderMovies(data, genreList);
    })
    .catch(error => console.log(error));
};

const prevPage = e => {
  if (currentPage > 1) {
    btnNext.removeEventListener('click', nextPage);
    btnPrev.removeEventListener('click', prevPage);
    pagination.removeEventListener('click', changePage);
    currentPage--;
    fetchMovies()
      .then(({ data, genreList }) => {
        renderPagination(totalPages);
        renderMovies(data, genreList);
      })
      .catch(error => console.log(error));
  }
};

const changePage = e => {
  if (!e.target.dataset.page) {
    return;
  }
  btnNext.removeEventListener('click', nextPage);
  btnPrev.removeEventListener('click', prevPage);
  pagination.removeEventListener('click', changePage);
  currentPage = parseInt(e.target.dataset.page);
  fetchMovies()
    .then(({ data, genreList }) => {
      renderPagination(totalPages);
      renderMovies(data, genreList);
    })
    .catch(error => console.log(error));
};
