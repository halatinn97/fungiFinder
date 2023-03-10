import express from 'express';
import path from 'path';
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

//Get absolute directory path in ESM
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = process.env.PORT || 5500;

//Static routes for serving static files

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// Route for serving the gallery.html file
app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'gallery.html'));
});

// Route for serving the fungus.html file
app.get('/fungus', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'fungus.html'));
});

// Route for serving the fungi.html file
app.get('/fungi', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'fungi.html'));
});

//Dynamic in sense that it responds with data from external API but not dynamic in context of Express app as not using dynamic routing paraeters --> Simply returns Fungi info, does not filter based on user input
//To make dynamic: add routing parameters to allow the user to filter the results based on certain criteria, such as species, location, or date
//Show all Fungi information 

app.get('/api/fungi', async (req, res) => {
    try {
        const response = await axios.get('https://api.inaturalist.org/v1/taxa?taxon_id=47170&rank=species&page=50&per_page=200');
        const fungi = response.data.results;
        res.send({ results: fungi });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});

//Dynamic 
// Show fungi gallery

app.get('/api/gallery', async (req, res) => {
    const perPage = 500;
    const page = req.query.page || 1;

    try {
        // Get 1st page of Fungi
        let response = await axios.get(`https://api.inaturalist.org/v1/taxa?taxon_id=47170&rank=species&page=${page}&per_page=${perPage}`);

        let fungi = response.data.results;
        let imageUrls = [];

        // Add image URLs from 1st page of Fungi to array
        for (let i = 0; i < fungi.length; i++) {
            const fungus = fungi[i];
            if (fungus.default_photo) {
                const imageUrl = fungus.default_photo.medium_url;
                imageUrls.push(imageUrl);
            }
        }

        // `search_after` retrieves next set of results by id of last Fungus object in Fungi array
        let searchAfter = fungi[fungi.length - 1].id;

        //API calls to retrieve next page of Fungi data until all retrieved
        while (imageUrls.length < 10000) {
            response = await axios.get(`https://api.inaturalist.org/v1/taxa?taxon_id=47170&rank=species&per_page=${perPage}&search_after=${searchAfter}`);
            fungi = response.data.results;

            // Stop loop if there are no more results to fetch
            if (fungi.length === 0) {
                break;
            }

            // Add image URLs from this page of Fungi to the array
            for (let i = 0; i < fungi.length; i++) {
                const fungus = fungi[i];
                if (fungus.default_photo) {
                    const imageUrl = fungus.default_photo.medium_url;
                    imageUrls.push(imageUrl);
                }
            }

            // Update `searchAfter` parameter to id of last fungus object in fungi array for next search request
            searchAfter = fungi[fungi.length - 1].id;
        }

        res.json({ images: imageUrls });

    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});


//Dynamic
//Show fungus details 

app.get('/api/fungus', async (req, res) => {
    // app.get('/api/fungus/:id', async (req, res) => {
    /*const id = req.params.id;*/
    const id = req.query.id;
    console.log(id);
    try {
        const response = await axios.get(`https://api.inaturalist.org/v1/taxa/${id}`)
        const fungusDetails = {
            id: id,
            default_photo: response.data.default_photo.medium_url,
            name: response.data.name,
            wikipedia_url: response.data.wikipedia_url,
            preferred_common_name: response.data.preferred_common_name,
        };
        res.send(fungusDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});



// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});