const movieList = document.querySelector('.movies__list');
const movieSearch = document.querySelector('.search__input');
const moviesHeaderTitle = document.querySelector('.movies__header--title');
const progress = document.querySelector('.progress');
const filterInput = document.querySelector('.filter__input');
const filterInputToggle = document.querySelector('.filter__input--toggle');
const year = document.querySelector('#year');
let filterActive = false;

async function renderMovies() {
  if(!movieSearch.value) return;
  moviesHeaderTitle.innerHTML = `Search results for <br><b class="primary">"${movieSearch.value}"</b>`
  movieList.innerHTML = new Array(6).fill(0).map(_ => skeletonHTML()).join("");
  progress.style.opacity = 1;
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=74514e3b&s=${movieSearch.value}${filterActive ? `&y=${filterInput.value}` : ''}`);
    const moviesData = await response.json();
    const movies = moviesData.Search;
  
    console.log(movies);
  
    movieList.innerHTML = movies.slice(0,6).map(movie => movieHTML(movie)).join("");
  } catch (error) {
    movieList.innerHTML = `
    <div class="movies__error">
      <h3 class="movies__error--title">
        No results were found.
      </h3>
      <button class="movies__error--btn" onclick="resetFilter()">
        Reset filter
      </button>
    </div>
    `
  }
  progress.style.opacity = 0;
}

function onSubmit(e) {
  e.preventDefault();
  renderMovies();
}

function onToggle(e) {
  filterActive = e.target.checked;
  year.innerHTML = filterInput.value;
  renderMovies();
}

function onFilterChange() {
  year.innerHTML = filterInput.value;
  if(filterActive) {
    renderMovies();
  }
}

function resetFilter() {
  filterActive = false;
  filterInputToggle.checked = false;
  filterInput.value = 1962;
  movieList.innerHTML = '';
  year.innerHTML = '1962';
  movieSearch.value = '';
  moviesHeaderTitle.innerHTML = 'Search results';
}

function toggleMenu() {
  document.body.classList.toggle('menu-open');
}

function onImageLoad(e) {
  console.log(e.target)
  e.target.style.display = 'block';
  e.target.parentElement.querySelector('.movie__img--skeleton').style.display = 'none';
}

function onImageError(e) {
  console.log('Error loading image: ', e.target.parentElement);
  e.target.style.display = 'none';
  e.target.parentElement.querySelector('.movie__img--skeleton').style.display = 'block';
  e.target.parentElement.querySelector('.movie__img--skeleton').style.backgroundColor = '#242424';
}

function movieHTML(movie) {
  return `
    <div class="movie">
      <figure class="movie__img--wrapper">
        <img src="${movie.Poster}" alt="" class="movie__img" onload="onImageLoad(event)" onerror="onImageError(event)" style="display: none;">
        <div class="movie__overlay">
          More info<i class="fas fa-arrow-right"></i>
        </div>
        <div class="movie__img--skeleton" style="display: block;"></div>
      </figure>
      <div class="movie__description">
        <h3 class="movie__title">
          ${movie.Title}
        </h3>
        <span class="movie__year">
          ${movie.Year}
        </span>
      </div>
    </div>
  `
}



function skeletonHTML() {
  return `
    <div class="movie">
      <div class="movie__skeleton"></div>
    </div>
  `
}

