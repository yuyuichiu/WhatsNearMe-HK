/* 
The google map extracted from google Maps API
*/

// Construct a google map to our map element, returns the map object.
export default function initMap(mapDOM) {
  const map = new google.maps.Map(mapDOM,{
      center: { lat: 22.2860, lng: 114.1915 },
      zoom: 15,
  })

  return map;
}