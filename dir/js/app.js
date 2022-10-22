window.addEventListener('load', init);

// Globals

// Available Levels
const levels = {
  easy: 5,
  medium: 3,
  hard: 2
};

// To change level
let currentLevel = levels.medium;

let time = currentLevel;
let score = 0;
let isPlaying;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const highscoreDisplay = document.querySelector('#highscore');
const easy = document.querySelector('#btn-easy');
const medium = document.querySelector('#btn-medium');
const hard = document.querySelector('#btn-hard');




// Initialize Game
function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Load word from array
  showWord();
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);
  // Check game status
  setInterval(checkStatus, 50);
}

// Start match
function startMatch() {
  
  if (matchWords()) {
    showWord();
    isPlaying = true;
    time = currentLevel + 1;
    wordInput.value = '';
    score++;
  }

  // Highscore based on score value for session storage.

  if(typeof sessionStorage['highscore'] === 'undefined' || score >= sessionStorage['highscore']){

    sessionStorage['highscore'] = score;
  }

  // Prevent display of High Score: -1
  if(sessionStorage['highscore'] != -1){

    highscoreDisplay.innerHTML = sessionStorage['highscore'];
  }else{

    highscoreDisplay.innerHTML = 0;
  }

  // If score is -1, display 0
  if (score === -1) {

    scoreDisplay.innerHTML = 0;
  } else {

    scoreDisplay.innerHTML = score;
  }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
async function showWord() {

    const response = await fetch('https://random-word-api.herokuapp.com/word',
    {
        method: 'GET',
    }
  );

  const data = await response.json();

  // Output random word
  currentWord.innerHTML = data[0];
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
    message.innerHTML = `Game Over!!!
      <br><br>
      <h6>To Restart The Game Type The Displayed Word</h6>
    `;
    score = -1;
  }
}

// change levels

easy.addEventListener('click', setLevel);
medium.addEventListener('click', setLevel);
hard.addEventListener('click', setLevel);

// function to change the value of level

let prev = medium
function setLevel(e){

  prev.classList.remove('bt-selected');
  
  if(e === 'hard'){

    prev = hard;
    currentLevel = 2;
  } else if (e === 'medium') {

    prev = medium;
    currentLevel = 3;
  } else {

    prev = easy;
    currentLevel = 5;
  }

  seconds.innerHTML = currentLevel;
  score = 0;
  highscoreDisplay.innerHTML = score;
  sessionStorage['highscore'] = score;
  scoreDisplay.innerHTML = score;

  prev.classList.add('bt-selected');
  
}
