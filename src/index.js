import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const searchForm = document.querySelector('#search-box');
const countriesListEl = document.querySelector('.country-list');
const countryCardEl = document.querySelector('.country-info');

searchForm.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(event) {
  event.preventDefault();
  const countryName = searchForm.value.trim();

  if (!countryName) {
    clearMarkup();
    return;
  }
  fetchCountries(countryName)
    .then(response => {
      clearMarkup();
      if (response.length === 1) {
        createCountryCardMarkup(response);
        return;
      } else if (response.length > 2 && response.length <= 10) {
        createCountriesListMarkup(response);
        return;
      }
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    })
    .catch(error => {
      clearMarkup();
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCountriesListMarkup(country) {
  const countriesListMarkup = country
    .map(({ name, flags }) => {
      return `<li class="country-item">
      <img class="country-img" src="${flags.svg}" alt="${flags.alt}" width="60" height="auto"><p class="country-name">${name.official}</p></li>`;
    })
    .join('');
  countryCardEl.innerHTML = '';
  countriesListEl.innerHTML = countriesListMarkup;
}

function createCountryCardMarkup(country) {
  const countryCardMarkup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-wrapper"><img class="country-img" src="${
        flags.svg
      }" alt="${flags.alt}" width="60" height="auto">
      <h1 class="country-name">${name.official}</h1></div>
      <p class="country-description">Capital: <span>${capital}</span></p>
      <p class="country-description">Population: <span>${population}</span></p>
      <p class="country-description">Languages: <span>${Object.values(
        languages
      ).join(', ')}</span></p>`;
    })
    .join('');
  countriesListEl.innerHTML = '';
  countryCardEl.innerHTML = countryCardMarkup;
}

function clearMarkup() {
  countriesListEl.innerHTML = '';
  countryCardEl.innerHTML = '';
}
