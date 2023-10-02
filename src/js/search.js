import { showLoader, hideLoader } from '../loader';
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('header_form');
  const movieList = document.querySelector('.movies');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchInput = document.getElementById('header_input').value;

    searchMovies(searchInput, movieList);
  });
});

async function searchMovies(query, movieList) {
  showLoader();
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDVlODZlMjc2NGU5ODNhODNiMzhlOWM3ZTczOTc1MSIsInN1YiI6IjY1MTFjOTI0YTkxMTdmMDBlMTkzNDUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsP1_BpjRsEtLOVsHhzyIZ6UsRr54tXlsvMn6Ob4lmQ'; // Zastąp swoim kluczem API
  const baseUrl = 'https://api.themoviedb.org/3';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };
  const apiUrl = `${baseUrl}/search/movie?query=${query}`;
  try {
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    const movies = data.results;
    renderMovies(movies, movieList);
    hideLoader();
  } catch (error) {
    console.error('Błąd pobierania danych:', error);
    hideLoader();
  }
}

function renderMovies(data, movieList) {
  movieList.innerHTML = '';

  const movieListContent = data
    .map(e => {
      return `<li class="card">
            <img
              src="https://image.tmdb.org/t/p/w500/${e.poster_path}"
              alt="${e.title}"
              class="card__img"
            />
            <div class="card__info">
              <p class="card__title">${e.title}</p>
              <p class="card__desc">${e.release_date.slice(0, 4)}</p>
            </div>
          </li>`;
    })
    .join('');

  movieList.innerHTML = movieListContent;
}
