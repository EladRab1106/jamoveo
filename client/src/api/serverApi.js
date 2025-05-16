import Axios from 'axios';

const serverApi = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default serverApi;
