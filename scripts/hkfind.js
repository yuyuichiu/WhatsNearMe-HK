var map, autocomplete, parsedAddress, service, query, queryType;
let results = [];

const searchForm = document.getElementById('search-form');
const searchBtn = document.getElementById('search');
const menuTogglers = document.querySelectorAll(".part-two [type='checkbox']");
const typeOptions = [...document.querySelectorAll(".places")];
const resultArea = document.getElementById("result-area");
const viewToggle = document.querySelector(".view-toggle");




/* Initial setups */
// Implement Auto Complete into the starting location input field
let initAutoComplete = function(){
    // First parameter, element to add autocomplete functionality
    let input = document.getElementById("autocomplete");
    // Second parameter, configurations
    let options = {
        type: ['establishment'],
        // restrict the country of potential results
        componentRestrictions: {'country' : ["hk"] },
        fields: ['place_id', 'geometry', 'name']
    };

    // The autocomplete object
    autocomplete = new google.maps.places.Autocomplete(input,options);       
}()

// Construct a google map to our map element
let initMap = function(){
    map = new google.maps.Map(document.getElementById("map"),{
        center: { lat: 22.46555, lng: 114.00294 },
        zoom: 15,
    })
}()

// Function to create add a marker to map
let addMarker = function(placeInfo, styleIndex){
    let iconStyles = ["assets/pin-start.png","assets/pin-green.png","assets/pin-orange.png","assets/pin-pink.png"]
    let targetIcon = iconStyles[styleIndex];

    let newMarker = new google.maps.Marker({
        position: placeInfo.geometry,
        map: map,
        icon: targetIcon,
        label: {
            text: placeInfo.name,
            className: "map-marker",
        },
        animation: google.maps.Animation.DROP,
    })

    newMarker.addListener("click", () => {
        // Redirects and opens a new tab of the link
        window.open(placeInfo.url,"_blank");
    })
}

// Create the places services
service = new google.maps.places.PlacesService(map);





/* Form UI functionality */
// places menu show/hide (The first one is opened initially)
function toggleMenu(target){
    let menu = target.nextElementSibling;
    // adjust maxHeight for proper transition animation
    if(target.checked){
        menu.style.maxHeight = menu.scrollHeight + "px";
    } else {
        menu.style.maxHeight = 0;
    }
}

// Event listener for each place types, open the first one by default
menuTogglers.forEach((toggler) => { 
    toggler.addEventListener('change', function(){ toggleMenu(this) })
});
[...menuTogglers].slice(0,1)[0].checked = true;
toggleMenu([...menuTogglers].slice(0,1)[0]);


// When user select the place target, update active class & query data
function getTargetQuery(target){
    // Display active choice
    typeOptions.forEach((option) => {
        option.classList.remove('active');
    })
    target.classList.add('active');
    document.getElementById("current-choice").innerText = `目前選擇：${target.innerText}`

    // Update Query
    let targetQuery = target.dataset.query;
    query = !targetQuery ? target.innerText : encodeURIComponent(targetQuery);

    let targetPlaceType = target.dataset.type;
    queryType = !targetPlaceType ? "" : targetPlaceType;
}

typeOptions.forEach((option) => {
    option.addEventListener('click', function(){ getTargetQuery(this) })
})

// Toggle ON/OFF of visibility of the result bar (mobile)
viewToggle.addEventListener('click', toggleResult);
function toggleResult(){
    if(resultArea.classList.contains('hidden')){
        viewToggle.innerHTML = `<i class="fas fa-chevron-down"></i>`;
    } else {
        viewToggle.innerHTML = `<i class="fas fa-chevron-up"></i>`;
    }

    resultArea.classList.toggle('hidden');
}

// The submit button
searchBtn.addEventListener('click', () => {
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
});





/* API Functionality */
// Part A: Parse starting destination into geocoding for coordinates
function startPlacesSearch(){
    // Retrieve user input
    let address = document.getElementById('autocomplete').value;
    parsedAddress = encodeURIComponent(address);

    // Translate address to coordinates through Geocoding API
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${parsedAddress}&components=country:hk&key=AIzaSyDlwvrWTGYvMchhjcIBhjbFGGnS65FO9Yg`)
        .then(data => data.json())
        .then((info) => {
            if(info.status !== "OK"){
                // Failure cases
                console.log("Something went wrong: " + info.status);
                return
            }

            let coordinates = info.results[0].geometry.location;
            // Adjust center of the map
            map.setCenter(coordinates);
            addMarker({ name: '起點', geometry: coordinates },0);

            // Goes on to part B -- the Search
            searchNearbyPlaces(coordinates);
        })
}

// Part B: Search nearby places based on search query provided
// ( Invoked by startPlacesSearch() )
function searchNearbyPlaces(coord){
    // Guard Cases
    if(!query && !queryType){ return }
    if(!coord.lat || !coord.lng){ return }
    console.log("Search Engaged Successfully")

    service.nearbySearch({
        location: coord,
        keyword: query ? query : "",
        type: queryType ? queryType : "",
        // radius: 20000,
        rankBy: google.maps.places.RankBy.DISTANCE,
    }, function(output){
        if(!output.length){
            console.log("ZERO RESULTS AT PLACE SEARCH");
            return
        }

        let result = output.slice(0,3);

        for(let i = 0; i < 3; i++){
            // Collect place information
            let placeInfo = {
                name: result[i].name,
                id: result[i].place_id,
                address: result[i].vicinity,
                geometry: result[i].geometry.location.toJSON(),
            }
            placeInfo.url = `https://www.google.com/maps/dir/?api=1&origin=${parsedAddress}&destination=${placeInfo.geometry.lat}%2C${placeInfo.geometry.lng}&destination_place_id=${placeInfo.id}&travelmode=transit`;

            // Create marker for that place with collected information
            addMarker(placeInfo, i+1);
            displayResult(placeInfo, i+1);
        }
    })
}

// Part C: Display Results on UI
function displayResult(placeInfo, index){
    let result = document.createElement('div');
    result.classList.add('result');
    result.innerHTML = `
        <div class="result-name">${index}. ${placeInfo.name}</div>
        <div class="result-address"><i class="fas fa-map-marker-alt" style="color: ${[,'#E9B821','#E029AB'][index-1]};"></i>${placeInfo.address}</div>
        <div class="result-toolbar">
            <div class="result-viewmap"><i class="fas fa-street-view"></i>移至坐標</div>
            <a href="${placeInfo.url}" class="result-toGoogleMap" target="_blank">
                <img src="assets/googleMapIcon.png" width="24px" height="24px">
                &nbsp;Google Map路線
            </a>
        </div>
    `;

    result.querySelector(".result-viewmap").addEventListener('click', function(){
        toggleResult();
        map.setCenter(placeInfo.geometry);
        map.setZoom(18);
    });

    results.push(result);
    resultArea.appendChild(result);
}