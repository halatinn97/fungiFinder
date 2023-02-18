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
                    default_photo: item.taxon.default_photo.medium_url,
                    name: item.taxon.name,
                    detailsUrl: `/fungus/${item.id}`
                };
                add(fungus);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function showFungusDetails(detailsUrl) {
        try {
            const id = detailsUrl.split('/').pop();
            const response = await fetch(`fungus/${id}`);
            const json = await response.json();
            console.log(json);

            const fungusDetails = {
                default_photo: item.default_photo.medium_url,
                name: item.taxon.name,
                wikipedia_url: item.taxon.wikipedia_url,
                preferred_common_name: item.taxon.preferred_common_name,
                geojson: item.taxon.geojson.coordinates,
                location: item.taxon.location
            };
            return fungusDetails;

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
        if (fungus.default_photo && fungus.default_photo.length > 0) {
            fungus.default_photo.forEach(function (image) {
                const img = document.createElement('img');
                img.classList.add('allFungi');
                if (fungus.image) {
                    img.src = `/gallery/${fungus.image.split('/').pop()}`;
                }
                fungiGallery.appendChild(img);

                //Show details of fungus upon click
                img.addEventListener('click', async function () {
                    const fungusDetails = await app.showFungusDetails(fungus.detailsUrl);
                    console.log(fungusDetails);
                    // Show fungus details on the page
                    detailsContainer.innerHTML = `
                        <h2>${fungusDetails.default_photo}</h2>
                        <p>Name: ${fungusDetails.name}</p>
                        <p>Preferred common name: ${fungusDetails.preferred_common_name}</p>
                        <p>More information: ${fungusDetails.wikipedia_url}</p>
                        <p>Location: ${fungusDetails.location}</p>
                        <p>GPS: ${fungusDetails.geojson}</p>  
                    `;
                });
            });
        }
    });
});

//Currently showing multiple images of same Fungi due to fixed API data - to-do: show only 1 image & reveal rest upon click with more information about the fungi



