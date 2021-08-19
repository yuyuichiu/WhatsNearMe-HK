/* 
A file to group independent event listeners that was added initially.
*/

const menuTogglers = document.querySelectorAll(".part-two [type='checkbox']");
const focusStartButton = document.getElementById("focus-start");
const viewToggle = document.querySelector(".view-toggle");

export default function initEventListeners() {
  // When user click the bar, hide / show the menu of target place choices
  menuTogglers.forEach((toggler) => {
      toggler.addEventListener('change', function(){
        let menu = this.nextElementSibling;
        this.checked ? menu.classList.add('hide') : menu.classList.remove('hide');
      })
  })

  // Make map focus to start location when focus-start is clicked
  focusStartButton.addEventListener('click',() => {
    map.setCenter(coordinates);
    map.setZoom(15);
  });

  // Show the submit button when user scrolled to part B of the form
  document.addEventListener('scroll',function(){
    let currentScrollY = document.documentElement.scrollTop;
    let triggerY = window.innerHeight*0.5;
    const naviBtn = document.querySelectorAll(".navi-btn");

    if(currentScrollY > triggerY){
        naviBtn.forEach((btn) => { btn.classList.remove('hidden') })
    } 
    else {
        naviBtn.forEach((btn) => { btn.classList.add('hidden') })
    }
  })
  
  // Toggle ON/OFF of visibility of the result bar (mobile)
  viewToggle.addEventListener('click', () => {
    viewToggle.innerHTML = document.getElementById("result-area").classList.contains('hidden') 
    ? `<i class="fas fa-chevron-down"></i>` 
    : `<i class="fas fa-chevron-up"></i>`;
    
    document.getElementById("result-area").classList.toggle('hidden');
  });
  
  // The back to top button
  const goTopBtn = document.getElementById('backtotop');
  goTopBtn.addEventListener('click', () => { window.scrollTo(0,0) });
}