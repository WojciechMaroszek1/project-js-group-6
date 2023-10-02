import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import { ref, onValue } from 'firebase/database';
import { createModalFilm } from './created-modal-film';
import axios from 'axios';

export async function getMovieById(idMovie) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${idMovie}?api_key=${API_KEY}&language=en-US`,
    );
    return response.data;
  } catch (error) {
    showNotifyError('Something went wrong &#128543;');
  }
}
export async function getMovieTrailer(idMovie) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${idMovie}/videos?api_key=${API_KEY}&language=en-US`,
    );
    return response;
  } catch (error) {
    showNotifyError('Something went wrong &#128543;');
  }
}

export const removeW = 'remove from watched';
export const removeQ = 'remove from queue';
export const addW = 'add to watched';
export const addQ = 'add to queue';

// created request for movie db
export function openModalTrailer() {
  getMovieTrailer(openedFilmId)
    .then(createModalTrailer)
    .catch(error => {
      console.error(error);
    });
}
// rotates the movie object out of modal
function getMovieData(data) {
  chosenMovie = data;
}
// function activated after clicking the button in the movie's modal window (adding to the watched list)
function onAddToWatchedBtnClick(evt) {
  const dataObj = createMovieData(chosenMovie, userId);
  const btnTitle = evt.currentTarget.textContent;

  if (!isUserSignIn(userId)) {
    return;
  }

  // adds or removes from the list of watched videos in the database
  if (btnTitle.trim() === addW) {
    addMovieToWatched(dataObj);
  } else if (btnTitle.trim() === removeW) {
    removeMovieFromWatched(dataObj);
  }
  // console.log(openedFilmId);
  filterFilmByBtn(openedFilmId);
  // console.log(openedFilmId);
}
// function activated after clicking the button in the movie's modal window (add to drawer list)
function onAddToQueueBtnClick(evt) {
  const data = createMovieData(chosenMovie, userId);
  const btnTitle = evt.currentTarget.textContent;

  if (!isUserSignIn(userId)) {
    return;
  }

  // adds or removes from the list of films in the database
  if (btnTitle.trim() === addQ) {
    addMovieToQueue(data);
  } else if (btnTitle.trim() === removeQ) {
    removeMovieFromQueue(data);
  }
  // console.log(openedFilmId);
  filterFilmByBtn(openedFilmId);
  // console.log(openedFilmId);
}
export { onAddToWatchedBtnClick, onAddToQueueBtnClick, getMovieData };
export const homePage = document.body;
export const addToWatchedBtn = document.querySelector('.modal-film__to-watched');
export const addToQueueBtn = document.querySelector('.modal-film__to-queue');
export const btnCloseFilm = document.querySelector('.modal-film__btn');
export const btnFilmTrailer = document.querySelector('.modal-film__to-trailer');

export let watch = null;
export let queue = null;

const db = getDatabase();

export function getDataFromFirebase(ev) {
  const watched = ref(db, `${ev}` + '/watched');
  const queued = ref(db, `${ev}` + '/queue');
  onValue(watched, snapshot => {
    const dataDb = snapshot.val();
    dataDb ? (watch = Object.values(dataDb)) : (watch = false);
  });
  onValue(queued, snapshot => {
    const dataDb = snapshot.val();
    dataDb ? (queue = Object.values(dataDb)) : (queue = false);
  });
}

export function manipulationEventListener(nameBtn, operation = '', eventName, event) {
  if (operation === 'add') {
    nameBtn.forEach((ev, i) => {
      ev.addEventListener(eventName, event[i]);
    });
  } else
    nameBtn.forEach((ev, i) => {
      ev.removeEventListener(eventName, event[i]);
    });
}
const nameBtn = [addToWatchedBtn, addToQueueBtn, btnCloseFilm];
const listEv = [onAddToWatchedBtnClick, onAddToQueueBtnClick, closeModalFilm];

const modal = basicLightbox.create(document.querySelector('#html'), {
  // action on open modal film
  onClose: () => {
    homePage.classList.remove('modal-film-is-open');
    manipulationEventListener(nameBtn, 'remove', 'click', listEv);
    btnFilmTrailer.removeEventListener('click', openModalTrailer);
    window.removeEventListener('keydown', closeModalFilmKey);
  },
  // action on close modal film
  onShow: () => {
    getDataFromFirebase(userAuthId);
    manipulationEventListener(nameBtn, 'add', 'click', listEv);
    btnFilmTrailer.addEventListener('click', () => {
      openModalTrailer();
      window.removeEventListener('keydown', closeModalFilmKey);
    });
    window.addEventListener('keydown', closeModalFilmKey);
    homePage.classList.add('modal-film-is-open');
  },
});
// register click from gallery and take id
export function openModalFilm(ev) {
  ev.preventDefault();
  const evn = ev.target;

  if (evn.nodeName !== 'A' && evn.nodeName !== 'P') {
    return;
  }

  const id = evn.dataset.id;
  openedFilmId = Number(id);
  acceptIdInformation(openedFilmId);
}
// audit information of film and open modal film
async function acceptIdInformation(id) {
  const filteredFilmById = await getMovieById(id);
  const trailer = await getMovieTrailer(id);

  visibleBtnTrailer(trailer);

  filterFilmByBtn(id);
  const movieData = filteredFilmById;
  getMovieData(movieData);
  modal.show();
  createModalFilm(filteredFilmById);
}
// register event of key escape
export function closeModalFilmKey(event) {
  if (event.code === 'Escape') {
    closeModalFilm();
  }
}
//review btn trailer on visible
function visibleBtnTrailer(ev) {
  if (ev.data.results.length === 0) {
    btnFilmTrailer.classList.add('none');
  } else {
    btnFilmTrailer.classList.remove('none');
  }
}
//close modal film
export function closeModalFilm() {
  modal.close();
}
//accept name film
export function filterFilmByBtn(id) {
  if (userAuthId) {
    let filteredFilmBtnByWatch = null;
    let filteredFilmBtnByQueue = null;
    if (watch) {
      filteredFilmBtnByWatch = watch.some(ev => ev.movie.id === id);
    }
    if (queue) {
      filteredFilmBtnByQueue = queue.some(ev => ev.movie.id === id);
    }
    renameBtnFilm(filteredFilmBtnByWatch, filteredFilmBtnByQueue);
  }
}
//rename btn film
function renameBtnFilm(watch, queue) {
  queue ? (addToQueueBtn.textContent = removeQ) : (addToQueueBtn.textContent = addQ);
  watch ? (addToWatchedBtn.textContent = removeW) : (addToWatchedBtn.textContent = addW);
}
