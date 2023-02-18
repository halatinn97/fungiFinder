import express from 'express';
import path from 'path';
import axios from 'axios';

//Get absolute directory path in ESM
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 5500;

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

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
app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.inaturalist.org/v1/observations?place_id=any&iconic_taxa=Fungi');
        const fungi = response.data.results;
        res.send({ results: fungi });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

//Show fungi gallery
app.get('/gallery', async (req, res) => {
    try {
        const response = await axios.get('https://api.inaturalist.org/v1/observations?place_id=any&iconic_taxa=Fungi')

        const fungiMedia = response.data.results
            .filter(item => item.default_photo && item.default_photo.length > 0)
            .map(item => {
                const imageUrl = item.default_photo;
                return `<img src="${imageUrl}" alt="${item.taxon.name}">`;
            })
            .join('');

        res.send(fungiMedia);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



//Show fungus details 

app.get('/observations/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`https://api.inaturalist.org/v1/observations/${id}`);
        const fungusDetails = {
            default_photo: response.data.default_photo.medium_url,
            name: response.data.taxon.name,
            wikipedia_url: response.data.taxon.wikipedia_url,
            preferred_common_name: response.data.taxon.preferred_common_name,
            geojson: response.data.taxon.geojson.coordinates,
            location: response.data.taxon.location
        };
        res.send(fungusDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



