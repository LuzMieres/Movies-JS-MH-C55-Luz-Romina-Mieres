const api = "0ff70d54-dc0b-4262-9c3d-776cb0f34dbd";
let container = document.getElementById('container');
let selectGenre = document.getElementById('selectGenre');
let inputSearch = document.getElementById('inputSearch');
let detailsMovies = document.getElementById('detailsMovies');

// Función para obtener las películas
function fetchMovies() {
    fetch("https://moviestack.onrender.com/api/movies", {
        headers: {
            "X-API-Key": api
        }
    })
    .then(response => response.json())
    .then(data => {
        const movies = data.movies.filter((movie) => movie != null);
        fillSelect(getGenres(movies)); // Llenamos el dropdown de géneros
        container.innerHTML = printCard(movies); // Mostramos todas las películas

        container.addEventListener('click', (e) => {
            // Verificamos si se hizo clic en el botón del corazón
            if (e.target.tagName === 'IMG' && e.target.dataset.id) {
                const movieId = e.target.dataset.id;
                changeFavorites(movieId); // Cambiamos el estado de favoritos
                updateHeartIcon(e.target); // Actualizamos el ícono del corazón dinámicamente
                propagateFavorites(); // Propagamos los cambios a favs.html
            }
        });

        function structureCards(image, title, tagline, overview, id) {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const fav = favorites.includes(id);
            if (fav) {
                return `
                <div class="flex flex-col items-center justify-between bg-violet-600 shadow-lg shadow-indigo-500/40 h-[400px] w-96 object-cover rounded-2xl border border-black">
                    <div class="relative">
                        <img class="h-[200px] w-96 object-cover rounded-t-2xl"
                            src="https://moviestack.onrender.com/static/${image}" alt="imagen-película">
                        <button data-id="${id}">
                            <img data-id="${id}" class="absolute top-1 right-1 w-20 h-10 heart-icon" src="/assets/images/love-heart-love-icon-on-transparent-background-free-png.png" alt="logo corazon">
                        </button>
                    </div>
                    <div class="flex flex-col items-center overflow-y-auto h-72 p-5 custom-scrollbar">
                        <h4 class="font-bold text-xl">${title}</h4>
                        <p class="p-2 text-lg">${tagline}</p>
                        <p class="pb-3 text-ms">${overview}</p>
                        <a class="w-32 text-center text-white border-solid border-2 border-white mr-1 p-1 rounded-lg p-1 bg-black hover:bg-violet-700"
                            href="./details.html?id=${id}" onclick="showDetails('${title}')">View Details</a>
                    </div>
                </div>`;
            } else {
                return `
                <div class="flex flex-col items-center justify-between bg-violet-600 shadow-lg shadow-indigo-500/40 h-[400px] w-96 object-cover rounded-2xl border border-black">
                    <div class="relative">
                        <img class="h-[200px] w-96 object-cover rounded-t-2xl"
                            src="https://moviestack.onrender.com/static/${image}" alt="imagen-película">
                        <button data-id="${id}">
                            <img data-id="${id}" class="absolute top-1 right-1 w-20 h-10 heart-icon" src="/assets/images/logo-corazon-vacio.png" alt="logo corazon">
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
        }

        function changeFavorites(id) {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            const index = favorites.indexOf(id);
            if (index === -1) {
                favorites.push(id); // Agregamos la película a favoritos
            } else {
                favorites.splice(index, 1); // Quitamos la película de favoritos
            }
            localStorage.setItem("favorites", JSON.stringify(favorites)); // Guardamos en localStorage
        }

        function printCard(listMovies) {
            let cards = "";
            for (const movie of listMovies) {
                cards += structureCards(movie.image, movie.title, movie.tagline, movie.overview, movie.id);
            }
            return cards;
        }

        function getGenres(listMovies) {
            let uniqueGenres = [];
            for (const movie of listMovies) {
                for (const genre of movie.genres) {
                    if (!uniqueGenres.includes(genre)) {
                        uniqueGenres.push(genre);
                    }
                }
            }
            return uniqueGenres;
        }

        function fillSelect(genres) {
            for (const genre of genres) {
                let option = document.createElement('option');
                option.value = genre;
                option.text = genre;
                selectGenre.add(option);
            }
        }

        function showDetails(title) {
            const id = location.search;
            return id;
        }

        function updateHeartIcon(heartIcon) {
            if (heartIcon.src.includes("logo-corazon-vacio.png")) {
                heartIcon.src = "/assets/images/love-heart-love-icon-on-transparent-background-free-png.png";
            } else {
                heartIcon.src = "/assets/images/logo-corazon-vacio.png";
            }
        }

        function propagateFavorites() {
            // Enviamos una señal de que los favoritos han sido actualizados
            const event = new CustomEvent('favoritesUpdated');
            window.dispatchEvent(event);
        }

        selectGenre.addEventListener('change', filterMovies);

        inputSearch.addEventListener('input', filterMovies);

        function filterMovies() {
            let selectedGenre = selectGenre.value;
            let nameSearch = inputSearch.value.trim().toLowerCase();

            let leakedMovies;

            if (selectedGenre === 'all') {
                leakedMovies = movies.filter(movie =>
                    nameSearch === '' || movie.title.toLowerCase().includes(nameSearch)
                );
            } else {
                leakedMovies = movies.filter(movie =>
                    movie.genres.includes(selectedGenre) &&
                    (nameSearch === '' || movie.title.toLowerCase().includes(nameSearch))
                );
            }

            if (leakedMovies.length > 0) {
                container.innerHTML = printCard(leakedMovies);
            } else {
                container.innerHTML = '<p>No results found!</p>';
            }
        }

        filterMovies();
    })
    .catch(error => console.log(error));
}

// Escuchamos el evento de actualización de favoritos
window.addEventListener('favoritesUpdated', fetchMovies);

// Llamamos a la función para obtener las películas al cargar la página
fetchMovies();