   
 document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("header__form"); 
  const movieList = document.querySelector('.movies'); 

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchInput = document.getElementById("header__input").value; 

    
    searchMovies(searchInput, movieList); 
  });
});

    
    async function searchMovies(query, movieList) {
      const apiKey ="eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMDVlODZlMjc2NGU5ODNhODNiMzhlOWM3ZTczOTc1MSIsInN1YiI6IjY1MTFjOTI0YTkxMTdmMDBlMTkzNDUxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GsP1_BpjRsEtLOVsHhzyIZ6UsRr54tXlsvMn6Ob4lmQ"; // Zastąp swoim kluczem API
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
            
        if (data.results.length === 0) {
          document.getElementById("header__error").style.display = "block";
          movieList.innerHTML = "";
        } else {
          document.getElementById("header__error").style.display = "none";
          const movies = data.results;
          renderMovies(movies, movieList);
        }
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      }
    }
    
    function renderMovies(data, movieList) {
      movieList.innerHTML = ""; 
    
      const movieListContent = data
      .map(e => {
        const posterUrl = e.poster_path
          ? `https://image.tmdb.org/t/p/w500/${e.poster_path}`
          : `/src/images/nothing_to_see.jpg`; 
  
        return `<li class="card">
          <img
            src="${posterUrl}"
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
    
   
