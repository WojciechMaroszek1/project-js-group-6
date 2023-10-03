import placeholder from '/src/images/nothing_to_see.jpg';

const AUTH_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDVlODZlMjc2NGU5ODNhODNiMzhlOWM3ZTczOTc1MSIsInN1YiI6IjY1MTFjOTI0YTkxMTdmMDBlMTkzNDUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsP1_BpjRsEtLOVsHhzyIZ6UsRr54tXlsvMn6Ob4lmQ';

const movieList = document.querySelector('.movies');
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

const fetchMovies = async () => {
  const baseUrl = 'https://api.themoviedb.org/3';
  const queries =
    currentSearch === 'trending'
      ? [`trending/movie/day?language=pl-PL&page=${currentPage}`, 'genre/movie/list?language=pl']
      : [
          `search/movie?language=pl-PL&query=${currentSearch}&page=${currentPage}`,
          'genre/movie/list?language=pl',
        ];
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
  return { data: results[0].results, genreList: results[1].genres };
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
      return `<li class="card" id="toogle-film-card">
      <button type="button" class="card__link">Watch trailer</button>
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
