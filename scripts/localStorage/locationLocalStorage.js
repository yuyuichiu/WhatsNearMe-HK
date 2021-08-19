const startLocationCheckbox = document.getElementById("save-start");

function readStartLocationLocalStorage () {
  // Checkbox reflect saved preference
  startLocationCheckbox.checked = localStorage.getItem('save-start-location') === "Y" ? true : false;

  // Set auto complete value to last remembered value (if enabled)
  if(localStorage.getItem('save-start-location') === "Y"){
      // update initial starting position to browser saved address
      document.getElementById('autocomplete').value = localStorage.getItem('start-location') || "";
  } else {
      // Clear memory if saving is not enabled
      localStorage.setItem('start-location', "");
  }

  // Event Handler to Toggle local storage
  startLocationCheckbox.addEventListener('change', () => {
    if(startLocationCheckbox.checked){ localStorage.setItem('save-start-location', "Y"); }
    else { localStorage.setItem('save-start-location', "N"); }
  });
}

function updateLocationLocalStorage(){
  if(localStorage.getItem('save-start-location') === "Y"){
      localStorage.setItem('start-location', document.getElementById('autocomplete').value);
  }
}

export {readStartLocationLocalStorage, updateLocationLocalStorage}