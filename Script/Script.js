const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=bafd717a80acb36a0d8cd5f2c1568e88&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=bafd717a80acb36a0d8cd5f2c1568e88&query=';

let currentPage = 1;
let currentSearchTerm = '';

$(document).ready(function(){
    let main = $('#main');
    let form = $('#form');
    let search = $('#search');

    // Get Initial Movies
    getMovies(API_URL);

    async function getMovies(url) {
        const res = await fetch(url);
        const data = await res.json();
        ShowMovies(data.results);
    }

    function ShowMovies(movies) {
        movies.forEach((movie) => {
            const { title, poster_path, vote_average, overview } = movie;

            const movieEl = $(`
                <div class="movie">
                    <img src="${IMG_PATH + poster_path}" alt="${title}" />
                    <div class="movie-info">
                        <h3>${title}</h3>
                        <span class="${GetClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
                    </div>
                    <div class="overview">
                        ${overview}
                    </div>
                </div>
            `);

            main.append(movieEl);
        });
    }

    function GetClassByRate(vote) {
        if (vote >= 8) return 'green';
        else if (vote >= 5) return 'orange';
        else return 'red';
    }

    form.on('submit', (e) => {
        e.preventDefault();

        const searchTerm = search.val();

        if (searchTerm && searchTerm !== '') {
            main.html(''); // Clear current movies
            currentPage = 1;
            currentSearchTerm = searchTerm;
            getMovies(SEARCH_API + searchTerm + '&page=1');
            search.val('');
        } else {
            window.location.reload();
        }
    });

    // Infinite scroll
    $(window).on('scroll', () => {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            currentPage++;
            if (currentSearchTerm) {
                getMovies(SEARCH_API + currentSearchTerm + '&page=' + currentPage);
            } else {
                getMovies(API_URL.split('page=')[0] + 'page=' + currentPage);
            }
        }
    });
});
