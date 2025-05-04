import axios from 'axios';

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1';

export const fetchAllCountries = () => {
  return axios.get(`${REST_COUNTRIES_API}/all`);
};

export const fetchCountryByName = (name) => {
  return axios.get(`${REST_COUNTRIES_API}/name/${name}`);
};

export const fetchCountriesByRegion = (region) => {
  return axios.get(`${REST_COUNTRIES_API}/region/${region}`);
};

export const fetchCountryByCode = (code) => {
  return axios.get(`${REST_COUNTRIES_API}/alpha/${code}`);
};
