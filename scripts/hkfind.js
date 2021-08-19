import initAutoComplete from './initial-setup/initAutoComplete.js'
import initMap from './initial-setup/initMap.js'
import initEventListeners from './initial-setup/initEventListeners.js'
import { readStartLocationLocalStorage, updateLocationLocalStorage } from './localStorage/locationLocalStorage.js'
import { mapAddMarker, mapClearMarkers } from './google-map/google-map.js'

let parsedAddress, query, queryType, coordinates;
let results = [];
let mapMarkers = [];

const searchForm = document.getElementById('search-form');
const resultArea = document.getElementById("result-area");
const searchAgainBtn = document.getElementById("search-again");
const customQuery = document.getElementById("custom-query");


/* Initial setups */
const autocomplete = initAutoComplete(document.getElementById("autocomplete"));  // Google auto complete API
const map = initMap(document.getElementById("map"));                             // Google map setup
const service = new google.maps.places.PlacesService(map);                       // Google places API service

initEventListeners();
readStartLocationLocalStorage();


/* Form UI functionality */
// When user select the place target, update active class & query data
function getQueryBySelection(target){
    if(customQuery.value || !target) return;

    // Display active choice
    typeOptions.forEach((option) => {
        option.classList.remove('active');
    })
    target.classList.add('active');
    document.getElementById("current-choice").innerText = `目前選擇：${target.innerText}`

    // Query input by selection
    let targetQuery = target.dataset.query;
    query = !targetQuery ? target.innerText : encodeURIComponent(targetQuery);

    let targetPlaceType = target.dataset.type;
    queryType = !targetPlaceType ? "" : targetPlaceType;
}

function getQueryByCustomInput(){
    if(!customQuery.value) {
        getQueryBySelection(document.querySelector(".places.active"));
        document.getElementById("current-choice").innerText = `目前選擇：${'_'}`
        return;
    }

    query = customQuery.value;
    queryType = customQuery.value;
    document.getElementById("current-choice").innerText = `目前選擇：${customQuery.value}`
    document.querySelector(".places.active") && document.querySelector(".places.active").classList.remove('active');
}

const typeOptions = [...document.querySelectorAll(".places")];
typeOptions.forEach((option) => { option.addEventListener('click', function(){ getQueryBySelection(this) }) })

customQuery.addEventListener('input', function() { getQueryByCustomInput() })

// Make map focus to start location when focus-start is clicked
document.getElementById("focus-start").addEventListener('click',() => {
    map.setCenter(coordinates);
    map.setZoom(15);
});

// Restart another new search
searchAgainBtn.addEventListener('click', () => {
    // Clear current search result & markers
    autocomplete
    resultArea.querySelectorAll('.result').forEach((result) => { result.remove() })
    mapMarkers = mapClearMarkers(mapMarkers);

    // Show the form
    searchForm.style.opacity = 1;
    searchForm.style.display = "block";
})

// Loading
function loadingStart(targetElement){
    let displayLoading = document.createElement('div');
    displayLoading.classList.add('loading');
    targetElement.appendChild(displayLoading);
}

function loadingEnd(targetElement){
    targetElement.querySelector(".loading").remove();
}

// The submit button
document.getElementById('search').addEventListener('click', searchButtonPressed);
document.addEventListener('keydown', (e) => {
    if(e.key === "Enter" && !document.getElementById('search').classList.contains('hidden')){
        searchButtonPressed(); }
})

function searchButtonPressed(){
    // Validations
    let address = document.getElementById('autocomplete').value;
    if(!query || !address){ return }

    // Once validated, Hide the form and make user scroll see the map
    searchForm.style.opacity = 0;
    searchForm.style.display = "none";
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    
    // Engage the search
    startPlacesSearch();
    updateLocationLocalStorage();
    loadingStart(resultArea);
}



