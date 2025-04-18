import axios from 'axios';

const API_KEY = '5ca296fa'; 
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string) => {
  const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
  if (response.data.Response === 'True') {
    return response.data.Search;
  } else {
    console.warn('Busca sem resultados:', response.data.Error);
    return [];
  }
};

export const getMovieDetails = async (imdbID: string) => {
  const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
  return response.data;
};
