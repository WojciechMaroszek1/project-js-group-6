// Klucz do YouTube Data API
const apiKey = 'YAIzaSyCmxvbVorVig6FZwnfXc7QoiCBZkHC6zf0';

const modal = document.getElementById('myModal');
const videoContainer = document.getElementById('video-container');
const closeButton = document.querySelector('.close');

// Dodaj event listener do przycisku "WATCH TRAILER"
const watchTrailerButton = document.querySelector('.watch-trailer-button');
if (watchTrailerButton) {
  watchTrailerButton.addEventListener('click', () => {
    modal.style.display = 'block'; // Pokaż okno modalne

    // Tutaj możesz pobrać tytuł filmu z danej strony
    const title = 'Nazwa Twojego filmu';

    searchYouTubeTrailer(title)
      .then(videoId => {
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        // Utwórz iframe i dodaj go do okna modalnego
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', embedUrl);
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', 'true');
        videoContainer.innerHTML = '';
        videoContainer.appendChild(iframe);
      })
      .catch(error => {
        console.error('Error fetching YouTube trailer:', error);
      });
  });
}

// Obsługa zamknięcia okna modalnego
closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Funkcja do wyszukiwania filmu na YouTube
async function searchYouTubeTrailer(query) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(query)}&type=video`;
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube data');
  }

  const data = await response.json();
  const videoId = data.items[0].id.videoId;

  return videoId;
}