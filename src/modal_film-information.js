import { modalFilmImg, modalFilmHtml } from '../refs/refs'
import { audit } from '../service/audit';

export function createModalFilm(ev) {
  const {
    original_title,
    title,
    vote_average,
    vote_count,
    poster_path,
    overview,
    popularity,
    genres,
  } = ev;
  const htmlImg = `<img src="https://image.tmdb.org/t/p/w500${poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : poster_path}" alt="poster ${title}" class="modal-film__img">`;
  const htmlPoint = `
   ${audit(title) !== null ? `<h2 class="modal-film__name">${title}</h2> `:""}
            <table class="modal-film__rating">
             ${vote_average !== 0 ?
              `<tr>
                <td class="modal-film__item-name vote">Vote / Votes</th>
                <td class="modal-film__item-description" vote><span class="modal-film--style">${vote_average}</span> / ${vote_count}</th>
              </tr>`:""}
              ${audit(popularity) !== null ?
                `<tr>
                <td class="modal-film__item-name popularity">Popularity</td>
                <td class="modal-film__item-description popularity">${popularity}</td>
              </tr>`: ""}
              ${audit(original_title) !== null ?
              `<tr>
                <td class="modal-film__item-name original">Original Title</td>
                <td class="modal-film__item-description original">${original_title}</td>
              </tr>`:""}
               ${genres.length !== 0 ?
              `<tr>
                <td class="modal-film__item-name genre">Genre</td>
                <td class="modal-film__item-description genre">${genres.flatMap(ev=> ev.name).join(", ")}</td>
              </tr>`:""}
            </table>
            </div>
            ${overview !== "" ?
            `<h3 class="modal-film__title" about>ABOUT</h3>
            <p class="modal-film__description"about>${overview}</p>`:""}
       `;
  const img = modalFilmImg;
  const point = modalFilmHtml;
  img.innerHTML = htmlImg;
  point.innerHTML = htmlPoint;
}
