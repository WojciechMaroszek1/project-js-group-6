import Notiflix from 'notiflix';
import { renderModal } from './tmdb_api';
import { renderMovies } from './tmdb_api';
import { fetchMovies } from './tmdb_api';
import { options } from './tmdb_api';

const baseUrl = 'https://api.themoviedb.org/3';
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

const libraryGallery = document.querySelector('.library-gallery');

// Początek obsługi przycisków
const btnWatched = document.getElementById('btn-watched');
const btnQueue = document.getElementById('btn-queue');

document.addEventListener('DOMContentLoaded', function () {
  btnWatched.addEventListener('click', () => {
    const watchedMoviesArray = JSON.parse(localStorage.getItem('watched'));
    if (watchedMoviesArray) {
      loadMovies(watchedMoviesArray);
      btnWatched.classList.add('header-library__button-active');
      btnQueue.classList.remove('header-library__button-active');
    } else {
      Notiflix.Notify.failure('brak zapisanych filmów na tablicy Watched');
      btnWatched.classList.add('header-library__button-active');
      btnQueue.classList.remove('header-library__button-active');
    }
  });

  btnQueue.addEventListener('click', () => {
    // console.log('header_QUEUE');
    const queueMoviesArray = JSON.parse(localStorage.getItem('queue'));
    if (queueMoviesArray) {
      loadMovies(queueMoviesArray);
      btnQueue.classList.add('header-library__button-active');
      btnWatched.classList.remove('header-library__button-active');
    } else {
      Notiflix.Notify.failure('brak zapisanych filmów na tablicy Queue');
      btnQueue.classList.add('header-library__button-active');
      btnWatched.classList.remove('header-library__button-active');
    }
  });

  // Koniec obsługi przycisków

  document.addEventListener('DOMContentLoaded', function () {
    //Event listener i funkcja otwierająca modal
    libraryGallery.addEventListener('click', event => {
      console.log('movieList');
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
  
            <li class="card" id="toogle-film-card" data-id="${id}" data-type="movie" data-modal-open>
             
                <img class="card__img" src="${moviePoster}" data-img="${moviePoster}" loading="lazy" alt="${movieTitle}" />
                             <div class="card__info">
        <p class="card__title">${movieTitle}</p>
        <p class="card__desc">${releaseDate}</p>
      </div>
              </li>
              

            `;
      })
      .join('');

    libraryGallery.innerHTML = markup;
    // addModalListenerFunction();
  }
});
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Konice obsługi LIBRARY
