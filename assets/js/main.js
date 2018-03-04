'use strict';

document.addEventListener("DOMContentLoaded", function() {

  // Gets the hamburger menu button & main menu
  const button = document.querySelector('.jsMenu');
  const menu = document.querySelector('.jsMainNav');

  // Add an event listener to the button that toggles the menu
  button.addEventListener('click', function() {
    // Checks if the menu is expanded
    const expanded = this.getAttribute('aria-expanded') === 'true';

    // Set aria-expanded to the opposite value thats stored in expanded
    this.setAttribute('aria-expanded', String(!expanded));
    // Toggles the menu being hidden and the css class
    menu.hidden = expanded;
  });



  // Checks if the user interacts with touch, if so add a class to the body
  // This is to show the extra instructions for the projects slider
  window.addEventListener('touchstart', function touched() {
    document.body.classList.add('touch')
    window.removeEventListener('touchstart', touched, false)
  }, false)



  // Sets up the next/prev buttons for the slider
  const projectsSlider = document.querySelector('.projects-slider');
  const project = document.querySelector('.project');
  const nextSlide = document.querySelector('.project-next');
  const prevSlide = document.querySelector('.project-previous');

  if(nextSlide && prevSlide) {
    nextSlide.onclick = function () {
      projectsSlider.scrollLeft += project.offsetWidth;
    };

    prevSlide.onclick = function () {
      projectsSlider.scrollLeft -= project.offsetWidth;
    };
  }

}); // end doc ready
