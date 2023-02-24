import express from 'express';
import path from 'path';
import axios from 'axios';

//Get absolute directory path in ESM
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 5500;


// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// Route for serving the gallery.html file
app.get('/api/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'gallery.html'));
});

// Route for serving the fungus.html file
app.get('/api/fungus/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'fungus.html'));
});

// Route for serving the fungi.html file
app.get('/api/fungi', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'fungi.html'));
});

//Show all Fungi information 
app.get('/fungi', async (req, res) => {
    try {
        const response = await axios.get('https://api.inaturalist.org/v1/taxa?taxon_id=47170&rank=species&page=3&per_page=200');
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
        const response = await axios.get('https://api.inaturalist.org/v1/taxa?taxon_id=47170&rank=species&page=3&per_page=200')

        const fungi = response.data.results;

        const imageUrls = [];

        for (let i = 0; i < fungi.length; i++) {
            const fungus = fungi[i];
            if (fungus.default_photo) {
                const imageUrl = fungus.default_photo.medium_url;
                console.log(fungus.default_photo);
                imageUrls.push(imageUrl);
            }
        }
        res.json({ images: imageUrls }); //Accessed via data.images on client-side


        // Log the value of default_photo from the first item in the fungi array
        console.log(fungi[0].default_photo.medium_url);

    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});


//Show fungus details 

app.get('/fungus/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`https://api.inaturalist.org/v1/taxa/${id}`);
        const fungusDetails = {
            default_photo: response.data.default_photo.medium_url,
            name: response.data.name,
            wikipedia_url: response.data.wikipedia_url,
            preferred_common_name: response.data.preferred_common_name,
        };
        res.send(fungusDetails);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
});



// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});