/* API Functionality */
// Part A: Parse starting destination into geocoding for coordinates
function startPlacesSearch(){
    // Retrieve user input
    let address = document.getElementById('autocomplete').value;
    parsedAddress = encodeURIComponent(address);

    // Translate address to coordinates through Geocoding API
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${parsedAddress}&components=country:hk&key=AIzaSyBRzIkLqS59M_6neW0HHrGfv_eFdrJqK2E`)
    .then(data => data.json())
    .then((info) => {
        if(info.status !== "OK"){
            console.log(info);
            throw new Error(info.error_message);
        }

        coordinates = info.results[0].geometry.location;
        // Adjust center of the map
        map.setCenter(coordinates);
        mapAddMarker({ name: '起點', geometry: coordinates }, 0, mapMarkers, map);

        // Goes on to part B -- the Search
        searchNearbyPlaces(coordinates);
    }).catch((error) => {
        // Failure cases
        console.log("Something went wrong: " + error.message);

        loadingEnd(resultArea);
        displayErrorMessage(error.message);   
    })
}

// Part B: Search nearby places based on search query provided
// ( Invoked by startPlacesSearch() )
function searchNearbyPlaces(coord){
    // Guard Cases
    if(!query && !queryType){ return }
    if(!coord.lat || !coord.lng){ return }

    service.nearbySearch({
        location: coord,
        keyword: query ? query : "",
        type: queryType ? queryType : "",
        // radius: 20000,
        rankBy: google.maps.places.RankBy.DISTANCE,
    }, function(output){
        if(!output.length){
            loadingEnd(resultArea);
            displayErrorMessage();
            return
        }

        let result = output.slice(0,5);

        result.forEach((place, idx) => {
            // Collect place information & add markers dynamically
            let placeInfo = {
                name: place.name,
                id: place.place_id,
                address: place.vicinity,
                geometry: place.geometry.location.toJSON(),
            }
            placeInfo.url = `https://www.google.com/maps/dir/?api=1&origin=${parsedAddress}&destination=${placeInfo.geometry.lat}%2C${placeInfo.geometry.lng}&destination_place_id=${placeInfo.id}&travelmode=transit`;

            mapAddMarker(placeInfo, idx+1, mapMarkers, map);
            displayResult(placeInfo, idx+1);
        });
        loadingEnd(resultArea);
    })
}

// Part C: Display Results on UI
function displayResult(placeInfo, index){
    let result = document.createElement('div');
    result.classList.add('result');
    result.innerHTML = `
        <div class="result-name">${index}. ${placeInfo.name}</div>
        <div class="result-address"><i class="fas fa-map-marker-alt" style="color: ${[,'#E9B821','#E029AB','#3387e6','#e234f2'][index-1]};"></i>${placeInfo.address}</div>
        <div class="result-toolbar">
            <div class="result-viewmap"><i class="fas fa-street-view"></i>移至坐標</div>
            <a href="${placeInfo.url}" class="result-toGoogleMap" target="_blank">
                <img src="assets/googleMapIcon.png" width="24px" height="24px">
                &nbsp;Google Map路線
            </a>
        </div>
    `;

    result.querySelector(".result-viewmap").addEventListener('click', function(){
        map.setCenter(placeInfo.geometry);
        map.setZoom(16);
    });

    results.push(result);
    resultArea.appendChild(result);
}

// Part C2: Display error message to result
function displayErrorMessage(apiErrorMsg = false){
    let error = document.createElement('div');
    error.classList.add('result');
    let errorTitle = apiErrorMsg ? `伺服器端出現問題: ${apiErrorMsg}` : `沒有《${query}》的搜尋結果...`;
    let errorDescription = apiErrorMsg ? `請電郵問題至yuichiuyu1915@gmail.com (俞先生)` : `可能係地方名打錯/無效，或者係揾唔到地方。試下改一改搜尋？`;

    error.innerHTML = `
        <div class="result-name" style="text-align: center;">${errorTitle}</div>
        <div>${errorDescription}</div>
    `;

    resultArea.appendChild(error);
}