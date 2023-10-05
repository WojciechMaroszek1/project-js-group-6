// function addToLocalStorage(movieId, listType) {
//   const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
//   if (!moviesList.includes(movieId)) {
//     moviesList.push(movieId);
//     localStorage.setItem(listType, JSON.stringify(moviesList));
//   }
// }

// // Funkcja usuwająca film z localStorage
// function removeFromLocalStorage(movieId, listType) {
//   const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
//   const updatedList = moviesList.filter(id => id !== movieId);
//   localStorage.setItem(listType, JSON.stringify(updatedList));
// }

// function checkMovieInLocalStorage(movieId, listType) {
//   const moviesList = JSON.parse(localStorage.getItem(listType)) || [];
//   return moviesList.includes(movieId);
// }

// let isMovieInWatched;
// let isMovieInQueue;

// // Sprawdzenie, czy dany film znajduje się w localStorage
// isMovieInWatched = checkMovieInLocalStorage(movieData.id, 'watched');
// isMovieInQueue = checkMovieInLocalStorage(movieData.id, 'queue');

// watchedButton.textContent = isMovieInWatched ? 'ON THE WATCHED ✓' : 'Add to watched';
// queueButton.textContent = isMovieInQueue ? 'ON THE QUEUE ✓' : 'Add to queue';

// watchedButton.addEventListener('click', function () {
//   if (isMovieInWatched) {
//     removeFromLocalStorage(movieData.id, 'watched');
//   } else {
//     addToLocalStorage(movieData.id, 'watched');
//   }

//   isMovieInWatched = !isMovieInWatched;
//   watchedButton.textContent = isMovieInWatched ? 'ADDED ✓' : 'Add to watched';
// });

// queueButton.addEventListener('click', function () {
//   if (isMovieInQueue) {
//     removeFromLocalStorage(movieData.id, 'queue');
//   } else {
//     addToLocalStorage(movieData.id, 'queue');
//   }

//   isMovieInQueue = !isMovieInQueue;
//   queueButton.textContent = isMovieInQueue ? 'ADDED ✓' : 'Add to queue';
// });
