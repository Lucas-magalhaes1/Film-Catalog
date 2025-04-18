import axios from 'axios';

const API_KEY = '';
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string) => {
  const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
  return response.data.Search;
};

export const getMovieDetails = async (imdbID: string) => {
  const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
  return response.data;
};
