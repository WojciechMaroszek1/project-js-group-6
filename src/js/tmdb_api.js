const AUTH_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDVlODZlMjc2NGU5ODNhODNiMzhlOWM3ZTczOTc1MSIsInN1YiI6IjY1MTFjOTI0YTkxMTdmMDBlMTkzNDUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsP1_BpjRsEtLOVsHhzyIZ6UsRr54tXlsvMn6Ob4lmQ';

const movieList = document.querySelector('.movies');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${AUTH_KEY}`,
  },
};

const fetchTrending = async () => {
  const baseUrl = 'https://api.themoviedb.org/3';
  const queries = ['trending/movie/day?language=pl-PL', 'genre/movie/list?language=pl'];

  const promiseArray = queries.map(async query => {
    const response = await fetch(`${baseUrl}/${query}`, options);
    return response.json();
  });
  const results = await Promise.all(promiseArray);

  return { data: results[0].results, genreList: results[1].genres };
};

export const renderMovies = (data, genreList) => {
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
        <p class="card__desc">${getGenres(e.genre_ids, genreList)} | ${e.release_date
        .toString()
        .slice(0, 4)}</p>
      </div>
    </li>`;
    })
    .join('');
  movieList.innerHTML += movieListContent;
};

const getGenres = (data, genreList) => {
  const filtered = genreList.filter(e => data.includes(e.id));
  return filtered.map(e => e.name).join(', ');
};

fetchTrending()
  .then(({ data, genreList }) => renderMovies(data, genreList))
  .catch(error => console.log(error));
