/* 
To set up auto complete functionality into input field
*/

// Parameter input => the input field to apply autocomplete
export default function initAutoComplete (input) {
  let options = {
      type: ['establishment'],
      // restrict the country of potential results
      componentRestrictions: {'country' : ["hk"] },
      fields: ['place_id', 'geometry', 'name']
  };

  // The autocomplete object
  const autocomplete = new google.maps.places.Autocomplete(input,options);       

  autocomplete.addListener('place_changed',() => {
      // Scroll down once user has chosen a location through autocomplete
      window.scrollTo(0,window.innerHeight);
  })

  return autocomplete
}