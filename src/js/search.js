   
    document.addEventListener("DOMContentLoaded", function () {
      const form = document.getElementById("header_form"); // Popraw selektor
      const movieList = document.querySelector('.movies'); // Dodaj selektor listy filmów
    
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const searchInput = document.getElementById("header_form").value;
        
        // Tutaj wywołujemy funkcję, która będzie wyszukiwać filmy w API na podstawie wpisanego tytułu
        searchMovies(searchInput, movieList); // Przekazujemy również element listy filmów
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
    
      const apiUrl = `${baseUrl}/search/movie?query=${query}`; // Poprawny adres URL
    
      try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();
    
        const movies = data.results;
    
        renderMovies(movies, movieList);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      }
    }
    
    function renderMovies(data, movieList) {
      movieList.innerHTML = ""; // Wyczyść poprzednie wyniki
    
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
              <p class="card__desc">${e.release_date.slice(0, 4)}</p>
            </div>
          </li>`;
        })
        .join('');
        
      movieList.innerHTML = movieListContent;
    
    }
    
   
