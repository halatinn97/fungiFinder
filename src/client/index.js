let app = (function () {

    let fungiList = [];
    let apiUrl = 'http://localhost:5500';

    async function showFungi() {
        try {
            const response = await fetch(`${apiUrl}/fungi`);
            console.log(response);
            const json = await response.json();

            json.results.forEach(item => {
                const fungus = {
                    default_photo: item.default_photo.medium_url,
                    name: item.name,
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
            //Extract id of fungus observation 
            const id = detailsUrl.split('/').pop();
            //API request uses id to request route on server to retrieve fungus details
            const response = await fetch(`${apiUrl}/fungus/${id}`);
            //Parse response body & return JS object
            const json = await response.json();
            console.log(json);

            const fungusDetails = {
                default_photo: json.default_photo.medium_url,
                name: json.name,
                wikipedia_url: json.wikipedia_url,
                preferred_common_name: json.preferred_common_name,
            };
            return fungusDetails;

        } catch (error) {
            console.error(error);
        }
    }

    async function showFungiGallery() {
        try {
            const response = await fetch(`${apiUrl}/gallery`);
            const data = await response.json();
            const galleryElement = document.getElementById('gallery');
            galleryElement.innerHTML = '';

            for (const imageUrl of data.images) {
                const img = document.createElement('img');
                img.classList.add('allFungi');
                img.src = imageUrl;
                galleryElement.appendChild(img);

                img.addEventListener('click', async function () {
                    const fungusDetails = await showFungusDetails(imageUrl);
                    console.log(fungusDetails);

                    detailsContainer.innerHTML = `
                                <h2>${fungusDetails.name}</h2>
                                <p>Preferred common name: ${fungusDetails.preferred_common_name}</p>
                                <p>More information: <a href="${fungusDetails.wikipedia_url}">${fungusDetails.wikipedia_url}</a></p>
                                <p>Location: ${fungusDetails.location}</p>
                                <p>GPS: ${fungusDetails.geojson}</p>
                              `;
                });
            }
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
        showFungusDetails: showFungusDetails,
        showFungiGallery: showFungiGallery
    }

})();

app.showFungiGallery();
app.showFungusDetails();
app.showFungi();
app.getAll();

/*let allFungi = app.getAll(); //Return fungiList array*/




