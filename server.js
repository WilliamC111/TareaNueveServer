const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;
const cors = require('cors');
app.use(cors());

const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api/character';
const CHUCK_NORRIS_API = 'https://api.chucknorris.io/jokes/random';


app.get('/api/combined', async (req, res) => {
    try {
        const rickAndMortyResponse = await axios.get(RICK_AND_MORTY_API);
        const characters = rickAndMortyResponse.data.results.slice(0, 10); 

        const chuckNorrisJokes = await Promise.all(
            characters.map(() => axios.get(CHUCK_NORRIS_API))
        );

        const jokes = chuckNorrisJokes.map(response => response.data.value);

        const combinedData = characters.map((character, index) => ({
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            image: character.image,
            joke: jokes[index]
        }));

        res.json(combinedData);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los datos de las APIs' });
    }
});

app.get('/api/new-joke', async (req, res) => {
    try {
        const chuckNorrisResponse = await axios.get(CHUCK_NORRIS_API);
        const joke = chuckNorrisResponse.data.value;
        res.json({ joke });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener una nueva broma' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
