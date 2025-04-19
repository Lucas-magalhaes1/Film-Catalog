import axios from 'axios';

const API_KEY = '5ca296fa'; 
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string, year?: string) => {
  let url = `${BASE_URL}?apikey=${API_KEY}&s=${query}`;
  if (year) {
    url += `&y=${year}`;
  }
  const response = await axios.get(url);
  return response.data.Search;
};


export const getMovieDetails = async (imdbID: string) => {
  const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
  return response.data;
};
