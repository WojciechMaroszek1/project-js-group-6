// SMP - Save Modal Project
// (,,◕　⋏　◕,,)

import Notiflix from 'notiflix';
Notiflix.Notify.init({
  position: 'center-top',
  timeout: 1000,
});
import { AUTH_KEY } from './js/tmdb_api';
const BASE_URL = 'https://api.themoviedb.org/3';

// Funkcja dodająca film do localStorage
function addToLocalStorage(movieId, listType) {
  const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
  if (!moviesList.includes(movieId)) {
    moviesList.push(movieId);
    localStorage.setItem(listType, JSON.stringify(moviesList));
  }
}

// Funkcja usuwająca film z localStorage
function removeFromLocalStorage(movieId, listType) {
  const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
  const updatedList = moviesList.filter(id => id !== movieId);
  localStorage.setItem(listType, JSON.stringify(updatedList));
}

function checkMovieInLocalStorage(movieId, listType) {
  const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
  return moviesList.includes(movieId);
}

async function fetchMovieById(movieId) {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${AUTH_KEY}`);
    const responseObject = await response.json();
    return responseObject;
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function addClickListenerToCards(movieId) {
  const backdrop = document.querySelector('.backdrop-movie');
  const modalCloseButton = document.querySelector('[data-modal-close]');
  const modalTitle = document.querySelector('.modal-movie__title');
  const modalPoster = document.querySelector('.modal-movie__poster');
  const modalVote = document.querySelector('.modal-movie__vote');
  const modalVoteCount = document.querySelector('.modal-movie__vote_count');
  const modalPopularity = document.querySelector('.modal-movie__popularity');
  const modalOriginalTitle = document.querySelector('.modal-movie__original-title');
  const modalGenre = document.querySelector('.modal-movie__genre');
  const modalDescription = document.querySelector('.modal-movie__text');

  Notiflix.Block.arrows('.modal-movie', {
    svgSize: '80px',
    svgColor: '#ff6b08',
    backgroundColor: '#ffffff',
  });

  function getPosterLink(movie) {
    if (movie.poster_path == null) {
      return `https://img.freepik.com/darmowe-zdjecie/kolaz-w-tle-filmu_23-2149876032.jpg?w=740&t=st=1685302200~exp=1685302800~hmac=8c53b6db3490cd10fa6f9535b417ac3d7181839ed50758564abb2784f02a1611`;
    } else {
      return `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    }
  }

  const movieData = await fetchMovieById(movieId);
  const moviePoster =
    movieData.poster_path != null
      ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
      : noMoviePoster;

  // renderowanie danych
  modalTitle.textContent = movieData.title || movieData.name;
  modalPoster.src = `${moviePoster}`;
  modalVote.textContent = movieData.vote_average.toFixed(1);
  modalVoteCount.textContent = movieData.vote_count;
  modalPopularity.textContent = movieData.popularity;
  modalOriginalTitle.textContent = movieData.original_title || movieData.original_name;
  const genreNames = movieData.genres.map(genre => genre.name).join(', ');
  modalGenre.textContent = genreNames;
  modalDescription.textContent = movieData.overview;
  Notiflix.Block.remove('.modal-movie');

  // otwórz modal

  backdrop.classList.remove('modal-movie-is-hidden');

  // zamknij modal po kliknięciu na btn close
  modalCloseButton.addEventListener('click', () => {
    backdrop.classList.add('modal-movie-is-hidden');
  });

  //MIKI dodaje kod do zamykania na ESC i clik poza modal

  const closeMovieModal = () => {
    backdrop.classList.add('modal-movie-is-hidden');
  };

  const closeMovieModalOnEsc = e => {
    if (e.key === 'Escape') {
      closeMovieModal();
    }
    window.removeEventListener('keydown', closeMovieModalOnEsc);
  };
  window.addEventListener('keydown', closeMovieModalOnEsc);

  backdrop.addEventListener('mousedown', onOutsideMovieModalClick);
  backdrop.addEventListener('click', onOutsideMovieModalClick);
  function onOutsideMovieModalClick(e) {
    if (e.target === backdrop) {
      closeMovieModal();
    }
    backdrop.removeEventListener('click', onOutsideMovieModalClick);
  }

  //////////////////// LOCAL STORAGE //////////////////////

  const watchedButton = document.createElement('button');
  watchedButton.className = 'modal-movie__btn-watched';
  watchedButton.textContent = 'Add to watched';

  const queueButton = document.createElement('button');
  queueButton.className = 'modal-movie__btn-queue';
  queueButton.textContent = 'Add to queue';

  const modalMovieBox = document.querySelector('.modal-movie__box');

  while (modalMovieBox.firstChild) {
    modalMovieBox.removeChild(modalMovieBox.firstChild);
  }

  modalMovieBox.appendChild(watchedButton);
  modalMovieBox.appendChild(queueButton);

  let isMovieInWatched;
  let isMovieInQueue;

  // Sprawdzenie, czy dany film znajduje się w localStorage
  isMovieInWatched = checkMovieInLocalStorage(movieData.id, 'watched');
  isMovieInQueue = checkMovieInLocalStorage(movieData.id, 'queue');

  watchedButton.textContent = isMovieInWatched ? 'ON THE WATCHED ✓' : 'Add to watched';
  queueButton.textContent = isMovieInQueue ? 'ON THE QUEUE ✓' : 'Add to queue';

  watchedButton.addEventListener('click', function () {
    if (isMovieInWatched) {
      removeFromLocalStorage(movieData.id, 'watched');
    } else {
      addToLocalStorage(movieData.id, 'watched');
    }

    isMovieInWatched = !isMovieInWatched;
    watchedButton.textContent = isMovieInWatched ? 'ADDED ✓' : 'Add to watched';
  });

  queueButton.addEventListener('click', function () {
    if (isMovieInQueue) {
      removeFromLocalStorage(movieData.id, 'queue');
    } else {
      addToLocalStorage(movieData.id, 'queue');
    }

    isMovieInQueue = !isMovieInQueue;
    queueButton.textContent = isMovieInQueue ? 'ADDED ✓' : 'Add to queue';
  });
}

export function addModalListenerFunction() {
  const movieCards = document.querySelectorAll('.card');
  movieCards.forEach(movieCard => {
    movieCard.addEventListener('click', () => {
      addClickListenerToCards(movieCard.dataset.id);
    });
  });
}

function createModal(movie) {
  const modalMovieEl = document.querySelector('.modal-movie');
  const backdrop = document.querySelector('.backdrop-movie');

  const modalMoviePosterBox = modalMovieEl.querySelector('.modal-movie__poster-box');
  const moviePoster = modalMoviePosterBox.querySelector('.modal-movie__poster');
  const closeModalBtn = modalMovieEl.querySelector('.modal-movie__btn-close');
  const modalMovieTitle = modalMovieEl.querySelector('.modal-movie__title');
  const modalMovieVote = modalMovieEl.querySelector('.modal-movie__vote');
  const modalMovieVoteCount = modalMovieEl.querySelector(
    '.modal-movie__item--value span:nth-child(2)',
  );
  const modalMoviePopularity = modalMovieEl.querySelector('.modal-movie__popularity');
  const modalMovieOriginalTitle = modalMovieEl.querySelector('.modal-movie__original-title');
  const modalMovieGenre = modalMovieEl.querySelector('.modal-movie__genre');
  const modalMovieDescription = modalMovieEl.querySelector('.modal-movie__text');
  const modalMovieBtnWatched = modalMovieEl.querySelector('.modal-movie__btn-watched');
  const modalMovieBtnQueue = modalMovieEl.querySelector('.modal-movie__btn-queue');
  const modalMovieBtnTrailer = modalMovieEl.querySelector('.modal-movie__btn-trailer');

  moviePoster.src = getPosterLink(movie);
  moviePoster.alt = movie.original_title;
  modalMovieTitle.textContent = movie.title;
  modalMovieVote.textContent = movie.vote_average.toFixed(1);
  modalMovieVoteCount.textContent = movie.vote_count;
  modalMoviePopularity.textContent = movie.popularity.toFixed(1);
  modalMovieOriginalTitle.textContent = movie.original_title;
  modalMovieGenre.textContent = movie.genres;
  modalMovieDescription.textContent = movie.overview;

  modalMovieBtnWatched.setAttribute('data-movie', encodeURIComponent(JSON.stringify(movie)));
  modalMovieBtnQueue.setAttribute('data-movie', encodeURIComponent(JSON.stringify(movie)));
  modalMovieBtnTrailer.setAttribute('data-id', movie.id);
  modalMovieBtnTrailer.setAttribute('data-btn', 'watchTrailer');
}

// LIBRARY LOAD

const libraryGallery = document.querySelector('.library-gallery');

const btnWatched = document.querySelector('.btn-watched');
const btnQueue = document.querySelector('.btn-queue');

btnWatched.addEventListener('click', () => {
  const watchedMoviesArray = JSON.parse(localStorage.getItem('watched'));
  if (watchedMoviesArray) {
    loadMovies(watchedMoviesArray);
    btnWatched.classList.add('opened');
    btnQueue.classList.remove('opened');
  } else {
    console.log('brak zapisanych filmów na tablicy Watched Movies');
    btnWatched.classList.add('opened');
    btnQueue.classList.remove('opened');
  }
});

btnQueue.addEventListener('click', () => {
  const queueMoviesArray = JSON.parse(localStorage.getItem('queue'));
  if (queueMoviesArray) {
    loadMovies(queueMoviesArray);
    btnQueue.classList.add('opened');
    btnWatched.classList.remove('opened');
  } else {
    console.log('brak zapisanych filmów na tablicy Queue');
    btnQueue.classList.add('opened');
    btnWatched.classList.remove('opened');
  }
});

async function loadMovies(movieIds) {
  try {
    const results = [];
    for (const movieId of movieIds) {
      const movieData = await fetchMovieById(movieId);
      results.push(movieData);
    }
    renderLibraryCards(results);
  } catch (error) {
    console.log('Błąd podczas pobierania danych filmów:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const watchedMoviesArray = JSON.parse(localStorage.getItem('watched'));

  try {
    if (watchedMoviesArray) {
      const results = [];
      for (const movieId of watchedMoviesArray) {
        const movieData = await fetchMovieById(movieId);
        results.push(movieData);
      }
      renderLibraryCards(results);
    } else {
      console.log('brak zapisanych filmów na tablicy Watched Movies');
    }
  } catch (error) {
    console.log('Błąd podczas pobierania danych filmów:', error);
  }
});

function renderLibraryCards(movies) {
  const markup = movies
    .map(({ poster_path, title, name, id, release_date, first_air_date, vote_average }) => {
      const movieTitle = title ? title : name;
      const vote = vote_average.toFixed(1);
      const releaseDate = (release_date || first_air_date || '').slice(0, 4);
      const moviePoster =
        poster_path != null ? `https://image.tmdb.org/t/p/w500${poster_path}` : noMoviePoster;
      return `

          <li class="movie-card" data-id="${id}" data-type="movie">
            <div class="movie-card__box">
              <img class="movie-card__img" src="${moviePoster}" data-img="${moviePoster}" loading="lazy" alt="${movieTitle}" />
            </div>
            <h2 class="movie-card__heading">${movieTitle}</h2>

            <span class="movie-card__caption">  ${releaseDate} <span class="library-vote"> ${vote} </span></span>
            </li>
          `;
    })
    .join('');

  libraryGallery.innerHTML = markup;
  addModalListenerFunction();
}
