const api = "0ff70d54-dc0b-4262-9c3d-776cb0f34dbd";
const idToWork = location.search;

const queryParams = new URLSearchParams(idToWork).get("id");
console.log(idToWork);
console.log(queryParams);
const detailsMovies = document.getElementById("detailsMovies");

const title = document.querySelector("title");

fetch("https://moviestack.onrender.com/api/movies", {
  headers: {
    "X-API-Key": api,
  },
})
  .then((response) => response.json())
  .then((data) => {
    const movie = data.movies.find((movie) => movie.id == queryParams);
    console.log(movie);
    let puntuacion = movie.vote_average.toFixed(2);
    let budget = movie.budget.toFixed(2);
    let revenue = movie.revenue.toFixed(2);
    const budgetFormatted = formatCurrency(budget);
    const revenueFormatted = formatCurrency(revenue);

    function formatCurrency(amount) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    }

    detailsMovies.innerHTML = estructuraCard(movie);

    let titulo = movie.title;
    title.innerHTML = titulo;

    function estructuraCard(movie) {
      return `
      <div class="flex flex-wrap justify-around mb-5 mt-5">
        <img class="h-[800px] w-[800px] object-cover rounded-2xl" src='https://moviestack.onrender.com/static/${movie.image}' alt='Movie image' />
        <div class="flex flex-col gap-5">
          <div class="">
            <h2 class="text-3xl">${movie.title}</h2>
            <p class="text-xl">${movie.tagline}</p>
            <p class="w-60">${movie.overview}</p>
          </div>
          
          <table>
            <tr>
              <td>Original language</td>
              <td>${movie.original_language}</td>
            </tr>
            <tr>
              <td>Release date</td>
              <td>${movie.release_date}</td>
            </tr>
            <tr>
              <td>Runtime</td>
              <td>${movie.runtime}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>${movie.status}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td>Vote average</td>
              <td>${puntuacion}%</td>
            </tr>
            <tr>
              <td>Budget</td>
              <td>USD ${budgetFormatted}</td>
            </tr>
            <tr>
              <td>Revenue</td>
              <td>${revenueFormatted}</td>
            </tr>
          </table>
        </div>
      `;
    }
  })
  .catch((e) => console.error(e));