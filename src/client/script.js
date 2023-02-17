let app = (function () {

    let fungiList = [];
    let apiUrl = 'http://localhost:5500';

    async function showFungi() {
        try {
            const response = await fetch(apiUrl);
            console.log(response);
            const json = await response.json();

            json.results.forEach(item => {
                const fungus = {
                    media: item.media,
                    scientificName: item.scientificName,
                    detailsUrl: `/fungus/${item.key}`
                };
                add(fungus);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function showFungusDetails(detailsUrl) {
        try {
            const key = detailsUrl.split('/').pop();
            const response = await fetch(`fungus/${key}`);
            const json = await response.json();
            console.log(json);
            return json;
            /*
            const fungusDetails = {
                media: json.media,
                scientificName: json.scientificName,
                genericName: json.genericName,
                country: json.country,
                species: json.species,
                decimalLongitude: json.decimalLongitude,
                decimalLatitude: json.decimalLatitude,
            };
            return fungusDetails;
            */
        } catch (error) {
            console.error(error);
        }
    }

    function add(fungus) {
        if (typeof (fungus) === 'object') {
            fungiList.push(fungus);
        } else {
            return 0;
        }
    }

    function getAll() {
        return fungiList;
    }

    return {
        add: add,
        getAll: getAll,
        showFungi: showFungi,
        showFungusDetails: showFungusDetails
    }

})();


let allFungi = app.getAll(); //Return fungiList array 

let fungiGallery = document.getElementById('fungiGallery');
let detailsContainer = document.getElementById('details');

app.showFungi().then(function () {
    console.log('script.js loaded')
    //Loop through media array of objects & append img URLs onto real images 
    allFungi.forEach(function (fungus) {
        if (fungus.media && fungus.media.length > 0) {
            fungus.media.forEach(function (image) {
                const img = document.createElement('img');
                img.classList.add('allFungi');
                if (fungus.image) {
                    img.src = `/fungi/media/${fungus.image.split('/').pop()}`;
                }
                fungiGallery.appendChild(img);

                //Show details of fungus upon click
                img.addEventListener('click', async function () {
                    const fungusDetails = await app.showFungusDetails(fungus.detailsUrl);
                    console.log(fungusDetails);
                    // Show fungus details on the page
                    detailsContainer.innerHTML = `
                        <h2>${fungusDetails.scientificName}</h2>
                        <p>Generic Name: ${fungusDetails.genericName}</p>
                        <p>Country: ${fungusDetails.country}</p>
                        <p>Species: ${fungusDetails.species}</p>
                        <p>Longitude: ${fungusDetails.decimalLongitude}</p>
                        <p>Latitude: ${fungusDetails.decimalLatitude}</p>  
                    `;
                });
            });
        }
    });
});

//Currently showing multiple images of same Fungi due to fixed API data - to-do: show only 1 image & reveal rest upon click with more information about the fungi



