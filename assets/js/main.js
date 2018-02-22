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

  const projectsSlider = document.querySelector('.projects-slider');
  const slideLeft = document.querySelector('.project-next');
  const slideRight = document.querySelector('.project-previous');

  slideLeft.onclick = function () {
      projectsSlider.scrollLeft += 200;
  };

  slideRight.onclick = function () {
      projectsSlider.scrollLeft -= 200;
  };

}); // end doc ready