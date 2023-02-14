//PLACEHOLDER CODE FOR API

fungiList = [
    { name: 'Trametes Fr.,1835', location: 'Denmark' },
    { name: 'Tremella mesenterica Retz.', location: 'Australia' },
    { name: 'Amanita egregia D.A.Reid', location: 'Australia' }
];

//Show all fungis 

fungiList.forEach(function showFungis(fungi) {
    console.log(fungi.name + ' is located in ' + fungi.location);
});