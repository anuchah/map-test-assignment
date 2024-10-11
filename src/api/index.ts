import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://v2k-dev.vallarismaps.com/core/api',
  timeout: 30000,
});
