(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let app = (function () {

    let fungiList = [];
    let apiUrl = 'http://localhost:5500';

    async function showFungi() {
        try {
            const response = await fetch(`${apiUrl}/api/fungi`);
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

    async function showFungusDetails(imageUrl) {
        try {
            if (imageUrl) {
                // Extract the ID from the URL
                const id = imageUrl.split('/')[4].replace(/\D/g, '');
                console.log(`showFungusDetails id: ${id}`);
                //API request uses id to request route on server to retrieve fungus details
                const response = await fetch(`${apiUrl}/api/fungus?id=${id}`);
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
            } else {
                console.log('Image URL is not defined');
            }
        } catch (error) {
            console.error(error);
            return { error: 'Something went wrong' };
        }
    }


    async function showFungiGallery() {
        try {
            const response = await fetch(`${apiUrl}/api/gallery`);
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
                    const fungusDetails = await showFungusDetails(imageUrl);
                    console.log(fungusDetails);

                    if (fungusDetails) {
                        const id = fungusDetails.id;
                        const detailsWindow = window.open(`${apiUrl}/fungus?id=${fungusDetails.id}`, '_blank');
                        detailsWindow.onload = function () {
                            const detailsContainer = detailsWindow.document.getElementById('details');

                            detailsContainer.innerHTML = `
                                <h2>${fungusDetails.name}</h2>
                                <img src= ${fungusDetails.default_photo}>
                                <p>Preferred common name: ${fungusDetails.preferred_common_name}</p>
                                <p>More information: <a href="${fungusDetails.wikipedia_url}">${fungusDetails.wikipedia_url}</a></p>
                            `;
                        }
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





},{}]},{},[1]);
