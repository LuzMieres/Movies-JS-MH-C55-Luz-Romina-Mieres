const api = "0ff70d54-dc0b-4262-9c3d-776cb0f34dbd";
let favoritesContainer = document.getElementById('favoritesContainer');

// Función para obtener las películas favoritas
function fetchFavoriteMovies() {
    fetch("https://moviestack.onrender.com/api/movies", {
        headers: {
            "X-API-Key": api
        }
    })
    .then(response => response.json())
    .then(data => {
        const movies = data.movies.filter((movie) => movie != null);
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const favoriteMovies = movies.filter(movie => favorites.includes(movie.id));
        favoritesContainer.innerHTML = printFavorites(favoriteMovies);
    })
    .catch(error => console.log(error));
}

// Función para imprimir las películas favoritas
function printFavorites(listMovies) {
    let cards = "";
    for (const movie of listMovies) {
        cards += structureFavoriteCard(movie.image, movie.title, movie.tagline, movie.overview, movie.id);
    }
    return cards;
}

// Estructura de la tarjeta de películas favoritas
function structureFavoriteCard(image, title, tagline, overview, id) {
    return `
    <div class="flex flex-col items-center justify-between bg-violet-600 shadow-lg shadow-indigo-500/40 h-[400px] w-96 object-cover rounded-2xl border border-black">
        <div class="relative">
            <img class="h-[200px] w-96 object-cover rounded-t-2xl"
                src="https://moviestack.onrender.com/static/${image}" alt="imagen-película">
            <button data-id="${id}" class="heart-icon">
                <img data-id="${id}" class="absolute top-1 right-1 w-20 h-10 heart-icon" src="/assets/images/love-heart-love-icon-on-transparent-background-free-png.png" alt="logo corazon">
            </button>
        </div>
        <div class="flex flex-col items-center overflow-y-auto w-96 h-72 p-5 custom-scrollbar">
            <h4 class="font-bold text-xl">${title}</h4>
            <p class="p-2 text-lg">${tagline}</p>
            <p class="pb-3 text-ms">${overview}</p>
            <a class="w-32 text-center text-white border-solid border-2 border-white mr-1 p-1 rounded-lg p-1 bg-black hover:bg-violet-700"
                href="./details.html?id=${id}" onclick="showDetails('${title}')">View Details</a>
        </div>
    </div>`;
}

// Escuchamos el evento de actualización de favoritos
window.addEventListener('favoritesUpdated', fetchFavoriteMovies);

// Llamamos a la función para obtener las películas favoritas al cargar la página
fetchFavoriteMovies();

// Event listener para eliminar películas favoritas
favoritesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('heart-icon')) {
        const movieId = e.target.dataset.id;
        removeFavorite(movieId);
    }
});

// Función para eliminar una película de favoritos
function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.indexOf(id);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        dispatchEvent(new Event('favoritesUpdated')); // Disparar evento para actualizar la lista de favoritos
    }
}