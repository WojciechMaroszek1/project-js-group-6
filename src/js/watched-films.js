import axios from 'axios';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  position: 'center-top',
  timeout: 1000,
});
import renderMovies from './tmdb_api';

const btnWatched = document.getElementById('btn-watched');
const btnQueue = document.getElementById('btn-queue');

// Założenie, przyciski na modalu dodają i usuwają elementy z local Storage (watched / queue)
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
