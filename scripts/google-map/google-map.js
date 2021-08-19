/* Function to manage google map behaviour */

function mapAddMarker(placeInfo, styleIndex, markerArray, map) {
  const iconStyles = [
    "assets/pin-start.png",
    "assets/pin-green.png",
    "assets/pin-orange.png",
    "assets/pin-pink.png",
    "assets/pin-blue.png",
    "assets/pin-purple.png",
  ];

  let newMarker = new google.maps.Marker({
    position: placeInfo.geometry,
    map: map,
    icon: iconStyles[styleIndex],
    label: {
      text: placeInfo.name,
      className: "map-marker",
    },
    animation: google.maps.Animation.DROP,
    zIndex: 5 - styleIndex, // The first marker will have higher z-index than the others
  });

  newMarker.addListener("click", () => {
    window.open(placeInfo.url, "_blank");   // Open the google link of that location
  });

  // Record 
  markerArray.push(newMarker);
}

function mapClearMarkers(markerArray) {
  markerArray.forEach((marker) => {
    marker.setMap(null)
  });

  return [];
}

export { mapAddMarker, mapClearMarkers };
