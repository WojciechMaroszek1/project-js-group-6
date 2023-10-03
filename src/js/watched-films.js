import axios from 'axios';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  position: 'center-top',
  timeout: 1000,
});
import renderMovies from './tmdb_api';

const btnWatched = document.getElementById('btn-watched');
const btnQueue = document.getElementById('btn-queue');

// console.log(data);

// Funkcja dodająca film do localStorage

function addToLocalStorage(movieId, listType) {
  const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
  if (!moviesList.includes(movieId)) {
    moviesList.push(movieId);
    localStorage.setItem(listType, JSON.stringify(moviesList));
  }
}

// Funkcja usuwająca film z localStorage po listType

function removeFromLocalStorage(movieId, listType) {
  const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
  const updatedList = moviesList.filter(id => id !== movieId);
  localStorage.setItem(listType, JSON.stringify(updatedList));
}

function checkMovieInLocalStorage(movieId, listType) {
  const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
  return moviesList.includes(movieId);
}
export { addToLocalStorage, removeFromLocalStorage, checkMovieInLocalStorage };

// Założenie, przyciski na modalu dodają i usuwają elementy z local Storage ListType => (watched / queue)

window.addEventListener('DOMContentLoaded', event => {
  // Oczekiwanie na załadowanie struktury DOM
  btnWatched.addEventListener('click', () => {
    const watchedMoviesArray = JSON.parse(localStorage.getItem('watched'));
    if (watchedMoviesArray) {
      loadMovies(watchedMoviesArray);
    } else {
      Notiflix.Notify.failure('brak obejrzanych filmów');
    }
  });

  btnQueue.addEventListener('click', () => {
    const queueMoviesArray = JSON.parse(localStorage.getItem('queue'));
    if (queueMoviesArray) {
      loadMovies(queueMoviesArray);
    } else {
      Notiflix.Notify.failure('brak filmów do obejrzenia');
    }
  });
});

// Ładowanie listy filmów po id (results.id)
