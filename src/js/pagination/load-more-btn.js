import 'js-loading-overlay';
export const loadingSpinnerConfig = {
  overlayBackgroundColor: '#666666',
  overlayOpacity: 0.2,
  spinnerIcon: 'ball-grid-pulse',
  spinnerColor: '#ff6b08',
  spinnerSize: '3x',
  offsetY: 0,
  overlayZIndex: 10,
  spinnerZIndex: 20,
};

export const MoviesService = {
  _page: 1,
  _param: 'popular',
  _query: '',
  async getMovies() {
    try {
      const response = await axios.get(
        `${BASE_URL}/movie/${this.param}?api_key=${API_KEY}&page=${this.page}`,
      );
      const genres = await getGenres();
      let { results, total_pages } = response.data;

      results = getFilteredMovies(results, genres);
      copy = JSON.stringify({ results });
      return { results, total_pages };
    } catch (error) {
      showNotifyError('Something went wrong &#128543;');
    }
  },

  async getMoviesBySearch() {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&query=${this._query}&include_adult=false`,
      );
      const genres = await getGenres();
      let { results, total_pages } = response.data;

      results = getFilteredMovies(results, genres);

      copy = JSON.stringify({ results });
      return { results, total_pages };
    } catch (error) {
      showNotifyError('Something went wrong &#128543;');
    }
  },

  get page() {
    return this._page;
  },

  set page(newPage) {
    this._page = newPage;
  },

  get param() {
    return this._param;
  },

  set param(newParam) {
    this._param = newParam;
  },

  get query() {
    return this._query;
  },

  set query(newQuery) {
    this._query = newQuery;
  },
};

export async function markupMoviesGalleryBySearch(arr) {
  try {
    const markup = arr
      .map(item => {
        return `<li class="card">
        <div class="img-thumb">
        <picture>
        <source
          srcset="https://image.tmdb.org/t/p/w780/${
            item.poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : item.poster_path
          }"
          media="(min-width: 1280px)"
        />
        <source
          media="(min-width: 768px)"
          srcset="https://image.tmdb.org/t/p/w500/${
            item.poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : item.poster_path
          }"
        />
        <source
          media="(min-width: 320px)"
          srcset="https://image.tmdb.org/t/p/w342/${
            item.poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : item.poster_path
          }"
        />
        <img
          srcset="https://image.tmdb.org/t/p/w342/${
            item.poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : item.poster_path
          }"
          src="https://image.tmdb.org/t/p/w342/${
            item.poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : item.poster_path
          }"
          alt="${item.title}"
          class="card__img" loading="lazy"
        />
      </picture>
      </div>
      <a href="#" data-id="${item.id}" class="card-link">
          <h2 class="card__title">${item.title}</h2>
          </a>
          <p class="card__description" data-id="${item.id}">
            <span class="card__genre tooltip">${
              !item.previewGenres ? `unknown genre` : item.previewGenres
            } 
            <span class="tooltiptext">${
              !item.allGenres ? `unknown genre` : item.allGenres
            }</span> | ${
          !item.release_date ? 'released' : moment(item.release_date).format('YYYY')
        }</span>
            <span class="card__rating visually-hidden">${item.vote_average}</span>
          </p>
      </li>`;
      })
      .join('');

    galleryList.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    Notify.failure('Something went wrong &#128543;');
  }
}
// Rendering markup after on Load More Button 'click'
export const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  className: 'visually-hidden',
  isHide: true,
  callback: async e => {
    try {
      JsLoadingOverlay.show(loadingSpinnerConfig);
      MoviesService.page += 1;
      const { results, total_pages } = await MoviesService.getMoviesBySearch();

      if (MoviesService.page === total_pages || results.length === 0) {
        loadMoreBtn.hide();
      }

      markupMoviesGalleryBySearch(results);
      JsLoadingOverlay.hide();
    } catch (error) {
      console.log(error);
    }
  },
});
