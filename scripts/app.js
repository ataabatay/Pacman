console.log('working')

// Elements //
// All gamestates - these are individual pages and include
  // 0: start-menu screen (optional)
  // 1: loading screen (optional)
  // 2: gameplay-screen (required)
  // 3: gameover-screen (required)
  // 4: pause-screen (optional)
  const gameStates = document.querySelectorAll('.gamestate')
    // play button - to start gameplay
  const startBtn = document.querySelector('.start-play')
  
  // grid-wrapper width to create the cells
  const gridWrapperWidth = document.querySelector('.grid-wrapper').offsetWidth

  // grid area to create and append cells into
  const grid = document.querySelector('.grid')
  
  // current-score - to show current score
  // high-score - to fetch and show the high score from localstorage
  // grid - to create the gameplay grid cells inside as elements
  // cell - every individual cell that's created with the createGrid() function
  // current-score - to display the current score
  // high-score - to display the high score

// Variables
// gameState - this will be the global variable that's deciding which screen is being shown
// 0: start-menu screen (optional)
// 1: loading screen (optional)
// 2: gameplay-screen (required)
// 3: gameover-screen (required)
// 4: pause-screen (optional)
let gameState = 0 // on page load we start on the start-menu

// gameRunning - boolean to help with other functions checking to see if the game is running or not
let gameRunning

// standard Pacman maze width and height ratios
const stdWidth = 28 // this will be the base variable we use to decide how many grid cells to create
const stdHeight = 31 // this will be the base variable we use to decide how many rows of cells we're going to create
// all the cells to be created in an array

// the width and height of our cells dynamically created based on screen size
const width = gridWrapperWidth / stdWidth
console.log(width)
// cell count - how many grid cells we need to create
const cellCount = stdHeight * stdWidth
console.log(cellCount)


// startingPositionPacman - starting location of Pacman
// startingPositionBlinky - starting location of Blinky
// startingPositionPinky - starting location of Pinky
// startingPositionInky - starting location of Inky
// startingPositionClyde - starting location of Clyde

// currentPositionPacman - current location of Pacman
// currentPositionBlinky - current location of Blinky
// currentPositionPinky - current location of Pinky
// currentPositionInky - current location of Inky
// currentPositionClyde - current location of Clyde 

// currentScore - score in the active gameplay
// highScore - high score to be stored inside the localstorage for persistence



// Functions

// screen swapper to move from screen to screen
function swapScreen(gameState) {
  // hide all screens to decide which one to show later
  gameStates.forEach(state => state.classList.add('hidden'))
  // show the relevant screen
  gameStates[gameState].classList.remove('hidden')
}

// createGrid() - function to create a grid where the game will be played
function createGrid() {
// creates a grid of divs based on the width of the grid-wrapper
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div')
    cell.innerText = i
    cell.id = i
    cell.style.width = `${width}px`
    cell.style.height = `${width}px`
    cell.classList.add('cell')
    grid.append(cell)
  }

// adds ".cell" class to all the created divs
// adds ".food" class to all the cell divs where food will be
// adds ".oob" class to the cell divs that are out-of-bounds
// adds ".warp" class to the cell divs that the sprites can go through
// adds ".powerUp" class to the cell divs where power pellets will be placed
// addSprites() - function to add Pacman and Ghosts to the screen]
  // adds ".pacman" class to the relevant cell
  // adds ".blinky" calss to the relevant cell
  // adds ".pinky" calss to the relevant cell
  // adds ".inky" calss to the relevant cell
  // adds ".clyde" calss to the relevant cell
  // if gameRunning is false stop the game and swap the screen to the relevant one based on gameState
}
createGrid()

// startGame() - function to run when the start button is 'clicked'
// swaps the screen to the gameplay screen
function startGame() {
  gameRunning = true
  gameState = 1
  // swap to loading screen
  swapScreen(gameState)
  // swap to gameplay screen with a little delay to simulate loading
  setTimeout(function() {
    gameState = 2
    swapScreen(gameState)
  }, 3000)

  createGrid()
}


// move() - function to make Pacman move around the screen
  // movement is enabled by keyup style or keydown style (alternative is key up set the direction until a new direction is set or a wall/ghost is hit)
  // When Pacman changes position (moves) - changing position is adding a value to the starting position based on the key pressed and updating current position and repeating every time that event happens
    // 
    // Increase currentscore by 10 + if highscore <= currentscore update highscore as well
    // Remove the dot from the screen - meaning remove .food class from the cell

// ghostsMove() - function that runs as long as gameRunning is true
  // ???

// Event Listeners
// startbutton.onclick.run startGame eventlistener
startBtn.addEventListener('click', startGame)
// keystroke listener event that listens for key presses


