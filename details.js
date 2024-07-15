
const urlParams = new URLSearchParams(window.location.search);

// Obtengo los valores de los parámetros 
const title = urlParams.get('title');
const image = urlParams.get('image');
const tagline = urlParams.get('tagline');
const genres = urlParams.get('genres');
const overview = urlParams.get('overview');
const originalLanguage = urlParams.get('original_language');
const releaseDate = urlParams.get('release_date');
const runtime = urlParams.get('runtime');
const status = urlParams.get('status');
const voteAverageValue = parseFloat(urlParams.get('vote_average'));
const budgetValue = parseFloat(urlParams.get('budget'));
const revenueValue = parseFloat(urlParams.get('revenue'));

// Convierte el voto a porcentaje (asumiendo que la puntuación es en una escala de 0 a 10)
const voteAveragePercentage = (voteAverageValue / 10) * 100;

// Convierte el presupuesto y los ingresos a formato de moneda (USD)
const budgetFormatted = formatCurrency(budgetValue);
const revenueFormatted = formatCurrency(revenueValue);

// Función para formatear la moneda en USD
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// Actualizo los elementos HTML con la información obtenida
document.getElementById('detailImagen').src = decodeURIComponent(image);
document.getElementById('detailTitle').innerText = decodeURIComponent(title);
document.getElementById('detailTagline').innerText = decodeURIComponent(tagline);
document.getElementById('detailGenres').innerText = decodeURIComponent(genres);
document.getElementById('detailOverview').innerText = decodeURIComponent(overview);
document.getElementById('detailOriginalLanguage').innerText = decodeURIComponent(originalLanguage);
document.getElementById('detailReleaseDate').innerText = decodeURIComponent(releaseDate);
document.getElementById('detailRuntime').innerText = decodeURIComponent(runtime);
document.getElementById('detailStatus').innerText = decodeURIComponent(status);
document.getElementById('detailVoteAverage').innerText = `${voteAveragePercentage.toFixed(2)}%`; // Redondea a 2 decimales
document.getElementById('detailBudget').innerText = budgetFormatted;
document.getElementById('detailRevenue').innerText = revenueFormatted;
