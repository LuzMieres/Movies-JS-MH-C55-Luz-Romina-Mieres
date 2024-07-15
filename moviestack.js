let container = document.getElementById('container');
let inputSearch = document.getElementById('inputSearch');
let moviesDetails = document.getElementById('moviesDetails');

//Creo la estructura básica de una card HTML
function cardStructure(image, title, tagline, overview) {
    return `<div class="flex flex-col items-center justify-between pb-1 w-96 h-96 shadow-2xl border-solid border-2 border-white rounded-2xl text-center bg-violet-200 text-black">
        <img class="h-40 w-96 object-cover rounded-t-2xl" src="${image}" alt="imagen-película">
        <h4 class="font-bold">${title}</h4>
        <p class="px-3 text-xs">${tagline}</p>
        <p class="pb-1 text-xs">${overview}</p>
        <a class="w-24 text-white border-solid border-2 border-white mr-1 p-1 rounded-lg p-1 bg-black hover:bg-violet-700" href="#" onclick="showDetails('${title}')">View details</a>
    </div>`;
}

//Imprimo cada card 
function structureCards(listMovies) {
    let cards = "";
    for (const movie of listMovies) {
        cards += cardStructure(movie.image, movie.title, movie.tagline, movie.overview, movie.genres);
    }
    return cards;
}

function getGenres(listMovies) {
    // Obtengo todos los géneros únicos de las películas
    let uniqueGeneros = [];
    for (const movie of listMovies) {
        for (const genre of movie.genres) {
            if (!uniqueGeneros.includes(genre)) {
                uniqueGeneros.push(genre);
            }
        }
    }
    return uniqueGeneros;
}
let genres = getGenres(movies);

function fillSelect(genres) {
    let selectGenre = document.getElementById('selectGenre');
    for (const genre of genres) {
        let option = document.createElement('option');
        option.value = genre;
        option.text = genre;
        selectGenre.add(option);
    }
}
fillSelect(genres);

function showDetails(title) {
    let movie = movies.find(movie => movie.title === title);

    // Redirige a la página de detalles con los parámetros de la película
    window.location.href = `details.html?title=${encodeURIComponent(title)}&image=${encodeURIComponent(movie.image)}&tagline=${encodeURIComponent(movie.tagline)}&genres=${encodeURIComponent(movie.genres.join(', '))}&overview=${encodeURIComponent(movie.overview)}&original_language=${encodeURIComponent(movie.original_language)}&release_date=${encodeURIComponent(movie.release_date)}&runtime=${encodeURIComponent(movie.runtime)}&status=${encodeURIComponent(movie.status)}&vote_average=${encodeURIComponent(movie.vote_average)}&budget=${encodeURIComponent(movie.budget)}&revenue=${encodeURIComponent(movie.revenue)}`;
}

selectGenre.addEventListener('change', filterMovies);

inputSearch.addEventListener('input', filterMovies);

function filterMovies() {
    let selectGenre = document.getElementById('selectGenre');
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
        container.innerHTML = structureCards(leakedMovies);
    } else {
        container.innerHTML = '<p>No results found!</p>';
    }
}
filterMovies();

