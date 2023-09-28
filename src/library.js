import axios from 'axios';
import Notiflix from 'notiflix';
import { showLoader, hideLoader } from './loader';

const movieCard = document.getElementsByClassName('.card');
const moviePoster = document.getElementsByClassName('.card_img');
const searchQuery = 'Lord of the Rings';

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/search/movie',
  params: {
    query: `${searchQuery}`,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
  },
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDVlODZlMjc2NGU5ODNhODNiMzhlOWM3ZTczOTc1MSIsInN1YiI6IjY1MTFjOTI0YTkxMTdmMDBlMTkzNDUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsP1_BpjRsEtLOVsHhzyIZ6UsRr54tXlsvMn6Ob4lmQ',
  },
};
axios.interceptors.request.use(config => {
  showLoader();
  return config;
});
axios.interceptors.response.use(
  response => {
    hideLoader();
    return response;
  },
  error => {
    hideLoader();
    return Promise.reject(error);
  },
);
const searchFilm = async () => {
  return await axios
    .request(options)
    .then(function (response) {
      console.log(response.data.results);
    })
    .catch(function (error) {
      Notiflix.Notify.failure('failed to load data, try again');
      console.error(error);
    });
};

searchFilm();

// const loadFilms = () => {
//   searchFilm()
//     .then(response => {response.data.id})
//     .catch(error => console.log(error));
// };
