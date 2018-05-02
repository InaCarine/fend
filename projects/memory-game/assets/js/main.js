'use strict';

/*
* TODO: Refactor code to use OOP instead.
* TODO: Make this accessible
* TODO: Make timer affect star rating
*/
document.addEventListener("DOMContentLoaded", function() {

  /* Global settings */
  const cardContainer = document.querySelector('.cards');
  const winOverlay = document.querySelector('.win-overlay');
  let moves = 0;
  let stars = 3;
  let previousCard = null;
  let isComparing = false;
  let numPairs = 0;
  let startTime, endTime, startTimer;
  let firstClick = 1;
  
  let cards = ['bug', 'beer', 'anchor', 'android', 'apple', 'coffee', 'reddit-alien', 'github-alt'];

  /*
   * @description Display the cards on the page
   *   - shuffle the list of cards using the provided "shuffle" method below
   *   - loop through each card and create its HTML
   *   - add each card's HTML to the page
   */
  function createDeck() {
    let duplicatedCards = duplicate(cards);
    updateScore('.stars', '.moves');
    shuffle(duplicatedCards);

    let cardHTML = '';
    for (let i = 0; i < duplicatedCards.length; i++) {
      cardHTML += '<li class="card"><div class="face--back"></div>\
        <div class="face--front fa fa-' + duplicatedCards[i] + '"></div></li>';
    }
    cardContainer.innerHTML = cardHTML;
  }
  createDeck();

  /*
   * @description Duplicate items in an array
   * @param {array} array
   * @returns {array} a duplicated array
  */
  function duplicate(array) {
    let cards = []

    for(let i = 0; i < array.length; i++) {
      cards.push(array[i]);
      cards.push(array[i]);
    }
    return cards;
  }

  /*
  * @description Shuffle items in an array
  * Shuffle function from http://stackoverflow.com/a/2450976
  * @param {array} array
  * @returns {array} randomized array
  */
  function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }


  /*
  * @description Update the score of the game
  * @param {number} nrStars - how many stars the user got
  * @param {number} nrMoves - moves the user have taken
  */
  function updateScore(nrStars, nrMoves) {
    let starString = "";
    let starsNode = document.querySelector(nrStars);
    let movesNode = document.querySelector(nrMoves);

    movesNode.innerHTML = moves + ' move' + (moves === 1 ? '' : 's');

    if( moves > 20 ) {
      stars = 1;
    } else if( moves > 15 ) {
      stars = 2;
    }
    
    for (let i = 0; i < stars; i++) {
      starString += '<li class="fa fa-star star"></li>';
    }
    starsNode.innerHTML = starString;
  }

  
  /*
  * @description Function for setting up the timer, showing time in minutes:seconds
  * Function from https://stackoverflow.com/questions/1210701/compute-elapsed-time
  * @returns {string} - The amount of time spent in minutes:seconds
  */
  function timer() {
    endTime = new Date();
    let timeDiff = endTime - startTime;
    // strip the ms
    timeDiff /= 1000;

    // get seconds
    let seconds = Math.round(timeDiff % 60);

    // remove seconds from the date
    timeDiff = Math.floor(timeDiff / 60);

    // get minutes
    let minutes = Math.round(timeDiff % 60);

    // remove minutes from the date
    timeDiff = Math.floor(timeDiff / 60);
    return minutes + ":" + seconds;
  }
  
  /*
  * @description Stops the timer
  */
  function stopTimer() {
    clearInterval(startTimer);
    document.querySelector('.timer').innerHTML = '0:0';
    firstClick = 1;
  }


  /*
  * Reset the game, recreate the cards and update the score & timer
  */
  document.querySelector('.restart').addEventListener('click', resetGame);
  document.querySelector('.replay').addEventListener('click', function () {
    winOverlay.style.display = 'none';
    resetGame();
  });
  
  /*
  * @description Resets/Restarts the game my reshuffling the cards
  * and resets the score and timer
  */
  function resetGame() {
    cardContainer.innerHTML = "";
    moves = 0; stars = 3; numPairs = 0;
    previousCard = null;
    stopTimer();
    updateScore('.stars', '.moves');
    createDeck();
  }

  /*
  * @descriptions Displays a popup with the users final score
  */
  function win() {
    document.querySelector('.final-time').innerHTML = document.querySelector('.timer').innerHTML;
    stopTimer();
    updateScore('.final-stars', '.final-moves');
    winOverlay.style.display = 'block';
  }

  
  /*
  * set up the event listener for a card. If a card is clicked:
  *  - display the card's symbol (put this functionality in another function that you call from this one)
  *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
  *  - if the list already has another card, check to see if the two cards match
  *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
  *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
  *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
  *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
  */
  cardContainer.addEventListener('click', checkCard);

  /*
  * @description Checks if the cards are matching
  * @param {object} event target
  * @returns if the card already have been flipped or two cards are being compared
  */
  function checkCard(e) {
    const currentCard = e.target.parentNode;

    // If this is the first card, start the timer
    if(firstClick) {
      startTime = new Date();
      startTimer = setInterval(function () {
        document.querySelector('.timer').innerHTML = timer();
      }, 1000);

      firstClick = 0;
    }

    // Return if its not a card or the card is already flipped or two cards are being compared
    if (!currentCard.classList.contains('card') 
      || currentCard.classList.contains('is-flipped')
      || isComparing) return;
    
    // Flip the card
    flipCard(currentCard, true);

    // If this is the first card of the turn, save it
    // else if previous card is a match with the curret card, match them
    // else cards does not match and needs to be flipped back
    if(!previousCard) {
      previousCard = currentCard;
    } else if (previousCard.lastChild.classList.contains(currentCard.lastChild.classList[2])) {
      isComparing = true;
      matchCards(currentCard, true);
    } else {
      isComparing = true;
      setTimeout(function () {
        matchCards(currentCard);
      }, 600);    
    }
    
    // Game won if all cards are matched
    if (numPairs === cards.length) setTimeout(function() {win()}, 500);
  }

  /*
  * @description Flips the cards, if front is true, show the front, else turn them back
  * @param {object} card - the card being flipped
  * @param {boolean} front - if the front should be showing
  */
  function flipCard(card, front = false) {
    if(front) {
      card.classList.add('is-flipped');
    } else {
      card.classList.remove('is-flipped');
      previousCard.classList.remove('is-flipped');
    }
  }

  /*
  * @description Matches the card if they are paired, if not it turns them back.
  * and update the score to reflect the result
  * @param {object} currentCard
  * @param {boolean} paired - if they have been paired
  */
  function matchCards(currentCard, paired = false) {
    if(paired) {
      previousCard.classList.add('is-matched');
      currentCard.classList.add('is-matched');
      numPairs++;
    } else {
      flipCard(currentCard);
    }

    previousCard = null;
    moves++;
    updateScore('.stars', '.moves');
    isComparing = false;
  }

}); // end doc ready
