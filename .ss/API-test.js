function initMap() {
    // Our desired location, as latitude and longitude
    let location = {
        lat: 22.27871, 
        lng: 114.1855
    }

    // The map
    let map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 20
    });

    // Add marker to the map
    let marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        // A label can be a string OR a marker label object
        label: {
            text: "RSM Hong Kong",
            className: "map-marker",
            color: "rgb(230, 82, 82)",
        },
        animation: google.maps.Animation.DROP,
        title: "RSM Hong Kong"
    });

    marker.addListener("click", () => {
        // Redirects and opens a new tab of the link
        window.open("https://www.google.com/maps/place/RSM+Hong+Kong/@22.278764,114.1832383,17z/data=!3m1!4b1!4m5!3m4!1s0x34040056aa589be5:0x9eb535398da97717!8m2!3d22.2786493!4d114.1854275","_blank");
    })
}

initMap();