import express from 'express';
import path from 'path';
import axios from 'axios';
import fs from 'fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 5500;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

/*
app.use('/fungi', express.static('public'))
app.use('/fungi/media', express.static('public'))
*/

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// Route for serving the style.css file
app.get('/css/style.css', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'css', 'style.css'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


//Show all Fungi information 
app.get('/fungi', async (req, res) => {
    try {
        const response = await axios.get(`https://api.gbif.org/v1/occurrence/search?taxonKey=5&limit=300`);
        const fungi = response.data.results;
        res.send({ results: fungi });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

//Show fungi gallery
app.get('/fungi/media', async (req, res) => {
    try {
        const response = await axios.get('https://api.gbif.org/v1/occurrence/search', {
            params: {
                taxonKey: 5,
                limit: 300,
                media_type: 'StillImage'
            }
        });

        const fungiMedia = response.data.results
            .filter(item => item.media && item.media.length > 0)
            .map(item => {
                const imageUrl = item.media[0].identifier;
                return `<img src="${imageUrl}" alt="${item.scientificName}">`;
            })
            .join('');

        res.send(fungiMedia);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



//Show fungus details 

app.get('fungi/occurence/:key', async (req, res) => {
    try {
        const response = await axios.get(`https://api.gbif.org/v1/occurrence/${req.params.key}`);
        const fungusDetails = {
            media: response.data.media,
            scientificName: response.data.scientificName,
            genericName: response.data.genericName,
            country: response.data.country,
            species: response.data.species,
            decimalLongitude: response.data.decimalLongitude,
            decimalLatitude: response.data.decimalLatitude,
        };
        res.send(fungusDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



