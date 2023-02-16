(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
let app = (function () {

    let fungiList = [];
    let apiUrl = 'http://localhost:5500/_api/occurrence/search?taxonKey=5&limit=300';

    async function showFungi() {
        try {
            const response = await fetch(apiUrl);
            console.log(response);
            const json = await response.json();

            json.results.forEach(item => {
                const fungus = {
                    media: item.media,
                    scientificName: item.scientificName,
                    detailsUrl: '/occurrence/' + item.key
                };
                add(fungus);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function showFungusDetails(detailsUrl) {
        try {
            const response = await fetch(`https://api.gbif.org/v1${detailsUrl}`);
            const json = await response.json();
            console.log(json);
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
    //Loop through media array of objects & append img URLs onto real images 
    allFungi.forEach(function (fungus) {
        if (fungus.media) {
            fungus.media.forEach(function (image) {
                const img = document.createElement('img');
                img.classList.add('allFungi');
                img.src = image.identifier;
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




},{}]},{},[1]);
