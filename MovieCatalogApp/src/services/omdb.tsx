import axios from 'axios';

const API_KEY = '5ca296fa'; 
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string, year?: string, page: number = 1) => {
  let url = `${BASE_URL}?apikey=${API_KEY}&s=${query}&page=${page}`;
  if (year) {
    url += `&y=${year}`;
  }

  const response = await axios.get(url);

  if (response.data.Response === 'True') {
    return response.data.Search;
  }

  return [];
};



export const getMovieDetails = async (imdbID: string) => {
  const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`);
  return response.data;
};
