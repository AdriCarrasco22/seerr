import axios from "axios"; //Libreria para hacer peticiones HTTP (llamadas a APIs)

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "c5ac3c7025df591a99ae941697edb14a",
    language: "es-ES",
  },
});

export default client;

