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
                    default_photo: item.default_photo,
                    name: item.name,
                    id: item.id
                };
                add(fungus);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function showFungusDetails(id) {
        console.log(`showFungusDetails id: ${id}`); // add this line
        try {
            //API request uses id to request route on server to retrieve fungus details
            const response = await fetch(`${apiUrl}fungus/${id}`);
            //Parse response body & return JS object
            const json = await response.json();
            console.log(json);

            const fungusDetails = {
                id: json.id,
                default_photo: json.default_photo,
                name: json.name,
                wikipedia_url: json.wikipedia_url,
                preferred_common_name: json.preferred_common_name,
            };
            return fungusDetails;

        } catch (error) {
            console.error(error);
            return { error: 'Something went wrong' };
        }
    }


    async function showFungiGallery() {
        try {
            const response = await fetch(`${apiUrl}/gallery`);
            const data = await response.json();
            const galleryElement = document.getElementById('gallery');
            const detailsContainer = document.getElementById('details');
            galleryElement.innerHTML = '';

            for (const imageUrl of data.images) {
                const img = document.createElement('img');
                img.classList.add('allFungi');
                img.src = imageUrl;
                galleryElement.appendChild(img);

                img.addEventListener('click', async function () {
                    const id = imageUrl.split('/')[4].replace(/\D/g, '');
                    console.log(`id: ${id}`);
                    const fungusDetails = await showFungusDetails(id);
                    console.log(fungusDetails);

                    if (fungusDetails) {
                        await showFungusDetails(id);
                        window.location.href = `${apiUrl}/api/fungus/${id}`;

                        detailsContainer.innerHTML = `
                                <h2>${fungusDetails.name}</h2>
                                <img src= ${fungusDetails.default_photo}>
                                <p>Preferred common name: ${fungusDetails.preferred_common_name}</p>
                                <p>More information: <a href="${fungusDetails.wikipedia_url}">${fungusDetails.wikipedia_url}</a></p>
                              `;
                    }
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
        showFungusDetails: showFungusDetails, showFungiGallery
    }

})();

app.showFungiGallery();
app.showFungusDetails();
app.showFungi();
app.getAll();

/*let allFungi = app.getAll(); //Return fungiList array*/




