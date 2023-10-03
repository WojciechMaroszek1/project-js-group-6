export const modalFilmImg = document.querySelector('.modal-film__img-cont');
export const modalFilmHtml = document.querySelector('.modal-film--add');
export function audit(ev) {
  ev ? ev : null;
}

// API key
const apiKey = 'YAIzaSyCmxvbVorVig6FZwnfXc7QoiCBZkHC6zf0';

export async function createModalFilm(ev) {
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

  const htmlImg = `<img src="https://image.tmdb.org/t/p/w500${
    poster_path === null ? '/h5oGodvcoq8cyIDTy79yKn4qbey.jpg' : poster_path
  }" alt="poster ${title}" class="modal-film__img">`;

  const htmlPoint = `
    ${audit(title) !== null ? `<h2 class="modal-film__name">${title}</h2>` : ''}
    <table class="modal-film__rating">
      ${
        vote_average !== 0
          ? `<tr>
              <td class="modal-film__item-name vote">Vote / Votes</th>
              <td class="modal-film__item-description" vote><span class="modal-film--style">${vote_average}</span> / ${vote_count}</th>
            </tr>`
          : ''
      }
      ${
        audit(popularity) !== null
          ? `<tr>
              <td class="modal-film__item-name popularity">Popularity</td>
              <td class="modal-film__item-description popularity">${popularity}</td>
            </tr>`
          : ''
      }
      ${
        audit(original_title) !== null
          ? `<tr>
              <td class="modal-film__item-name original">Original Title</td>
              <td class="modal-film__item-description original">${original_title}</td>
            </tr>`
          : ''
      }
      ${
        genres.length !== 0
          ? `<tr>
              <td class="modal-film__item-name genre">Genre</td>
              <td class="modal-film__item-description genre">${genres
                .flatMap(ev => ev.name)
                .join(', ')}</td>
            </tr>`
          : ''
      }
    </table>
    ${
      overview !== ''
        ? `<h3 class="modal-film__title" about>ABOUT</h3>
          <p class="modal-film__description"about>${overview}</p>`
        : ''
    }
    <button class="watch-trailer-button">WATCH TRAILER</button>
  `;

  const img = modalFilmImg;
  const point = modalFilmHtml;
  img.innerHTML = htmlImg;
  point.innerHTML = htmlPoint;

  // Add an event listener to the "WATCH TRAILER" button
  const watchTrailerButton = point.querySelector('.watch-trailer-button');
  if (watchTrailerButton) {
    watchTrailerButton.addEventListener('click', async () => {
      try {
        // Make a request to the YouTube Data API to search for a trailer
        const trailerTitle = `${title} Official Trailer`;
        const searchResponse = await searchYouTubeTrailer(trailerTitle);

        // Get the video ID of the first search result
        const videoId = searchResponse.items[0].id.videoId;

        // Create an embed URL for the YouTube trailer
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        // Create an iframe to embed the YouTube trailer
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');

        // YouTube trailer
        img.innerHTML = '';
        img.appendChild(iframe);
      } catch (error) {
        console.error('Error fetching YouTube trailer:', error);
      }
    });
  }
}

async function searchYouTubeTrailer(query) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(query)}&type=video`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube data');
  }
  const data = await response.json();
  return data;
}
