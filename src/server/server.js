import express from 'express';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const port = 5500;


// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


