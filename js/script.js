let app = (function () {

    let fungiList = [];
    let apiUrl = 'https://api.gbif.org/v1/occurrence/search?taxonKey=5&limit=300';

    async function showFungi() {
        try {
            const response = await fetch(apiUrl);
            const json = await response.json();

            json.results.forEach(item => {
                const fungus = {
                    media: item.media,
                    scientificName: item.scientificName,
                };
                add(fungus);
            });
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
        showFungi: showFungi
    }

})();


//Return fungiList array 

let allFungi = app.getAll();

//Show all fungi

let fungiGallery = document.getElementById('fungiGallery')

//(showFungi() = method of app object!)
app.showFungi().then(function () {
    //Loop through media array of objects & append img URLs onto real images 
    allFungi.forEach(function (fungus) {
        if (fungus.media) {
            fungus.media.forEach(function (image) {
                const img = document.createElement('img');
                img.classList.add('allFungi');
                img.src = image.identifier;
                fungiGallery.appendChild(img);
            });
        }
    });
});

//Currently showing multiple images of same Fungi due to fixed API data - to-do: show only 1 image & reveal rest upon click with more information about the fungi


